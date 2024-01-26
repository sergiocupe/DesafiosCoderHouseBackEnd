//Configuracion de Bcrypt para los metodos de encriptar y validar password
import bcrypt from 'bcrypt'

export const createHash = password =>bcrypt.hashSync(password, bcrypt.genSaltSync(10)) //lo hago lopear 10 veces para hashearlo y encriptarlo

export const isValidPassword = (user, password) => bcrypt.compareSync(password, user.password)

