import ProductDao from './product.dao.js';
import CartDao from './cart.dao.js';
import UserDao from './user.dao.js';

class DaoFactory {
  static createDao(type) {
    switch (type) {
      case 'product':
        return new ProductDao();
      case 'cart':
        return new CartDao();
      case 'user':
        return new UserDao();
      default:
        throw new Error('Invalid DAO type');
    }
  }
}

export default DaoFactory;
