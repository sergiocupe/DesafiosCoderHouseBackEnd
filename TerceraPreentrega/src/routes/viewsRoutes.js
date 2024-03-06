import express from "express"
import { checkAuth, checkExistingUser, authorization } from "../middleware/auth.js";
import { getViewDefault, getViewLogin, getViewProducts, getViewRegister,getViewProductById, getViewCartById, getViewFailLogin, getViewFailRegister, getViewUserCreate, getViewRealTime, getViewChat } from "../controllers/views.controller.js";
import { getCurrent } from "../controllers/session.controller.js";

const viewRoutes = express.Router()

viewRoutes.get("/", checkAuth, getViewDefault)

viewRoutes.get("/login",checkExistingUser,getViewLogin)

viewRoutes.get("/register",checkExistingUser,getViewRegister)

viewRoutes.get("/products", checkAuth, getViewProducts)

viewRoutes.get("/product", checkAuth, getViewProductById)

viewRoutes.get("/carts/:cId", checkAuth,getViewCartById)

viewRoutes.get("/current", getCurrent)

viewRoutes.get("/faillogin",getViewFailLogin)

viewRoutes.get("/failregister",getViewFailRegister)

viewRoutes.get("/usercreatesuccess",getViewUserCreate)

viewRoutes.get("/realtimeproducts", getViewRealTime)

viewRoutes.get('/chat', checkAuth, authorization('Usuario'), getViewChat)

export default viewRoutes
