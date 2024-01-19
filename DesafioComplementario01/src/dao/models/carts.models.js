import mongoose from "mongoose"

const cartColletion = "carts"

const cartSchema = new mongoose.Schema({
  products: {
    type: [
        {
            id: { 
                type: String, 
                required: true
            },
            quantity: Number
        }
    ],
    default: []
}
})

const CartModel = mongoose.model(cartColletion, cartSchema);

export default CartModel;