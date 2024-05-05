class ProductDTO{
  constructor(product)
  {
    this.title=product.title
    this.description=product.description
    this.price=product.price
    this.code=product.code
    this.stock=product.stock
    this.status=product.status
    this.category=product.category
    this.thunbnail=product.thunbnail
    this.owner=product.owner
  }
}

export default ProductDTO
