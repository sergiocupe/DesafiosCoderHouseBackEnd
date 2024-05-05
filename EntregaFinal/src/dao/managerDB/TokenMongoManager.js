import { obtenerFechaActual } from "../../utils/functions.js"
import TokenModel from "../models/token.models.js"

export class TokenMongoManager {
  async addToken(token) {
    try {
      //Validacion de los campos
      const validacion = !token.token || !token.expire ? false : true

      if (!validacion)
        return {message: "ERROR" , rdo: "Faltan datos en el token a generar!"}

      const added = await TokenModel.create(token)  

      return {message: "OK" , rdo: "Token generado con exito"}
    } 
    catch (e) {
      return {message: "ERROR" , rdo: "Error al agregar el token"}
    }
  }

  async checkExpire (token) {
    try {
      const tokenMongo = await TokenModel.findOne({token:token})
      if (tokenMongo!==null){
        const expired = this.isTokenExpired(tokenMongo.expire)
        return {message: "OK" , rdo: expired}
      }
      else
        return {message: "ERROR" , rdo: "El token no existe"}
    } 
    catch (e) {
      return {message: "ERROR" , rdo: "Error al validar el token"}
    }
  }

  isTokenExpired = (expire) => {
    const expireDate = new Date(expire)
    const currentDate = obtenerFechaActual()
    return expireDate > currentDate
  }

}