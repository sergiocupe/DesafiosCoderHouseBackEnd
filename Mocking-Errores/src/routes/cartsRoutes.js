import { Router } from "express"
import { deleteCartById, deleteProductCartById, getCart, getCartById, postCart, postCartById, purchaseCartById } from "../controllers/cart.controller.js"
import { authorization } from "../middleware/auth.js"

const cartRouter = Router()

cartRouter.get("/", getCart)

cartRouter.get("/:cId", getCartById)

cartRouter.post('/', authorization('Usuario'), postCart)

cartRouter.post("/:cId/products/:pId",authorization('Usuario'),postCartById)

cartRouter.delete('/:cId',authorization('Usuario'),deleteCartById)

cartRouter.delete('/:cId/products/:pId',authorization('Usuario'),deleteProductCartById)

cartRouter.post("/:cId/purchase",authorization('Usuario'),purchaseCartById)

export default cartRouter