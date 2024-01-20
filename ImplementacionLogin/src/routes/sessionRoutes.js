import {Router, request} from 'express'
import { userModel } from '../dao/models/user.model.js'

const sessionRoutes = Router()

sessionRoutes.post('/register', async (req, res) => {
  const {first_name, last_name, email, password} = req.body
  const rol='Usuario'
  try{
    const user= await userModel.create({
      first_name, last_name, email, password, rol
    })
    req.session.user = user
    res.redirect("/products")
  }
  catch(err){
    res.status(400).send({err})
  }
})

sessionRoutes.post('/login', async (req, res) => {
  const {email, password} = req.body
  try{

    //Para el usuario admin
    if(email==="adminCoder@coder.com")
    {
      if (password==="adminCod3r123")
        req.session.user = {first_name: "Coder", last_name: "Admin", email: email, password: password, rol:"Admin"}
      else
        return res.status(401).send({message:'Invalid Credencial'})
    }
    else
    {
      const user = await userModel.findOne({email: email})
      if (!user)
      {
        return res.status(404).send({message:'User not found'})
      }
      if (user.password !== password){
        return res.status(401).send({message:'Invalid Credencial'})
      }
      
      req.session.user = user
    }
    
    res.redirect('/products')
  }
  catch(err){
    res.status(400).send({err})
  }
})

sessionRoutes.post('/logout', async (req, res) => {
  try{
    req.session.destroy((error)=>{
      if (error)
        return res.status(500).send({message:'Logout failed'})
    })
    res.send({redirect:"http://localhost:8080/login"})
  }
  catch(err){
    res.status(400).send({err})
  }
})

export default sessionRoutes;