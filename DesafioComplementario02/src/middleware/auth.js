import { isValidPassword } from "../utils/bcrypt.js"
import { userModel } from "../dao/models/user.model.js"

export const checkAuth=(req,res,next) => {
  if (!req.session?.user)
    return res.redirect("/login")
  else
    next()
}


export const checkExistingUser=(req,res,next) => {
  if (req.session?.user)
    return res.redirect("/products")
  else
    next()
}

export const checkLogin=async (req,res,next) =>{
  const {email, password} = req.body

  try {
      const user=userModel.findByEmail({email})
      if(!user || !isValidPassword(user,password))
      {
        return res.redirect("/faillogin")
      }
      req.user=user
      next()
  }
  catch(error) {
    console.error(error)
  }
}

export const authorization =(role)=>{
  return async(req,res,next)=>{
      if (req.session?.user)
    {
      if (req.session?.user.rol !== role){
          return res.status(403).send({error: 'No permissions'})
      }
    }
    else
      return res.status(403).send({error: 'User not login'})
    next()
  }
}
