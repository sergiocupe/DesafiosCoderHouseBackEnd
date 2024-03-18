import {Router, request} from 'express'
import passport from 'passport'
import { authorization } from '../middleware/auth.js'
import { postLogin, postLogout, postSession, getCurrent, getGithub } from '../controllers/session.controller.js'

const sessionRoutes = Router()

sessionRoutes.post('/register', passport.authenticate('register',{failureRedirect: '/failregister'}), postSession)

sessionRoutes.post('/login',passport.authenticate("login", { failureRedirect: "/faillogin" }),postLogin)

sessionRoutes.post('/logout', postLogout)

sessionRoutes.get('/current', authorization('Usuario'), getCurrent)

sessionRoutes.get('/github', passport.authenticate('github',{scope: ["user:email"]}), (req, res) => {
})

sessionRoutes.get('/githubcallback',passport.authenticate('github',{failureRedirect:'/login'}),getGithub)

export default sessionRoutes;