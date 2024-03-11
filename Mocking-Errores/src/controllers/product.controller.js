import { ProductMongoManager } from "../dao/managerDB/ProductMongoManager.js"
import ProductDTO from "../dtos/product.dto.js"
import CustomErrors from "../errors/CustomError.js"
import { productsNotFound, idErrorInfo, postProductErrorInfo } from "../errors/info.js"
import ErrorEnum from "../errors/error.enum.js"

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
    
    CustomErrors.createError({
      name: "Error recuperar Productos",
      cause: resultado.rdo,
      message: productsNotFound(),
      code: ErrorEnum.PRODUCTS_NOT_FOUND,
    })

  } catch (error) {
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

    CustomErrors.createError({
      name: "Producto Inexistente",
      cause: idErrorInfo('producto',pId),
      message: resultado.rdo,
      code: ErrorEnum.INVALID_ID_ERROR,
    })
  } catch (error) {
    next(error)
  }
}

export const postProduct = async (req, res, next) => {
  try {
    const products = new ProductMongoManager()
    const newProduct = new ProductDTO(req.body)
    const resultado = await products.addProduct(newProduct)
    if (resultado.message === "OK") {
      return res.status(200).json(resultado)
    }
    CustomErrors.createError({
      name: "Error Alta Producto",
      cause: postProductErrorInfo(),
      message: resultado.rdo,
      code: ErrorEnum.MISSING_DATA_ERROR,
    })  
  } catch (error) {
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
    CustomErrors.createError({
      name: "Error Actualizar Producto",
      cause: idProductErrorInfo(pId),
      message: resultado.rdo,
      code: ErrorEnum.MISSING_DATA_ERROR,
    }) 
  } catch (error) {
    next(error)
  }
}

export const deleteProduct = async (req, res, next) => {
  try {
    const { pId } = req.params
    const products = new ProductMongoManager()

    const resultado = await products.deleteProduct(pId)

    if (resultado.message === "OK") 
      return res.status(200).json(deleted.rdo)

    CustomErrors.createError({
      name: "Error Borrar Producto",
      cause: idErrorInfo('producto',pId),
      message: resultado.rdo,
      code: ErrorEnum.MISSING_DATA_ERROR,
    })  
  } catch (error) {
    next(error)
  }
}
