import { CartMongoManager } from "../dao/managerDB/CartMongoManager.js"
import { ProductMongoManager } from "../dao/managerDB/ProductMongoManager.js"
import { TicketProductManager } from "../dao/managerDB/TicketMongoManager.js"
import { generarCodigoAleatorio } from "../utils/functions.js"
import TicketDTO from "../dtos/ticket.dto.js"
import CustomErrors from "../errors/CustomError.js"
import { cartsNotFound, idErrorInfo, postCartErrorInfo } from "../errors/info.js"
import ErrorEnum from "../errors/error.enum.js"

export const getCart = async (req, res, next) => {
  try {
    const { limit } = req.query
    const carts = new CartMongoManager()

    const resultado = await carts.getCarts()

    if (resultado.message==="OK")
    {
      //Si no tiene limite, devuelve todos los productos
      if (!limit) 
        return res.status(200).json(resultado)

      const productsLimit = resultado.rdo.slice(0, limit)
      return res.status(200).json(productsLimit)
    }

    req.logger.error("Error recuperar Carritos")

    CustomErrors.createError({
      name: "Error recuperar Carritos",
      cause: resultado.rdo,
      message: cartsNotFound(),
      code: ErrorEnum.CARTS_NOT_FOUND,
    })
  } 
  catch (error) {
    req.logger.error(error.message)
    next(error)
  }
}

export const getCartById = async (req, res, next) => {
  try{
    const {cId}=req.params
    const products = new CartMongoManager()

    const resultado = await products.getProductsCartById(cId)

    if (resultado.message==="OK"){
      return res.status(200).json(resultado)
    }

    req.logger.info("Carrito Inexistente")

    CustomErrors.createError({
      name: "Carrito Inexistente",
      cause: idErrorInfo('carrito',cId),
      message: resultado.rdo,
      code: ErrorEnum.INVALID_ID_ERROR,
    }) 
  }
  catch (error) {
    req.logger.error(error.message)
    next(error)
  }
}

export const postCart = async (req, res) => {
  try{
    const carts = new CartMongoManager()
    const resultado = await carts.addCart({products:[]})  
    if (resultado.message==="OK"){
      return res.status(200).json(resultado)
    }
    req.logger.error("Error al actualizar el carrito")
    res.status(400).json(resultado)
  }
  catch(err){
    req.logger.fatal(error.message)
    res.status(400).json({message: err})
  }
}

export const postCartById = async (req, res, next) => {
  try{
    const {cId, pId} = req.params
    const newQuantity =  req.body.quantity
    const carts = new CartMongoManager()

    const resultado = await carts.addProductsInCart(cId, pId, newQuantity)

    if (resultado.message==="OK"){
      return res.status(200).json(resultado)
    }

    req.logger.error("Error Alta Carrito")

    CustomErrors.createError({
      name: "Error Alta Carrito",
      cause: postCartErrorInfo(req.body),
      message: resultado.rdo,
      code: ErrorEnum.MISSING_DATA_ERROR,
    })  
  } catch (error) {
    req.logger.fatal(error.message)
    next(error)
  }
}

export const deleteCartById = async (req, res, next) => {
  try{
    const {cId} = req.params
    const carts = new CartMongoManager()

    const deleted = await carts.deleteCart(cId)

    if (deleted.message==="OK")
      return res.status(200).json(deleted.rdo)

    req.logger.error("Error Borrar Carrito")

    CustomErrors.createError({
        name: "Error Borrar Carrito",
        cause: idErrorInfo('carrito',cId),
        message: resultado.rdo,
        code: ErrorEnum.MISSING_DATA_ERROR,
    })  
  } catch (error) {
      req.logger.fatal(error.message)
      next(error)
  }
}

export const deleteProductCartById = async (req, res, next) => {
  try{
    const {cId, pId} = req.params
    const carts = new CartMongoManager()

    const deleted = await carts.deleteProductByCart(cId,pId)

    if (deleted.message==="OK")
      return res.status(200).json(deleted.rdo)

    req.logger.error("Error Borrar Producto Carrito")

    CustomErrors.createError({
        name: "Error Borrar Producto Carrito",
        cause: idErrorInfo('producto',pId),
        message: resultado.rdo,
        code: ErrorEnum.MISSING_DATA_ERROR,
     })  
  } 
  catch (error) {
    req.logger.fatal(error.message)
    next(error)
  }
}

export const purchaseCartById = async (req,res)=>{
  try{
    const {cId} = req.params
    const carts = new CartMongoManager()
    let totalTicket = 0
    const prodSinStock =[]
    const productos = await carts.getProductsCartById(cId)

    req.logger.debug("Se obtuvieron los productos del carrito")

    if (productos.message==="OK"){
      //Recorro los productos del carrito
      req.logger.debug("Se recorren los productos del carrito")
      const promises = productos.rdo.map(async item => {
        const product = item.product
        const quantity = item.quantity
        const stock = product.stock
        const id = product._id
        const price = product.price

        req.logger.debug("Item con Id: " + id)

        // Verificando si la cantidad es menor o igual al stock
        if (quantity <= stock) {
          req.logger.debug("Cantidad <= Stock ")

          const prod = new ProductMongoManager()
          const rdoProdUpdate = await prod.updateProduct(id, {stock:stock-quantity})

          req.logger.debug("Se actualizo el stock del producto con Id: " + id)

          //Si actualizo el stock ok, sumo al total acumulado este item
          if (rdoProdUpdate.message==="OK"){
            //Obtengo el total del carrito
            totalTicket += (price*quantity)
          }
        } else {
          //Si no hay stock, agrego el id en un array para devolverlo
          req.logger.debug("No hay stock del producto con Id: " + id)
          prodSinStock.push(id)
        }
      })

    // Esperar a que todas las promesas se resuelvan
    await Promise.all(promises)
    
    //Agrego el ticket del carrito
    const ticketManager = new TicketProductManager()
    const ticket = {
      "code":generarCodigoAleatorio(),
      "purchase_datetime":new Date(),
      "amount":totalTicket,
      "purchaser": req.user.email
    }
    const ticketDto = new TicketDTO(ticket)
    const rdoTicket = await ticketManager.addTicket(ticketDto)

    const messageFinal = prodSinStock.length>0 ? 'Compra realizada incompleta. Productos sin stock - ' + prodSinStock : 'Compra realizada de forma completa'

    if (rdoTicket.message==="OK")
    {
      req.logger.debug("Se genero el ticket correctamente")
      return res.status(200).json({message : "OK", rdo: messageFinal})
    }
  }     
  res.status(400).json(productos)
 }
 catch(err){
  console.log(err)
      req.logger.fatal(error.message)
    res.status(400).json({menssage: err})
 }
}
