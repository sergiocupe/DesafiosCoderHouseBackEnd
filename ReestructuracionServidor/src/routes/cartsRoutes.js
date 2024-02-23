import { Router } from "express"
import { deleteCartById, deleteProductCartById, getCart, getCartById, postCart, postCartById } from "../controllers/cart.controller.js"

const cartRouter = Router()

cartRouter.get("/", getCart)

cartRouter.get("/:cId", getCartById)

cartRouter.post('/', postCart)

cartRouter.post("/:cId/products/:pId",postCartById)

cartRouter.delete('/:cId',deleteCartById)

cartRouter.delete('/:cId/products/:pId',deleteProductCartById)

export default cartRouter