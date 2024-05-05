import mongoose from "mongoose"

const userCollection = "users"

const useSchema = mongoose.Schema(
  {
    "first_name": {
      type: String,
      required: true 
    },
    "last_name": {
      type: String,
      required: true
    },
    "email": {
      type: String,
      unique: true,
      require: true
    },
    "password": {
      type: String,
      required: true
    },
    "rol": {
      type: String,
      require: true
    },
    "cart":{
      type: Array,
      default:[]
    },
    "documents":{
      type: Array,
      default:[]
    },
    "imgProfile": String,
    "last_connection": {
      type: Date,
      default: Date.now
    },
    "identificacion":{
      type: Boolean,
      default:false
    },
    "comprobanteDomicilio":{
      type: Boolean,
      default:false
    },
    "estadoCuenta":{
      type: Boolean,
      default:false
    },
  }
)

const UserModel= mongoose.model(userCollection, useSchema)

export default UserModel