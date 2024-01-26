import {Router, request} from 'express'
import { userModel } from '../dao/models/user.model.js'
import passport from 'passport'

const sessionRoutes = Router()

// sessionRoutes.post('/register', async (req, res) => {
//   const {first_name, last_name, email, password} = req.body
//   const rol='Usuario'
//   try{
//     const user= await userModel.create({
//       first_name, last_name, email, password, rol
//     })
//     req.session.user = user
//     res.redirect("/products")
//   }
//   catch(err){
//     res.status(400).send({err})
//   }
// })


// sessionRoutes.post('/login', async (req, res) => {
//   const {email, password} = req.body
//   try{

//     //Para el usuario admin
//     if(email==="adminCoder@coder.com")
//     {
//       if (password==="adminCod3r123")
//         req.session.user = {first_name: "Coder", last_name: "Admin", email: email, password: password, rol:"Admin"}
//       else
//         return res.status(401).send({message:'Credenciales Invalidas'})
//     }
//     else
//     {
//       const user = await userModel.findOne({email: email})
//       if (!user)
//       {
//         return res.status(404).send({message:'Usuario no existente'})
//       }
//       if (user.password !== password){
//         return res.status(401).send({message:'Credenciales Invalidas'})
//       }
      
//       req.session.user = user
//     }
    
//     res.redirect('/products')
//   }
//   catch(err){
//     res.status(400).send({err})
//   }
// })

sessionRoutes.post('/register', passport.authenticate('register',{failureRedirect: '/failregister'}), async (req, res) => {
  res.status(201).send({message: 'User register'})
})


sessionRoutes.post('/login',
  passport.authenticate("login", { failureRedirect: "/faillogin" }),
  async (req, res) => {

    console.log(req.user)
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
    res.send({redirect:"http://localhost:8080/login"})
  }
  catch(err){
    res.status(400).send({err})
  }
})


sessionRoutes.get('/github', 
  passport.authenticate('github',{scope: ["user:email"]}),
  (req, res) => {
})

sessionRoutes.get('/githubcallback',
  passport.authenticate('github',{failureRedirect:'/login'}),
  (req,res) => {
    req.session.user=req.user
    res.redirect('/products')
  })


export default sessionRoutes;