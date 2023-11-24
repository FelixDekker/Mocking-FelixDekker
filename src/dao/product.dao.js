import Product from '../dao/models/product.model.js';

class ProductDao {
  async addProduct(product) {
    try {
      const newProduct = new Product(product);
      await newProduct.save();
      return newProduct;
    } catch (error) {
      throw error;
    }
  }

  async getProducts() {
    try {
      return await Product.find({});
    } catch (error) {
      throw error;
    }
  }

  async updateProduct(id, updatedProduct) {
    try {
      const product = await Product.findByIdAndUpdate(id, updatedProduct, { new: true });
      if (!product) {
        throw new Error('Product not found');
      }
      return product;
    } catch (error) {
      throw error;
    }
  }

  async deleteProduct(id) {
    try {
      const product = await Product.findByIdAndDelete(id);
      if (!product) {
        throw new Error('Product not found');
      }
      return id;
    } catch (error) {
      throw error;
    }
  }

}

export default ProductDao;
