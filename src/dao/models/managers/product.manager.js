import Product from '../models/product.model.mjs';

class ProductManager {
  async addProduct(product) {
    try {
      if (!product.title || !product.description || !product.price || !product.thumbnail || !product.code || !product.stock) {
        throw new Error("All fields are mandatory.");
      }

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
      if (!updatedProduct.title || !updatedProduct.description || !updatedProduct.price || !updatedProduct.thumbnail || !updatedProduct.code || !updatedProduct.stock) {
        throw new Error("All fields are mandatory.");
      }

      const product = await Product.findByIdAndUpdate(id, updatedProduct, { new: true });
      if (!product) {
        throw new Error("Product not found");
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
        throw new Error("Product not found");
      }

      return id;
    } catch (error) {
      throw error;
    }
  }
}

export default ProductManager;
