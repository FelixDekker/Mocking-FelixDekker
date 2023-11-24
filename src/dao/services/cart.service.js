import Cart from '../models/cart.model.mjs';
import Product from '../models/product.model.js';

class CartService {
  async createCart(userId) {
    try {
      const newCart = new Cart({ userId, items: [], total: 0 });
      await newCart.save();
      return newCart;
    } catch (error) {
      throw error;
    }
  }

  async getCart(userId) {
    try {
      return await Cart.findOne({ userId }).populate('items.productId', 'title price');
    } catch (error) {
      throw error;
    }
  }

  async addItemToCart(userId, productId, quantity) {
    try {
      const cart = await this.getCart(userId);
      if (!cart) {
        throw new Error('Cart not found');
      }

      const product = await Product.findById(productId);
      if (!product) {
        throw new Error('Product not found');
      }

      const existingItem = cart.items.find((item) => item.productId.toString() === productId);

      if (!existingItem) {
        cart.items.push({ productId, quantity });
      } else {
        existingItem.quantity += quantity;
      }

      this.calculateTotal(cart);

      await cart.save();
      return cart;
    } catch (error) {
      throw error;
    }
  }

  async removeItemFromCart(userId, productId) {
    try {
      const cart = await this.getCart(userId);
      if (!cart) {
        throw new Error('Cart not found');
      }

      const existingItemIndex = cart.items.findIndex((item) => item.productId.toString() === productId);

      if (existingItemIndex !== -1) {
        cart.items.splice(existingItemIndex, 1);
        this.calculateTotal(cart);
        await cart.save();
      }

      return cart;
    } catch (error) {
      throw error;
    }
  }

  async clearCart(userId) {
    try {
      const cart = await this.getCart(userId);
      if (!cart) {
        throw new Error('Cart not found');
      }

      cart.items = [];
      cart.total = 0;

      await cart.save();
      return cart;
    } catch (error) {
      throw error;
    }
  }

  calculateTotal(cart) {
    cart.total = cart.items.reduce((total, item) => {
      return total + item.productId.price * item.quantity;
    }, 0);
  }

  async generateMockCarts(count) {
    try {
      const mockCarts = [];

      for (let i = 0; i < count; i++) {
        const mockCart = await this.createCart(`user${i + 1}`); 

        const mockProducts = await ProductService.generateMockProducts(3); 
        for (const mockProduct of mockProducts) {
          await this.addItemToCart(mockCart.userId, mockProduct._id, Math.floor(Math.random() * 5) + 1); 
        }

        mockCarts.push(mockCart);
      }

      return mockCarts;
    } catch (error) {
      throw error;
    }
  }
}

export default CartService;
