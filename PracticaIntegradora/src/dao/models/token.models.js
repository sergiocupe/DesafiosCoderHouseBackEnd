import mongoose from "mongoose"

const tokenCollection = "tokens"

const tokenSchema = new mongoose.Schema({
    "token": {
      type:String,
      required:true,
      unique:true
    },
    "expire": { 
      type: Date, 
      required: true
    }
})

const TokenModel = mongoose.model(tokenCollection, tokenSchema)

export default TokenModel