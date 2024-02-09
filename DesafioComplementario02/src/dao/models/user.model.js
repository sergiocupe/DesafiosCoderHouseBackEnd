import mongoose from "mongoose";

const userCollection = "users"

const useSchema = mongoose.Schema(
  {
    first_name: {
      type: String,
      required: true 
    },
    last_name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      unique: true,
      require: true
    },
    password: {
      type: String,
      required: true
    },
    rol: {
      type: String,
      require: true
    },
    cart:{
      type: Array,
      default:[]
    }
  }
)

export const userModel= mongoose.model(userCollection, useSchema)