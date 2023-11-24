import mongoose from 'mongoose';

mongoose.connect('mongodb+srv://dbUser:1q2w3e@cluster0.7kqh6qi.mongodb.net/')

mongoose.connect(DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Error de conexión a MongoDB:'));
db.once('open', async () => {
  console.log('Conexión exitosa a MongoDB.');
});

export default db;
