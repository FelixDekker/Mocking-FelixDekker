class ProductDto {
    constructor(product) {
      this.id = product._id;
      this.title = product.title;
      this.price = product.price;
      this.code = product.code;
      this.description = product.description;
      this.thumbnail = product.thumbnail;
      this.stock = product.stock;
    }
  }
  
  export default ProductDto;