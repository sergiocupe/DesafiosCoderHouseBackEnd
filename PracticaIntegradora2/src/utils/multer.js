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
    const fileName = Date.now() + file.originalname;
    cb(null, fileName);
  },
});


export const uploader=multer({storage})
