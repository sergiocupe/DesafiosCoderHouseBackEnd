import UserModel from "../models/user.models.js"

export class UserMongoManager {

  async getUserByEmail(username) {
    const user=await UserModel.findOne({email: username})

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
}
