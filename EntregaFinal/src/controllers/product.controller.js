import { ProductMongoManager } from "../dao/managerDB/ProductMongoManager.js"
import ProductDTO from "../dtos/product.dto.js"
import CustomErrors from "../errors/CustomError.js"
import { productsNotFound, idErrorInfo, postProductErrorInfo } from "../errors/info.js"
import ErrorEnum from "../errors/error.enum.js"
import { UserMongoManager } from "../dao/managerDB/UserMongoManager.js"
import MailingService from "../utils/mailing.js"

export const getProducts = async (req, res, next) => {
  try {
    const { limit, page, sort, query, category, stockAvailability } = req.query
    const products = new ProductMongoManager()

    const resultado = await products.getProducts(
      limit,
      page,
      sort,
      query,
      category,
      stockAvailability
    )

    if (resultado.message === "OK") {
      return res.status(200).json(resultado)
    }
    
    req.logger.info("Error recuperar Productos")
    CustomErrors.createError({
      name: "Error recuperar Productos",
      cause: resultado.rdo,
      message: productsNotFound(),
      code: ErrorEnum.PRODUCTS_NOT_FOUND,
    })

  } catch (error) {
    req.logger.error(error.message)
    next(error)
  }
}

export const getProductsById = async (req, res, next) => {
  const { pId } = req.params
  try {
    const products = new ProductMongoManager()

    const resultado = await products.getProductById(pId)
    if (resultado.message === "OK") {
      return res.status(200).json(resultado)
    }

    req.logger.info("Producto Inexistente")
    CustomErrors.createError({
      name: "Producto Inexistente",
      cause: idErrorInfo('producto',pId), 
      message: resultado.rdo,
      code: ErrorEnum.INVALID_ID_ERROR,
    })
  } catch (error) {
    req.logger.error(error.message)
    next(error)
  }
}

export const postProduct = async (req, res, next) => {
  try {
    const products = new ProductMongoManager()
    const newProduct = new ProductDTO( {...req.body, thunbnail: req.file.filename} )
    const resultado = await products.addProduct(newProduct)
    
    if (resultado.message === "OK") {
      return res.status(200).json(resultado)
    }

    req.logger.error("Error Alta Producto")

    CustomErrors.createError({
      name: "Error Alta Producto",
      cause: postProductErrorInfo(),
      message: resultado.rdo,
      code: ErrorEnum.MISSING_DATA_ERROR,
    })  
  } catch (error) {
    req.logger.fatal(error.message)
    next(error)
  }
}

export const putProduct = async (req, res, next) => {
  try {

    const { pId } = req.params
    const updateProd = new ProductDTO(req.body)
    const products = new ProductMongoManager()

    const resultado = await products.updateProduct(pId, updateProd)

    if (resultado.message === "OK") {
      return res.status(200).json(resultado)
    }

    req.logger.error("Error Actualizar Producto")

    CustomErrors.createError({
      name: "Error Actualizar Producto",
      cause: idProductErrorInfo(pId),
      message: resultado.rdo,
      code: ErrorEnum.MISSING_DATA_ERROR,
    }) 
  } catch (error) {
    req.logger.fatal(error.message)
    next(error)
  }
}

export const deleteProduct = async (req, res, next) => {
    try {
      let resultado
      const { pId } = req.params

      const products = new ProductMongoManager()
      resultado = await products.getProductById(pId)
      const users = new UserMongoManager()
      resultado = await users.getUserById(resultado.rdo.owner)

      if (resultado.message==="OK"){
        if (resultado.rdo.rol==="Premium") {

          const mailingServices = new MailingService()
          const emailContent = `<p>el producto con id ${pId},se ha eliminado de la base de datos.</p>`
  
          // Envia el correo electrónico
          await mailingServices.sendMail({
            from: "Ecommerce CoderHouse",
            to: resultado.rdo.email,
            subject: "Notificacion de Eliminacion de Producto",
            html: emailContent,
          })
        }

        resultado = await products.deleteProduct(pId)

        if (resultado.message === "OK") 
          return res.status(200).json(resultado.rdo)
      }

      req.logger.error("Error Borrar Producto")

      CustomErrors.createError({
        name: "Error Borrar Producto",
        cause: idErrorInfo('producto',pId),
        message: resultado.rdo,
        code: ErrorEnum.MISSING_DATA_ERROR,
      })  
    } catch (error) {
      req.logger.fatal(error.message)
      next(error)
    }
}
