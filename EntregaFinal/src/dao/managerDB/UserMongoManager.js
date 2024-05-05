import { obtenerFechaActual } from "../../utils/functions.js"
import MailingService from "../../utils/mailing.js"
import UserModel from "../models/user.models.js"

export class UserMongoManager {

  async getAllUsers() {
    const users=await UserModel.find()
    if (users) 
      return {message: "OK" , rdo: users}
    else 
      return {message: "ERROR", rdo: "No existen usuarios en la base de datos"}
  }

  async getUserByEmail(username) {
    const user=await UserModel.findOne({email: username})

    if (user) 
      return {message: "OK" , rdo: user}
    else 
      return {message: "ERROR", rdo: "El usuario no existe en la base de datos"}
  }
  
  async getUserById(uId) {
    const user=await UserModel.findOne({_id: uId})

    if (user) 
      return {message: "OK" , rdo: user}
    else 
      return {message: "ERROR", rdo: "El usuario no existe en la base de datos"}
  }

  async changePassword(username,password) {
    const update = await UserModel.findOneAndUpdate({email: username}, {password:password})

    if (update){
      return {message: "OK" , rdo: `Contraseña actualizada con exitosamente.`}
    }
    else 
      return {message: "ERROR", rdo: "No se pudo actualizar la contraseña reintente nuevamente"}
  } 

  async changeRol(uId) {
      try {
        const user=await UserModel.findOne({_id: uId})

        if (user)
        {
          let newRol=""
          if (user.rol==="Usuario")
            newRol="Premium"
          else
            newRol="Usuario"

          const updated = await UserModel.findOneAndUpdate(
            { _id: uId },
            { rol: newRol }
          )
          return {message: "OK" , rdo: "Se modifico el rol satisfactoriamente"}
        }
        return {message: "ERROR" , rdo: "El usuario no existe en la base de datos"}
      } 
      catch (e) {
        return {message: "ERROR" , rdo: "Error al modificar el rol." + e.message}
      }
    }

    
  async changeLastConnection(username) {
    const update = await UserModel.findOneAndUpdate({email: username}, {last_connection:obtenerFechaActual()})

    if (update){
      return {message: "OK" , rdo: `Fecha de Ultimo ingreso actualizada con exitosamente.`}
    }
    else 
      return {message: "ERROR", rdo: "No se pudo actualizar la fecha de ultimo ingreso"}
  } 

  async addDocumentosByUser(uId,documents) {

    const update = await UserModel.findOneAndUpdate({_id: uId}, {documents:documents})

    if (update){
      return {message: "OK" , rdo: `Documentos agregados correctamente.`}
    }
    else 
      return {message: "ERROR", rdo: "No se pudo agregar los documentos al usuario"}
  } 

  async updateStatusDocument(uId,clave) {
    const update = await UserModel.findOneAndUpdate({ _id: uId }, { $set: { [clave]: true } }, { new: true } )

    if (update){
      return {message: "OK" , rdo: `Estado de documento actualizado con exitosamente.`}
    }
    else 
      return {message: "ERROR", rdo: "No se pudo actualizar el estado del documento"}
  } 

  async deleteUsersLastConection() {
    try {           
      const dosDiasAtras = new Date()
      dosDiasAtras.setDate(dosDiasAtras.getDate() - 2)
      
      const users= await UserModel.find({ last_connection: { $lt: dosDiasAtras } })

      if (users){        
        // Instanciar el servicio de correo electrónico
         const mailingServices = new MailingService()

        // Recorrer los usuarios y enviar correo a cada uno
        for (const user of users) {
          try {

            const emailContent = `<p>Hola ${user.first_name},</p><p>Este es un recordatorio de que no has iniciado sesión en nuestra plataforma en los últimos 2 días.</p>`

            // Envia el correo electrónico
            await mailingServices.sendMail({
              from: "Ecommerce CoderHouse",
              to: user.email,
              subject: "Recordatorio de inactividad",
              html: emailContent,
            })
            
            // Eliminar el usuario de la base de datos
            await UserModel.findByIdAndDelete(user._id)
            
          } catch (error) {
            console.error(`Error al enviar correo electrónico a ${user.email}:`, error)
          }
        }
        return {message: "OK" , rdo: `Usuarios eliminados exitosamente.`}
      } 
    }
    catch (e) {
      console.log(e)
      return {message: "ERROR" , rdo: "Error al momento de eliminar los usuarios"}
    }
  }

  async deleteUser(id) {
    try {
      const deleted = await UserModel.deleteOne({_id: id})
      
      if (deleted.deletedCount === 0){
        return {message: "ERROR" , rdo: `No se encontró un usuario con el ID ${id}. No se pudo eliminar.`}
      }

      return {message: "OK" , rdo: `Usuario con ID ${id} eliminado exitosamente.`}
    } 
    catch (e) {
      return {message: "ERROR" , rdo: "Error al momento de eliminar el Usuario"}
    }
  }  
}
