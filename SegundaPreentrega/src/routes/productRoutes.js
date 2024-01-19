import { Router } from "express"
//import { ProductManager } from "../dao/managerFS/ProductManager.js"
import { ProductMongoManager } from "../dao/managerDB/ProductMongoManager.js"
import {uploader} from '../utils/multer.js'


const productRouter = Router()

// ** Métodos  con file system
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// =-            F I L E   S Y S T E M            -=
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=`

/*
const path="./src/json/productos.json"

productRouter.get("/", async (req, res) => {
  const { limit } = req.query
  const products = new ProductManager(path)
  let resultado = await products.getProducts()
  //Si no tiene limite, devuelve todos los productos
  if (!limit) 
    return res.send(resultado)
  const productsLimit = resultado.slice(0, limit)
  res.send(productsLimit)
})

productRouter.get("/:pId", async (req, res) => {
  const { pId } = req.params
  const products = new ProductManager(path)
  const resultado = await products.getProductById(+pId)
  res.send(resultado)
})

productRouter.post("/", async (req, res) => {
  const product = req.body
  const products = new ProductManager(path)
  const resultado = await products.addProduct(product)
  res.send({ message: resultado })
})

productRouter.put("/:pId", async (req, res) => {
  const { pId } = req.params
  const product = req.body
  const products = new ProductManager(path)
  const resultado = await products.updateProduct(+pId,product)
  res.send({ message: resultado })
})

productRouter.delete("/:pId", async (req, res) => {
  const { pId } = req.params
  const products = new ProductManager(path)
  const resultado = await products.deleteProduct(+pId)
  res.send({ message: resultado })
})
*/

// ** Métodos con Mongoose
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// =-                M O N G O O  D B             -=
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=`

productRouter.get("/", async (req, res) => {
  try {
    const { limit, page, sort, query, category, stockAvailability } = req.query
    const products = new ProductMongoManager()

    const resultado = await products.getProducts(limit, page, sort, query, category, stockAvailability)

    if (resultado.message==="OK")
    {
      return res.status(200).json(resultado)
    }
    res.status(400).json(resultado)
  } 
  catch (err) {
    res.status(400).json({message: err})
  }
})

productRouter.get("/:pId", async (req, res) => {
  try{
    const {pId}=req.params
    const products = new ProductMongoManager()

    const resultado = await products.getProductById(pId)
    if (resultado.message==="OK"){
      return res.status(200).json(resultado)
    }
    res.status(400).json(resultado)
  }
  catch(err)
  {
    res.status(400).json({message: "El producto no existe"})
  }
})

productRouter.post('/',uploader.single('file'), async (req,res)=>{ //tiene un midleware con el file
  try{
    const products = new ProductMongoManager()
    const newProduct = req.body
    const resultado = await products.addProduct(newProduct)  
    if (resultado.message==="OK"){
      return res.status(200).json(resultado)
    }
    res.status(400).json(resultado)
  }
  catch(err){
    res.status(400).json({message: err})
  }
})

productRouter.put('/:pId',async (req,res)=>{
  try{
    const {pId} = req.params
    const updateProd= req.body
    const products = new ProductMongoManager()

    const resultado = await products.updateProduct(pId, updateProd)

    if (resultado.message==="OK"){
      return res.status(200).json(resultado)
    }
    res.status(400).json(resultado)
  }
  catch(err){
    res.status(400).json({menssage: 'err'})
  }
})

productRouter.delete('/:pId',async (req,res)=>{
  try{
    const {pId} = req.params
    const products = new ProductMongoManager()

    const deleted = await products.deleteProduct(pId)

    if (deleted.message==="OK")
      return res.status(200).json(deleted.rdo)

    return res.status(404).json(deleted.rdo)
  }
  catch(err){
    res.status(400).json({menssage: err})
  }
})


export default productRouter
