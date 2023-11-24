class CartDto {
    constructor(cart) {
      this.id = cart._id;
      this.products = cart.products.map(item => ({
        id_prod: item.id_prod,
        quantity: item.quantity,
      }));
    }
  }
  
  export default CartDto;