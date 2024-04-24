import { isValidPassword } from "../utils/bcrypt.js"
import UserModel from "../dao/models/user.models.js"
import { ProductMongoManager } from "../dao/managerDB/ProductMongoManager.js"
import { TokenMongoManager } from "../dao/managerDB/TokenMongoManager.js"

export const checkAuth=(req,res,next) => {
  if (!req.session?.user)
    return res.redirect("/login")
  else
    next()
}

export const checkExistingUser=(req,res,next) => {
  if (req.session?.user)
    return res.redirect("/products")
  else
    next()
}

export const checkLogin=async (req,res,next) =>{
  const {email, password} = req.body

  try {
      const user=UserModel.findByEmail({email})
      if(!user || !isValidPassword(user,password))
      {
        return res.redirect("/faillogin")
      }
      req.user=user
      next()
  }
  catch(error) {
    console.error(error)
  }
}

export const authorization =(roles)=>{
  return async(req,res,next)=>{
   if (req.session?.user)
    {
      const userRole = req.session.user.rol
      if (!roles.includes(userRole)) {
        return res.status(403).send({error: 'No permissions'})
      }
    }
    else
      return res.status(403).send({error: 'User not login'})
    next()
  }
}

export const checkAutorizationProduct = async (req, res, next) => {
  try {
    const productId = req.params.pId
    const userRole = req.session?.user?.rol
    const userId = req.session?.passport?.user

    if (userRole==="Premium")
    {
      if (!userId) {
        return res.status(403).send({ error: 'Usuario no logueado' })
      }

      const productManager = new ProductMongoManager()
      const product = await productManager.getProductById(productId)

      if (!product) {
        return res.status(404).send({ error: 'Product no encontrado' })
      }

      if (String(product.rdo.owner) === String(userId)) {
        return res.status(403).send({ error: 'El usuario no tiene permiso para agregar el producto al carrito' })
      }
     }
    next()
  } catch (error) {
    return res.status(500).send({ error: 'Error interno del servidor' })
  }
}

export const isOwner = async (req, res, next) => {
  try {
    const productId = req.params.pId
    const userRole = req.session?.user?.rol
    const userId = req.session?.passport?.user

    if (userRole!="Admin")
    {
      if (!userId) {
        return res.status(403).send({ error: 'Usuario no logueado' })
      }

      const productManager = new ProductMongoManager()
      const product = await productManager.getProductById(productId)

      if (!product) {
        return res.status(404).send({ error: 'Producto no encontrado' })
      }

      if (String(product.rdo.owner) !== String(userId)) {
        return res.status(403).send({ error: 'El usuario no tiene permiso para agregar el producto al carrito' })
      }
     }
    next()
  } catch (error) {
    return res.status(500).send({ error: 'Error interno del servidor' })
  }
}

export const checkTokenExpire = async (req, res, next) => {
  try {

    const token = req.params.token

    const tokenManager = new TokenMongoManager()
    const validacion = await tokenManager.checkExpire(token)

    if (validacion.message==="ERROR") { //Esto puede pasar en caso que el token expiro o bien el token no es valido
        return res.redirect("/recoverypass")
    }
    next()
  } catch (error) {
    return res.status(500).send({ error: error })
  }
}
