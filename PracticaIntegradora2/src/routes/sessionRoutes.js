import {Router} from 'express'
import passport from 'passport'
import { authorization } from '../middleware/auth.js'
import { postLogin, postLogout, postSession, getCurrent, getGithub, changeRolUser, recoveryPass, resetPass, addDocuments } from '../controllers/session.controller.js'
import { dynamicFolder, uploader } from '../utils/multer.js'
import { uploader as uploaderDocuments } from '../utils/multerDocuments.js'

const sessionRoutes = Router()

sessionRoutes.post('/register', dynamicFolder('profiles'), uploader.single('imgProfile'), passport.authenticate('register',{failureRedirect: '/failregister'}),  postSession)

sessionRoutes.post('/login',passport.authenticate("login", { failureRedirect: "/faillogin" }),postLogin)

sessionRoutes.post('/logout', postLogout)

sessionRoutes.get('/current', authorization(['Usuario']), getCurrent)

sessionRoutes.get('/github', passport.authenticate('github',{scope: ["user:email"]}), (req, res) => {})

sessionRoutes.get('/githubcallback',passport.authenticate('github',{failureRedirect:'/login'}),getGithub)

sessionRoutes.post("/premium/:uId", authorization(['Usuario','Premium']), changeRolUser)

sessionRoutes.post("/:uId/documents", dynamicFolder('documents'), authorization(['Usuario','Premium']), uploaderDocuments.array('documents',3), addDocuments)

sessionRoutes.post('/recoverypass', recoveryPass)

sessionRoutes.post('/resetpass', resetPass)

export default sessionRoutes