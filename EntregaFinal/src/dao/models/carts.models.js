import mongoose from "mongoose"

const cartColletion = "carts"

const cartSchema = new mongoose.Schema({
    "products":{
        type:[
          {
            product: {
              type: mongoose.Schema.ObjectId,
              ref: 'products'
            },
            quantity: Number
          }
        ],
        default:[]
      }
})

//Middleware pre para populate y no ponerlo en todos los find
cartSchema.pre('find', function(){
    this.populate('products.product')
  })

const CartModel = mongoose.model(cartColletion, cartSchema)

export default CartModel