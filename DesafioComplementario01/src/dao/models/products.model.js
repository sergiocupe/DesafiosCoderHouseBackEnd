import mongoose from "mongoose";

const productsCollection = "products";

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
        enum: ["Ropa", "Perfumes", "Bebida", "Electrónica"],
        default: "Ropa"
    },
    "thunbnail": String
})

const ProductsModel = mongoose.model(productsCollection, productsSchema);

export default ProductsModel;