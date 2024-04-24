import mongoose from "mongoose"
import mongoosePaginate from "mongoose-paginate-v2"

const productsCollection = "products"

const productsSchema = new mongoose.Schema({
    "title": String,
    "description": String,
    "price": Number,
    "code": { 
      type: String, 
      unique: true 
    },
    "stock": Number,
    "status": Boolean,
    "category": {
        type: String,
        enum: ["Ropa", "Perfume", "Bebida", "Electrónica"],
        default: "Ropa"
    },
    "thunbnail": String,
    "owner": String
})

productsSchema.plugin(mongoosePaginate)

const ProductsModel = mongoose.model(productsCollection, productsSchema)

export default ProductsModel