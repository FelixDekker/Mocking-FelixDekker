import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { engine } from 'express-handlebars';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';
import mongoose from 'mongoose';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import ProductRouter from './routes/productRouter.js';
import CartRouter from './routes/cartRouter.js';
import AuthRouter from './routes/authRoutes.js';
import passport from './passport.js';
import ProductService from './dao/services/product.service.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 8080;

mongoose
  .connect('mongodb+srv://dbUser:1q2w3e@cluster0.7kqh6qi.mongodb.net/')
  .then(() => console.log('BDD conectada'))
  .catch((error) =>
    console.log('Error en conexion con MongoDB ATLAS: ', error)
  );

app.use(
  session({
    secret: 'felix123',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: 'mongodb+srv://dbUser:1q2w3e@cluster0.7kqh6qi.mongodb.net/',
    }),
  })
);

const server = createServer(app);
const io = new Server(server);
const productService = new ProductService();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const publicDirectory = path.join(__dirname, 'src', 'public');
app.use(express.static(publicDirectory));

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'src', 'views'));

app.use(passport.initialize());
app.use(passport.session());

app.get('/mockingproducts', async (req, res) => {
  try {
    const mockProducts = await productService.generateMockProducts(100);
    res.status(200).json(mockProducts);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });

  socket.on('newProduct', async (newProduct) => {
    try {
      const addedProduct = await productService.addProduct(newProduct);
      io.emit('productAdded', addedProduct);
    } catch (error) {
      console.error(error.message);
      socket.emit('error', { error: 'Internal Server Error' });
    }
  });

  socket.on('deleteProduct', async (productId) => {
    try {
      await productService.deleteProduct(productId);
      io.emit('productDeleted', productId);
    } catch (error) {
      console.error(error.message);
      socket.emit('error', { error: 'Internal Server Error' });
    }
  });
});

app.use('/auth', AuthRouter);
app.use('/api/products', ProductRouter);
app.use('/api/cart', CartRouter);

app.use((err, req, res, next) => {
  console.error('An error occurred:', err);

  const errorMessage =
    err.message === 'InvalidProductData'
      ? 'Invalid product data'
      : 'Internal Server Error';

  res.status(500).json({ error: errorMessage });
});

export default app;
