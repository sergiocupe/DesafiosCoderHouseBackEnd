import {Router, request} from 'express'
import passport from 'passport'
import { authorization } from '../middleware/auth.js'

const sessionRoutes = Router()

sessionRoutes.post('/register', passport.authenticate('register',{failureRedirect: '/failregister'}), async (req, res) => {
  res.render('usercreatesuccess')
})

sessionRoutes.post('/login',passport.authenticate("login", { failureRedirect: "/faillogin" }),async (req, res) => {
    if(!req.user){
        return res.status(400).send({message: 'Error de credenciales'});
    }
    req.session.user = {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        email: req.user.email,
        rol: req.user.rol
    }
    res.redirect('/products');
  }
);

sessionRoutes.post('/logout', async (req, res) => {
  try{
    req.session.destroy((error)=>{
      if (error)
        return res.status(500).send({message:'No se pudo cerrar la sesion'})
    })
    res.redirect('/login')
  }
  catch(err){
    res.status(400).send({err})
  }
})

sessionRoutes.get('/current', authorization('Usuario'), (req,res)=>{
  res.send(req.user)
})

sessionRoutes.get('/github', passport.authenticate('github',{scope: ["user:email"]}), (req, res) => {
})

sessionRoutes.get('/githubcallback',
  passport.authenticate('github',{failureRedirect:'/login'}),
  (req,res) => {
    req.session.user=req.user
    res.redirect('/products')
  })

export default sessionRoutes;