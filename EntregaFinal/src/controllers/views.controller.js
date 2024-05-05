import { ProductMongoManager } from "../dao/managerDB/ProductMongoManager.js"
import { CartMongoManager } from "../dao/managerDB/CartMongoManager.js"
import { UserMongoManager } from "../dao/managerDB/UserMongoManager.js"

const productManager=new ProductMongoManager()
const cartManager=new CartMongoManager()
const userManager=new UserMongoManager()

export const getViewDefault = async (req, res) =>{
  const resultado = await productManager.getProducts()

  if (resultado.message==="OK")
    res.render("home", { title: "Home", data: resultado.rdo.payload })
}

export const getViewLogin = async (req, res) =>{
  res.render('login')
}

export const getViewRegister = async (req, res) =>{
  res.render('register')
}

export const getViewRecoveryPass = async (req, res) =>{
  res.render('recoverypass')
}

export const getViewResetPass = async (req, res) =>{
  const {email} = req.params
  res.render('resetpassword', { data: {email} })
}

export const getViewProducts = async (req, res) =>{
  const {page, limit} = req.query
  const {user} = req.session

  const resultado = await productManager.getProducts(limit,page)

  if (resultado.message==="OK")
    res.render("products", { title: "Productos", data: resultado.rdo, user: user })
}

export const getViewProductById = async (req, res) =>{
  const {pId} = req.query

  const resultado = await productManager.getProductById(pId)

  if (resultado.message==="OK")
    res.render("product", { title: "Vista de Productos", data: resultado.rdo })
}

export const getViewCartById = async (req, res) =>{
  const {cId} = req.params
  const resultado = await cartManager.getProductsCartById(cId)
  res.render("cartDetails", { title: "Detalle del Carrito", data: resultado.rdo })
}

export const getViewFailLogin = async (req, res) =>{
  res.render('faillogin')
}

export const getViewFailRegister = async (req, res) =>{
  res.render('failregister')
}

export const getViewChangeSuccess = async (req, res) =>{
  res.render('changesuccess')
}

export const getViewUserCreate = async (req, res) =>{
  res.render('usercreatesuccess')
}

export const getViewRealTime = async (req, res) =>{
  const resultado = await productManager.getProducts()
  if (resultado.message==="OK")
    res.render("realtimeproducts", { title: "RealTime Products", data: resultado.rdo.payload })
}

export const getViewChat = async (req, res) =>{
  res.render('chat')
}

export const getViewUserAdmin = async (req, res) =>{
  const {user} = req.session

  const resultado = await userManager.getAllUsers()

  if (resultado.message==="OK")
    res.render("usersadmin", { title: "Usuario", data: resultado.rdo, user: user })
}

export const getViewConfirmCart = async (req, res) =>{
  res.render('confirmCart')
}

export const getViewFailCart = async (req, res) =>{
  res.render('failCart')
}