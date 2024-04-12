import UserDTO from "../dtos/user.dto.js"
import {UserMongoManager} from '../dao/managerDB/UserMongoManager.js'
import CustomErrors from "../errors/CustomError.js"
import { postChangeRolUser, recoveryPassFaild, passwordRepet } from "../errors/info.js"
import ErrorEnum from "../errors/error.enum.js"
import MailingService from "../utils/mailing.js"
import { generateResetToken } from "../utils/functions.js"
import { TokenMongoManager } from "../dao/managerDB/TokenMongoManager.js"
import { createHash, isValidPassword } from "../utils/bcrypt.js"

export const postSession = (req, res) => {
  res.render('usercreatesuccess')
}

export const postLogin= (req, res) => {
    if(!req.user){
        req.logger.info("Error de credenciales")
        return res.status(400).send({message: 'Error de credenciales'})
    }
    req.session.user = {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        email: req.user.email,
        rol: req.user.rol
    }
    res.redirect('/products')
}

export const postLogout= (req, res) => {
  try{
    req.session.destroy((error)=>{
      if (error){
        req.logger.info("No se pudo cerrar la sesion")
        return res.status(500).send({message:'No se pudo cerrar la sesion'})
      }
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

export const changeRolUser = async (req, res, next) => {
  try {
    const { uId } = req.params
    
    const userMongoManager = new UserMongoManager()
    const resultado = await userMongoManager.changeRol(uId)

    if (resultado.message === "OK") {
      return res.status(200).json(resultado)
    }

    req.logger.error("Error al cambiar el Rol del Usuario")

    CustomErrors.createError({
      name: "Error Cambio Rol Usuario",
      cause: postChangeRolUser(),
      message: resultado.rdo,
      code: ErrorEnum.MISSING_DATA_ERROR,
    })  
  } catch (error) {
    req.logger.fatal(error.message)
    next(error)
  }
}

export const recoveryPass = async (req, res, next) => {
  try {
    const { email } = req.body
    let mensajeRdo = ""
    const userMongoManager = new UserMongoManager()
    const user = await userMongoManager.getUserByEmail(email)

    if (user.message==="OK") {
      const mailingServices = new MailingService()

      const token = generateResetToken()
      const tokenManager= new TokenMongoManager()
      const resultado = await tokenManager.addToken(token)

      if (resultado.message==="OK")
      {
        const emailContent = `
        Haga clic en el siguiente enlace para restablecer su contraseña:
        <a href="http://localhost:8080/resetpassword/${token.token}/${email}">Restablecer Contraseña</a>`

        await mailingServices.sendMail({
          from: 'Ecommerce CoderHouse',
          to: email,
          subject: 'Recuperacion de contraseña',
          html: emailContent
        })

        return res.status(200).json({message:'OK', rdo: 'Se envio el correo de recuperacion de contraseña correctamente.'})
      }
      else
        mensajeRdo = resultado.rdo
    }
    else
      mensajeRdo = user.rdo 

    req.logger.error("Error al recuperar la contraseña")

    CustomErrors.createError({
      name: "Error Recuperar Contraseña",
      cause: recoveryPassFaild(),
      message: mensajeRdo,
      code: ErrorEnum.MISSING_DATA_ERROR,
    })  
  } catch (error) {
    req.logger.fatal(error)
    next(error)
  }
}

export const resetPass = async (req, res, next) => {
  try{
    const { email, password } = req.body

    const userMongoManager = new UserMongoManager()
    const user = await userMongoManager.getUserByEmail(email)

    if (user.message==="OK"){
     if (!isValidPassword(user.rdo, password))
      {
        const actualizarPass = await userMongoManager.changePassword(email,createHash(password))
        if (actualizarPass.message==="OK")
          res.redirect('/changesuccess')
      }
    }

    req.logger.error("Error al regenerar la contraseña")

    CustomErrors.createError({
      name: "Error Regenerar Contraseña",
      cause: passwordRepet(),
      message: "Debe cambiar la contraseña por una nueva, no puede repetirse a las anteriores o la actual",
      code: ErrorEnum.MISSING_DATA_ERROR,
    })  
  } catch (error) {
    req.logger.fatal(error.message)
    next(error)
  }
}