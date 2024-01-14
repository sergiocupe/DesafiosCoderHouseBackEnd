import express from "express"
//import { ProductManager } from "../dao/managerFS/ProductManager.js";
import { ProductMongoManager } from "../dao/managerDB/ProductMongoManager.js"
import { CartMongoManager } from "../dao/managerDB/CartMongoManager.js"

const viewRoutes = express.Router()
//const path="./src/json/productos.json"
//const productManager = new ProductManager(path);
const productManager=new ProductMongoManager()
const cartManager=new CartMongoManager()



viewRoutes.get("/", async (req, res) => {
  const resultado = await productManager.getProducts()

  if (resultado.message==="OK")
    res.render("home", { title: "Home", data: resultado.rdo.payload })
})

viewRoutes.get("/products", async (req, res) => {
  const {page, limit} = req.query

  const resultado = await productManager.getProducts(limit,page)

  if (resultado.message==="OK")
    res.render("products", { title: "Products", data: resultado.rdo })
})

viewRoutes.get("/product", async (req, res) => {
  const {pId} = req.query

  const resultado = await productManager.getProductById(pId)

  if (resultado.message==="OK")
    res.render("product", { title: "View Product", data: resultado.rdo })
})

viewRoutes.get("/carts/:cId", async (req, res) => {
  const {cId} = req.params

  const resultado = await cartManager.getProductsCartById(cId)

  if (resultado.message==="OK")
    res.render("cartDetails", { title: "Details Cart", data: resultado.rdo })
})

viewRoutes.get("/realtimeproducts", async (req, res) => {
  const resultado = await productManager.getProducts();
  if (resultado.message==="OK")
    res.render("realtimeproducts", { title: "RealTime Products", data: resultado.rdo.payload })
})

viewRoutes.get('/chat', async (req, res)=>{
  res.render('chat')
})

export default viewRoutes
