import CartModel from '../dao/models/cart.model.mjs';

class CartDao {
  async createCart(userId) {
    try {
      const newCart = new CartModel({ userId, products: [] });
      await newCart.save();
      return newCart;
    } catch (error) {
      throw error;
    }
  }

  async getCart(userId) {
    try {
      return await CartModel.findOne({ userId }).populate('products.id_prod', 'title price');
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

      const existingItem = cart.products.find((item) => item.id_prod.toString() === productId);

      if (!existingItem) {
        cart.products.push({ id_prod: productId, quantity });
      } else {
        existingItem.quantity += quantity;
      }

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

      const existingItemIndex = cart.products.findIndex((item) => item.id_prod.toString() === productId);

      if (existingItemIndex !== -1) {
        cart.products.splice(existingItemIndex, 1);
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

      cart.products = [];
      await cart.save();
      return cart;
    } catch (error) {
      throw error;
    }
  }
}

export default CartDao;
