import CartModel from "../models/carts.models.js"
import mongoose from "mongoose"

export class ProductCart {
  constructor(id, quantity) {
    this.id = id
    this.quantity = quantity
  }
}

export class CartMongoManager {
  #carts
  
  constructor(){
    this.#carts = [];
  }

  async getCarts() {
    try {
      const parseCarritos = await CartModel.find().populate('products.product').lean()
      return {message: "OK" , rdo: parseCarritos}
    } 
    catch (e) {
      return {message: "ERROR" , rdo: "No hay carritos"}
    }
  }

  async getCartById(id) {
    try
    {
      const cart=await CartModel.findOne({_id: id})
      if (cart) 
        return {message: "OK" , rdo: cart}
      else 
        return {message: "ERROR" , rdo: "El carrito no existe"}
    } 
    catch (e) {
      return {message: "ERROR" , rdo: "Error al obtener el carrito - " + e.message}
   }
  }

  async getProductsCartById(id) {
    try
    {
      const cart=await CartModel.findOne({_id: id}).populate('products.product').lean()

      if (cart) 
        return {message: "OK" , rdo: cart.products}
      else 
        return {message: "ERROR" , rdo: "El carrito no existe o no tiene productos"}
    } 
    catch (e) {
      return {message: "ERROR" , rdo: "Error al obtener los productos del carrito - " + e.message}
   }
  }

  async addProductsInCart(cId, pId, quantity) {
    try {
      this.#carts = await this.getCarts();
      
      if (!this.#carts)
        return {message: "ERROR" , rdo: `No existen carritos creados`}

      const index = this.#carts.rdo.findIndex((e) => e._id.equals(cId));
      
      if (index===-1) 
       return {message: "ERROR" , rdo: `No existen el carrito con el id ${cId}`}

      const productsCart = this.#carts.rdo[index].products //Obtengo el array de productos

      //busco el producto por el Id
      const prod = productsCart.find(item=>item.product._id.equals(pId))

      //Busco el producto en el carrito, si no existe lo agrego, sino actualizo el quantity
      if (prod) { //si ya existe el producto en el carrito
        const indexProd = productsCart.findIndex(item=>item.product._id.equals(pId))
        productsCart[indexProd].quantity +=quantity
      }
      else //si no existe el producto en el carrito
      {
        const newProduct = { product: pId, quantity: quantity };
        productsCart.push(newProduct)
      }

      const updated = await CartModel.findOneAndUpdate(
        { _id: cId },
        { products: productsCart }
      )

      return {message: "OK" , rdo: `Producto agregado/actualizado al carrito ${cId} correctamente`}
      
    } catch (e) {
      return {message: "ERROR" , rdo: "Error al momento de actualizar el carrito - "+ e.message}    }
  }

  async addCart(products) {
    try {
      const added = await CartModel.create(products)      
      return {message: "OK" , rdo: added._id}
    } 
    catch (e) {
      return {message: "ERROR" , rdo: "Error al agregar el carrito." + e.message}
    }
  }

  async deleteCart(cId) {
    try {
      const deleted = await CartModel.findOneAndUpdate(
        {_id: cId},
        {products:[]}
      )

      return {message: "OK" , rdo: `Carrito con ID ${cId} vaciado exitosamente.`}
    } 
    catch (e) {
      return {message: "ERROR" , rdo: "Error al momento de eliminar el carrito - "+ e.message}
    }
  }

  async deleteProductByCart(cId, pId) {
    try {
      const result = await CartModel.updateOne(
        { _id: cId },
        { $pull: { products: { product: new mongoose.Types.ObjectId(pId) } } }
      );
  
      if (result.modifiedCount > 0) {
        return { message: "OK", rdo: `Producto del carrito con ID ${cId} eliminado exitosamente.` };
      } else {
        return { message: "ERROR", rdo: `Producto con ID ${pId} no encontrado en el carrito con ID ${cId}.` };
      }
    } 
    catch (e) {
      return {message: "ERROR" , rdo: "Error al momento de eliminar el producto en el carrito - "+ e.message}
    }
  }

}