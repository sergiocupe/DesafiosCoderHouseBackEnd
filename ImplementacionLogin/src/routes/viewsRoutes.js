import express from "express"
import { ProductMongoManager } from "../dao/managerDB/ProductMongoManager.js"
import { CartMongoManager } from "../dao/managerDB/CartMongoManager.js"
import { checkAuth, checkExistingUser } from "../middleware/auth.js";

const viewRoutes = express.Router()
const productManager=new ProductMongoManager()
const cartManager=new CartMongoManager()

viewRoutes.get("/", checkAuth, async (req, res) => {
  const resultado = await productManager.getProducts()

  if (resultado.message==="OK")
    res.render("home", { title: "Home", data: resultado.rdo.payload })
})

viewRoutes.get("/login",checkExistingUser,(req,res)=>{
  res.render('login')
})

viewRoutes.get("/register",checkExistingUser,(req,res)=>{
  res.render('register')
})

viewRoutes.get("/products", checkAuth, async (req, res) => {
  const {page, limit} = req.query
  const {user} = req.session

  const resultado = await productManager.getProducts(limit,page)

  if (resultado.message==="OK")
    res.render("products", { title: "Products", data: resultado.rdo, user: user })
})

viewRoutes.get("/product", checkAuth, async (req, res) => {
  const {pId} = req.query

  const resultado = await productManager.getProductById(pId)

  if (resultado.message==="OK")
    res.render("product", { title: "View Product", data: resultado.rdo })
})

viewRoutes.get("/carts/:cId", checkAuth, async (req, res) => {
  const {cId} = req.params
  const resultado = await cartManager.getProductsCartById(cId)
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
