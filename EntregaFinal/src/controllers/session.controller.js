import UserDTO from "../dtos/user.dto.js"
import {UserMongoManager} from '../dao/managerDB/UserMongoManager.js'
import CustomErrors from "../errors/CustomError.js"
import { postChangeRolUser, recoveryPassFaild, passwordRepet, postChangeLastLogin, postAddDocumentsUser, postErrorDocumentsUser } from "../errors/info.js"
import ErrorEnum from "../errors/error.enum.js"
import MailingService from "../utils/mailing.js"
import { generateResetToken } from "../utils/functions.js"
import { TokenMongoManager } from "../dao/managerDB/TokenMongoManager.js"
import { createHash, isValidPassword } from "../utils/bcrypt.js"
import { Command } from "commander"
import { getVariables } from "../config/config.js"
import { usersNotFound, idErrorInfo } from "../errors/info.js"

const program = new Command()
program.option('--mode <mode>', 'Modo de trabajo', 'production')
const options = program.parse()
const { userAdmin, webUrl } = getVariables(options)

export const getUsers = async (req, res, next) => {
  try {
    const userMongoManager = new UserMongoManager()
    const users = await userMongoManager.getAllUsers()

    const resultado = users.rdo.map(u=>new UserDTO(u).getCurrentUser())

    if (resultado) {
      return res.status(200).json(resultado)
    }
    
    req.logger.info("Error recuperar los Usuarios")
    CustomErrors.createError({
      name: "Error recuperar Usuarios",
      cause: resultado.rdo,
      message: usersNotFound(),
      code: ErrorEnum.USERS_NOT_FOUND,
    })

  } catch (error) {
    req.logger.error(error.message)
    next(error)
  }
}

export const getAllUsers = async (req, res, next) => {
  try {
    const userMongoManager = new UserMongoManager()
    const resultado = await userMongoManager.getAllUsers()

    if (resultado) {
      return res.status(200).json(resultado)
    }
    
    req.logger.info("Error recuperar los Usuarios")
    CustomErrors.createError({
      name: "Error recuperar Usuarios",
      cause: resultado.rdo,
      message: usersNotFound(),
      code: ErrorEnum.USERS_NOT_FOUND,
    })

  } catch (error) {
    req.logger.error(error.message)
    next(error)
  }
}


export const deleteUsers= async (req, res, next) => {
  try {
  const userMongoManager = new UserMongoManager()
  const resultado = await userMongoManager.deleteUsersLastConection()
  
  if (resultado) {
    return res.status(200).json(resultado)
  }

  req.logger.info("Error Eliminar los Usuarios de última conexión")
  CustomErrors.createError({
    name: "Error Eliminar Usuarios",
    cause: resultado.rdo,
    message: usersNotFound(),
    code: ErrorEnum.USERS_NOT_FOUND,
  })

} catch (error) {
  req.logger.error(error.message)
  next(error)
}

}

export const postSession = (req, res) => {
  res.render('usercreatesuccess')
}

export const postLogin = async (req, res, next) => {
  try {
    let resultado

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

    if (req.user.email!=userAdmin)
    {
      const user = new UserMongoManager()
      resultado = await user.changeLastConnection(req.user.email)
    }
    else
     resultado = {message: "OK"}

    if (resultado.message === "OK") {
      return res.redirect('/products')
    }

    req.logger.error("Error al cambiar la Fecha de Login")

    CustomErrors.createError({
      name: "Error Fecha Login",
      cause: postChangeLastLogin(),
      message: resultado.rdo,
      code: ErrorEnum.MISSING_DATA_ERROR,
    })  

  } catch (error) {
    req.logger.fatal(error.message)
    next(error)
  }
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

export const changeRolUserPorAdmin = async (req, res, next) => {
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

export const changeRolUser = async (req, res, next) => {
  try {
    const { uId } = req.params
    
    const userMongoManager = new UserMongoManager()

    const user = await userMongoManager.getUserById(uId)

    if ((!user.rdo.identificacion || !user.rdo.estadoCuenta || !user.rdo.comprobanteDomicilio) && (user.rdo.rol==="Usuario"))
    {
      req.logger.error("Error al cambiar el Rol del Usuario")

      CustomErrors.createError({
        name: "Error Cambio Rol Usuario",
        cause: postErrorDocumentsUser(),
        message: "Faltan documentos en el usuario",
        code: ErrorEnum.MISSING_DATA_ERROR,
      })  
    }

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
        <a href=${webUrl}/resetpassword/${token.token}/${email}">Restablecer Contraseña</a>`

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

export const addDocuments = async (req, res, next) => {
  try {
    const { uId } = req.params
    const documentNames = req.files.map(file => file.filename);
    let identificacion,comprobanteDomicilio, estadoCuenta= undefined;

    const userMongoManager = new UserMongoManager()
    const user = await userMongoManager.getUserById(uId)

    const documentsUser = user.documents

    if (documentsUser) {
      identificacion = documentsUser.find(doc=>doc.name==="Identificacion") 
      comprobanteDomicilio = documentsUser.find(doc=>doc.name==="ComprobanteDomicilio") 
      estadoCuenta = documentsUser.find(doc=>doc.name==="EstadoCuenta") 
    }

    const docIdentificacion = documentNames.find(doc=>doc.toUpperCase().includes("IDENTIFICACION")) 
    const docDomicilio = documentNames.find(doc=>doc.toUpperCase().includes("COMPROBANTEDOMICILIO")) 
    const docEstadoCuenta = documentNames.find(doc=>doc.toUpperCase().includes("ESTADOCUENTA")) 

    if (docIdentificacion) {
      identificacion={"Identificacion": docIdentificacion}
      await userMongoManager.updateStatusDocument(uId, 'identificacion')
    }

    if (docDomicilio) {
      comprobanteDomicilio={"ComprobanteDomicilio": docDomicilio}
      await userMongoManager.updateStatusDocument(uId, 'comprobanteDomicilio')
    }

    if (docEstadoCuenta) {
      estadoCuenta={"EstadoCuenta": docEstadoCuenta}
      await userMongoManager.updateStatusDocument(uId, 'estadoCuenta')
    }

    const resultado = await userMongoManager.addDocumentosByUser(uId, [identificacion,comprobanteDomicilio,estadoCuenta])

    if (resultado.message === "OK") {
      return res.status(200).json(resultado)
    }

    req.logger.error("Error al agregar documentos del Usuario")

    CustomErrors.createError({
      name: "Error Documentos de Usuario",
      cause: postAddDocumentsUser(),
      message: resultado.rdo,
      code: ErrorEnum.MISSING_DATA_ERROR,
    })  
  } catch (error) {
    req.logger.fatal(error.message)
    next(error)
  }
}

export const deleteUser = async (req, res, next) => {
  try {
    const { uId } = req.params
    const users = new UserMongoManager()

    const resultado = await users.deleteUser(uId)

    if (resultado.message === "OK") 
      return res.status(200).json(resultado.rdo)

    req.logger.error("Error Borrar Usuario")

    CustomErrors.createError({
      name: "Error Borrar Usuario",
      cause: idErrorInfo('usuario',uId),
      message: resultado.rdo,
      code: ErrorEnum.MISSING_DATA_ERROR,
    })  
  } catch (error) {
    req.logger.fatal(error.message)
    next(error)
  }
}