import UserDTO from "../dtos/user.dto.js";

export const postSession = (req, res) => {
  res.render('usercreatesuccess')
}

export const postLogin= (req, res) => {
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

export const postLogout= (req, res) => {
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
}

export const getCurrent= (req, res) => {
  const user = new UserDTO(req.user)
  res.send(user.getCurrentUser())
}

export const getGithub= (req, res) => {
    req.session.user=req.user
    res.redirect('/products')
}
