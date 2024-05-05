import express from "express"
import { checkAuth, checkExistingUser, authorization, checkTokenExpire } from "../middleware/auth.js"
import { getViewDefault, getViewLogin, getViewProducts, getViewRegister,getViewProductById, getViewCartById, getViewConfirmCart, getViewFailLogin, getViewFailCart, getViewFailRegister, getViewUserCreate, getViewRealTime, getViewChat, getViewRecoveryPass, getViewResetPass, getViewChangeSuccess, getViewUserAdmin } from "../controllers/views.controller.js"
import { getCurrent } from "../controllers/session.controller.js"

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

viewRoutes.get("/recoverypass",getViewRecoveryPass)

viewRoutes.get("/changesuccess",getViewChangeSuccess)

viewRoutes.get("/resetpassword/:token/:email",checkTokenExpire ,getViewResetPass)

viewRoutes.get('/chat', checkAuth, authorization(['Usuario','Premmium']), getViewChat)

viewRoutes.get('/userAdmin', checkAuth, authorization(['Admin']), getViewUserAdmin)

viewRoutes.get("/confirmCartOK",getViewConfirmCart)

viewRoutes.get("/failCart",getViewFailCart)

export default viewRoutes
