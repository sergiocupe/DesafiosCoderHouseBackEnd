import { CartMongoManager } from "../dao/managerDB/CartMongoManager.js"
import { ProductMongoManager } from "../dao/managerDB/ProductMongoManager.js"
import { TicketProductManager, Ticket } from "../dao/managerDB/TicketMongoManager.js"
import { generarCodigoAleatorio } from "../utils/functions.js"

export const getCart = async (req, res) => {
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
    res.status(400).json(resultado)
  } 
  catch (err) {
    res.status(400).json({ message: "Error al obtener los carritos" + err.menssage })
  }
}

export const getCartById = async (req, res) => {
  try{
    const {cId}=req.params
    const products = new CartMongoManager()

    const resultado = await products.getProductsCartById(cId)
    if (resultado.message==="OK"){
      return res.status(200).json(resultado)
    }
    res.status(400).json(resultado)
  }
  catch(err)
  {
    res.status(400).json({message: "El carrito no existe"})
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

export const postCartById = async (req, res) => {
  try{
    const {cId, pId} = req.params
    const newQuantity =  req.body.quantity
    const carts = new CartMongoManager()

    const resultado = await carts.addProductsInCart(cId, pId, newQuantity)

    if (resultado.message==="OK"){
      return res.status(200).json(resultado)
    }
    res.status(400).json(resultado)
  }
  catch(err){
    res.status(400).json({menssage: err})
  }
}

export const deleteCartById = async (req, res) => {
  try{
    const {cId} = req.params
    const carts = new CartMongoManager()

    const deleted = await carts.deleteCart(cId)

    if (deleted.message==="OK")
      return res.status(200).json(deleted.rdo)

    return res.status(404).json(deleted.rdo)
  }
  catch(err){
    res.status(400).json({menssage: err})
  }
}

export const deleteProductCartById = async (req, res) => {
  try{
    const {cId, pId} = req.params
    const carts = new CartMongoManager()

    const deleted = await carts.deleteProductByCart(cId,pId)

    if (deleted.message==="OK")
      return res.status(200).json(deleted.rdo)

    return res.status(404).json(deleted.rdo)
  }
  catch(err){
    res.status(400).json({message: err})
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
    const ticket = new Ticket(generarCodigoAleatorio(),new Date(),totalTicket,req.user.email)
    const rdoTicket = await ticketManager.addTicket(ticket)

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
