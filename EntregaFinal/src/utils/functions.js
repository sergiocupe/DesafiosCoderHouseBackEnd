import crypto from 'crypto'

export function generarCodigoAleatorio() {
  var caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  var codigo = ''

  for (var i = 0; i < 10; i++) {
      var indice = Math.floor(Math.random() * caracteres.length)
      codigo += caracteres.charAt(indice)
  }

  return codigo
}

export function obtenerFechaActual(){
  //Obtengo la fecha actual, restandole 3 horas por el UTC
  const currentDate = new Date()
  const utcHours = currentDate.getUTCHours() - 3 
  
  const utcDate = new Date(Date.UTC(
        currentDate.getUTCFullYear(),
        currentDate.getUTCMonth(),
        currentDate.getUTCDate(),
        (utcHours < 0) ? (utcHours + 24) : utcHours,
        currentDate.getUTCMinutes(),
        currentDate.getUTCSeconds()
  ))
  
  return utcDate
}

export function generateResetToken () {
  // Generar un token aleatorio usando crypto.randomBytes
  const token = crypto.randomBytes(32).toString('hex')

  // Calcular la fecha y hora de expiración (1 hora después de la generación del token), como esta en UTC +3 le resto 2
  const expiry = new Date()
  expiry.setHours(expiry.getHours() - 2)
  return {
    token: token,
    expire: expiry
  }
}