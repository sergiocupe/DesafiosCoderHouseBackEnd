import { CartMongoManager } from "../dao/managerDB/CartMongoManager.js"

export const getCart = async (req, res) => {
  try {
    const { limit } = req.query
    const carts = new CartMongoManager()

    const resultado = await carts.getCarts()

    if (resultado.message==="OK")
    {
      //Si no tiene limite, devuelve todos los productos
      if (!limit) 
        return res.status(200).json(resultado)

      const productsLimit = resultado.rdo.slice(0, limit)
      return res.status(200).json(productsLimit)
    }
    res.status(400).json(resultado)
  } 
  catch (err) {
    res.status(400).json({ message: "Error al obtener los carritos" + err.menssage })
  }
}

export const getCartById = async (req, res) => {
  try{
    const {cId}=req.params
    const products = new CartMongoManager()

    const resultado = await products.getProductsCartById(cId)
    if (resultado.message==="OK"){
      return res.status(200).json(resultado)
    }
    res.status(400).json(resultado)
  }
  catch(err)
  {
    res.status(400).json({message: "El carrito no existe"})
  }
}

export const postCart = async (req, res) => {
  try{
    const carts = new CartMongoManager()
    const resultado = await carts.addCart({products:[]})  
    if (resultado.message==="OK"){
      return res.status(200).json(resultado)
    }
    res.status(400).json(resultado)
  }
  catch(err){
    res.status(400).json({message: err})
  }
}

export const postCartById = async (req, res) => {
  try{
    const {cId, pId} = req.params
    const newQuantity =  req.body.quantity
    const carts = new CartMongoManager()

    const resultado = await carts.addProductsInCart(cId, pId, newQuantity)

    if (resultado.message==="OK"){
      return res.status(200).json(resultado)
    }
    res.status(400).json(resultado)
  }
  catch(err){
    res.status(400).json({menssage: err})
  }
}

export const deleteCartById = async (req, res) => {
  try{
    const {cId} = req.params
    const carts = new CartMongoManager()

    const deleted = await carts.deleteCart(cId)

    if (deleted.message==="OK")
      return res.status(200).json(deleted.rdo)

    return res.status(404).json(deleted.rdo)
  }
  catch(err){
    res.status(400).json({menssage: err})
  }
}

export const deleteProductCartById = async (req, res) => {
  try{
    const {cId, pId} = req.params
    const carts = new CartMongoManager()

    const deleted = await carts.deleteProductByCart(cId,pId)

    if (deleted.message==="OK")
      return res.status(200).json(deleted.rdo)

    return res.status(404).json(deleted.rdo)
  }
  catch(err){
    res.status(400).json({menssage: err})
  }
}
