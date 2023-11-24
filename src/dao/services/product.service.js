import Product from '../models/product.model.js';

class ProductService {
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

  async getFilteredAndSortedProducts(filter, limit, page, sortField, query) {
    try {
      const filterObject = {};
      if (filter.category) {
        filterObject.category = filter.category;
      }
      if (filter.available !== undefined) {
        filterObject.available = filter.available;
      }

      const queryObject = Product.find(filterObject);
      if (query) {
        queryObject.regex('title', new RegExp(query, 'i'));
      }
      if (sortField) {
        queryObject.sort(sortField);
      }

      const skip = (page - 1) * limit;
      queryObject.skip(skip).limit(limit);

      return await queryObject.exec();
    } catch (error) {
      throw error;
    }
  }

  async generateMockProducts(count) {
    try {
      const mockProducts = [];

      for (let i = 0; i < count; i++) {
        const mockProduct = {
          title: `Mock Product ${i + 1}`,
          description: 'Mock Description',
          price: Math.floor(Math.random() * 100) + 1, 
          thumbnail: 'mock_thumbnail.jpg',
          code: `M${i + 1}`,
          stock: Math.floor(Math.random() * 50) + 1, 
        };

        mockProducts.push(mockProduct);
      }

      return mockProducts;
    } catch (error) {
      throw error;
    }
  }
}

export default ProductService;
