import { Router } from "express"
import {uploader} from '../utils/multer.js'
import { getProducts, getProductsById, postProduct, putProduct, deleteProduct} from "../controllers/product.controller.js"

const productRouter = Router()

productRouter.get("/", getProducts)

productRouter.get("/:pId", getProductsById)

productRouter.post('/', uploader.single('file'), postProduct)

productRouter.put('/:pId', putProduct)

productRouter.delete('/:pId',deleteProduct)

export default productRouter
