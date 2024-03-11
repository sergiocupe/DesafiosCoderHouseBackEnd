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

    CustomErrors.createError({
      name: "Error recuperar Carritos",
      cause: resultado.rdo,
      message: cartsNotFound(),
      code: ErrorEnum.CARTS_NOT_FOUND,
    })
  } 
  catch (error) {
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

    CustomErrors.createError({
      name: "Carrito Inexistente",
      cause: idErrorInfo('carrito',cId),
      message: resultado.rdo,
      code: ErrorEnum.INVALID_ID_ERROR,
    }) 
  }
  catch (error) {
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
    res.status(400).json(resultado)
  }
  catch(err){
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
    CustomErrors.createError({
      name: "Error Alta Cart",
      cause: postCartErrorInfo(req.body),
      message: resultado.rdo,
      code: ErrorEnum.MISSING_DATA_ERROR,
    })  
  } catch (error) {
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

      CustomErrors.createError({
        name: "Error Borrar Carrito",
        cause: idErrorInfo('carrito',cId),
        message: resultado.rdo,
        code: ErrorEnum.MISSING_DATA_ERROR,
      })  
    } catch (error) {
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

    CustomErrors.createError({
        name: "Error Borrar Producto Carrito",
        cause: idErrorInfo('producto',pId),
        message: resultado.rdo,
        code: ErrorEnum.MISSING_DATA_ERROR,
     })  
  } catch (error) {
      next(error)
  }
}

export const purchaseCartById = async (req,res)=>{
  try{
    const {cId} = req.params
    const carts = new CartMongoManager()
    const productos = await carts.getProductsCartById(cId)
    let totalTicket = 0
    const prodSinStock =[]

    if (productos.message==="OK"){
      //Recorro los productos del carrito
      const promises = productos.rdo.map(async item => {
        const product = item.product;
        const quantity = item.quantity;
        const stock = product.stock;
        const id = product._id
        const price = product.price;

        // Verificando si la cantidad es menor o igual al stock
        if (quantity <= stock) {
          const prod = new ProductMongoManager()
          const rdoProdUpdate = await prod.updateProduct(id, {stock:stock-quantity})

          //Si actualizo el stock ok, sumo al total acumulado este item
          if (rdoProdUpdate.message==="OK"){
            //Obtengo el total del carrito
            totalTicket += (price*quantity)
          }
        } else {
          //Si no hay stock, agrego el id en un array para devolverlo
          prodSinStock.push(item._id)
        }
      });

    // Esperar a que todas las promesas se resuelvan
    await Promise.all(promises);
    
    //Agrego el ticket del carrito
    const ticketManager = new TicketProductManager()
    const ticket = ()=>{generarCodigoAleatorio(),new Date(),totalTicket,req.user.email}
    const ticketDto = new TicketDTO(ticket)
    const rdoTicket = await ticketManager.addTicket(ticketDto)

    const messageFinal = prodSinStock.length>0 ? 'Compra realizada incompleta. Productos sin stock - ' + prodSinStock : 'Compra realizada de forma completa'

    if (rdoTicket.message==="OK")
      return res.status(200).json({message : messageFinal})
    }     
    res.status(400).json(productos)
  }
  catch(err){
    res.status(400).json({menssage: err})
  }
}
