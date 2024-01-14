import { Router } from "express"
//import { CartManager } from "../dao/managerFS/CartManager.js"
import { CartMongoManager } from "../dao/managerDB/CartMongoManager.js"

const cartRouter = Router()

// ** Métodos  con file system
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// =-            F I L E   S Y S T E M            -=
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=`

/*
const path="./src/json/carritos.json"

cartRoutes.get("/", async (req, res) => {
  const carts = new CartManager(path)
  const resultado = await carts.getCarts()
  res.send(resultado)
})

cartRoutes.get("/:cId", async (req, res) => {
  const {cId}=req.params
  const carts = new CartManager(path)
  const resultado = await carts.getProductsCartById(+cId)
  res.send(resultado)
})

cartRoutes.post("/", async (req, res) => {
  const carts = new CartManager(path)
  const resultado = await carts.addCart()
  res.send({ message: resultado })
})

cartRoutes.post("/:cId/product/:pId", async (req, res) => {
  const {cId, pId} = req.params
  const carts = new CartManager(path)
  const resultado = await carts.addProductsInCart(cId,pId,1)
  res.send({ message: resultado})
})

*/

// ** Métodos con Mongoose
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// =-                M O N G O O  D B             -=
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=`

cartRouter.get("/", async (req, res) => {
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
})

cartRouter.get("/:cId", async (req, res) => {
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
})

cartRouter.post('/', async (req,res)=>{ 
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
})

cartRouter.post("/:cId/products/:pId",async (req,res)=>{
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
})

cartRouter.delete('/:cId',async (req,res)=>{
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
})


cartRouter.delete('/:cId/products/:pId',async (req,res)=>{
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
})


export default cartRouter