import ErrorEnum from "../errors/error.enum.js"

export const ErrorHandler = (error, req, res, next) => {
    
  console.log(error.cause)

    switch (error.code) {
    case ErrorEnum.INVALID_TYPE_ERROR:
      return res.status(400).send({ error: error.message })
    case ErrorEnum.INVALID_ID_ERROR:
      return res.status(404).send({error: error.message})        
    case ErrorEnum.CARTS_NOT_FOUND:
    case ErrorEnum.PRODUCTS_NOT_FOUND:
    case ErrorEnum.MISSING_DATA_ERROR:
      return res.status(404).send({error: error.message})        
    default:
      return res.status(400).send({ error: "Unhandled error" })
  }
}
