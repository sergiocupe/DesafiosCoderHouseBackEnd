import multer from 'multer'

// Middleware para pasar el nombre de la carpeta dinámica
export const dynamicFolder = (folderName) => (req, res, next) => {
  req.dynamicFolderName = folderName;
  next();
};

// Define la función de destino dinámica que usa el nombre de la carpeta del req
const dynamicDestination = (req, file, cb) => {
  const folderName = req.dynamicFolderName;
  cb(null, `public/${folderName}`);
};

const storage = multer.diskStorage({
  destination: dynamicDestination,
  filename: (req, file, cb) => {
    if (!file.originalname.toUpperCase().includes("IDENTIFICACION") && !file.originalname.toUpperCase().includes("COMPROBANTEDOMICILIO") && !file.originalname.toUpperCase().includes("ESTADOCUENTA")) {
      // Si el nombre del archivo no contiene ninguna de las palabras especificadas, no debe ser guardado
      cb(new Error('El archivo no cumple con los requisitos de nombre, debe contener la pabra Identificacion o ComprobanteDomiciio o EstadoCuenta'))
    } else {
      // Si el nombre del archivo contiene alguna de las palabras especificadas, debe ser guardado
      const fileName = Date.now() + file.originalname;
      cb(null, fileName);
    }
  }
});


export const uploader=multer({storage})
