import express from "express"
import { getProducts} from "../controllers/mocking.controller.js"

const mookingRoutes = express.Router()

mookingRoutes.get("/", getProducts)

export default mookingRoutes
