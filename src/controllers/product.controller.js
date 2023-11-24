import DaoFactory from '../dao/daoFactory.js';
import ProductDto from '../dto/productDto.js';

const productDao = DaoFactory.createDao('product');

const productController = {
  getProducts: async (req, res) => {
    try {
      const products = await productDao.getProducts();
      const productDtos = products.map(product => new ProductDto(product));
      res.json(productDtos);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  addProduct: async (req, res) => {
    const product = req.body;
    try {
      const newProduct = await productDao.addProduct(product);
      const productDto = new ProductDto(newProduct);
      res.status(201).json(productDto);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  updateProduct: async (req, res) => {
    const productId = req.params.id;
    const updatedProductData = req.body;
    try {
      const updatedProduct = await productDao.updateProduct(productId, updatedProductData);
      if (!updatedProduct) {
        return res.status(404).json({ error: 'Product not found' });
      }
      const productDto = new ProductDto(updatedProduct);
      res.json(productDto);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  deleteProduct: async (req, res) => {
    const productId = req.params.id;
    try {
      const deletedProduct = await productDao.deleteProduct(productId);
      if (!deletedProduct) {
        return res.status(404).json({ error: 'Product not found' });
      }
      res.json({ message: `Product with ID ${productId} deleted successfully` });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  getProductById: async (req, res) => {
    const productId = req.params.id;
    try {
      const product = await productDao.getProductById(productId);
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
      const productDto = new ProductDto(product);
      res.json(productDto);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
};

export default productController;
