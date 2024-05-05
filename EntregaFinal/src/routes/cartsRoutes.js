import { Router } from "express"
import { deleteCartById, deleteProductCartById, getCart, getCartById, postCart, postCartById, purchaseCartById } from "../controllers/cart.controller.js"
import { authorization, checkAutorizationProduct } from "../middleware/auth.js"

const cartRouter = Router()

cartRouter.get('/', getCart)

cartRouter.get('/:cId', getCartById)

cartRouter.post('/', authorization(['Usuario','Premium']), postCart)

cartRouter.post('/:cId/products/:pId',authorization(['Usuario','Premium']), checkAutorizationProduct, postCartById)

cartRouter.post('/:cId/purchase',authorization(['Usuario','Premium']), purchaseCartById)

cartRouter.delete('/:cId',authorization(['Usuario','Premium']), deleteCartById)

cartRouter.delete('/:cId/products/:pId',authorization(['Usuario','Premium']), deleteProductCartById)

export default cartRouter