import express from "express"
import { checkAuth, checkExistingUser } from "../middleware/auth.js";
import { getViewDefault, getViewLogin, getViewProducts, getViewRegister,getViewProductById, getViewCartById, getViewFailLogin, getViewFailRegister, getViewUserCreate, getViewRealTime, getViewChat } from "../controllers/views.controller.js";

const viewRoutes = express.Router()

viewRoutes.get("/", checkAuth, getViewDefault)

viewRoutes.get("/login",checkExistingUser,getViewLogin)

viewRoutes.get("/register",checkExistingUser,getViewRegister)

viewRoutes.get("/products", checkAuth, getViewProducts)

viewRoutes.get("/product", checkAuth, getViewProductById)

viewRoutes.get("/carts/:cId", checkAuth,getViewCartById)

viewRoutes.get("/faillogin",getViewFailLogin)

viewRoutes.get("/failregister",getViewFailRegister)

viewRoutes.get("/usercreatesuccess",getViewUserCreate)

viewRoutes.get("/realtimeproducts", getViewRealTime)

viewRoutes.get('/chat', getViewChat)

export default viewRoutes
