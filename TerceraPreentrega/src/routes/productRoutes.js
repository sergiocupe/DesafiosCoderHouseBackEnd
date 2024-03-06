import { Router } from "express"
import {uploader} from '../utils/multer.js'
import { getProducts, getProductsById, postProduct, putProduct, deleteProduct} from "../controllers/product.controller.js"
import { authorization} from "../middleware/auth.js";


const productRouter = Router()

productRouter.get("/", getProducts)

productRouter.get("/:pId", getProductsById)

productRouter.post('/', authorization('Admin'), uploader.single('file'), postProduct)

productRouter.put('/:pId', authorization('Admin'), putProduct)

productRouter.delete('/:pId', authorization('Admin'), deleteProduct)

export default productRouter
