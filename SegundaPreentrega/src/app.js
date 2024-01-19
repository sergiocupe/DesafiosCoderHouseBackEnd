import express from "express";
import mongoose from 'mongoose';
import handlebars from 'express-handlebars' 
import { Server } from 'socket.io'
import productRouter from "./routes/productRoutes.js";
import cartRouter from "./routes/cartsRoutes.js";
import messagesRouter from "./routes/messagesRoutes.js";
//import { ProductManager } from "./dao/managerFS/ProductManager.js";
import { ProductMongoManager } from "./dao/managerDB/ProductMongoManager.js";
import { MessageMongoManager } from "./dao/managerDB/MessageMongoManager.js";
import viewRoutes from './routes/viewsRoutes.js'

const PORT = 8080;
const app = express();
//const pathJson = "./src/json/productos.json"
//const productManager = new ProductManager(pathJson);
const productManager = new ProductMongoManager();
const messageManager = new MessageMongoManager()
//const products = await productManager.getProducts();

//*************** MIDLEWEARES **************/

app.use(express.json())
app.use(express.urlencoded({ extended: true}))
app.use(express.static('public'))

//*************** MONGODB **************/

mongoose.connect("mongodb+srv://sergiocupe:Coder2024@coder.0nonzsv.mongodb.net/ecommerce")

//*************** CONFIGURACION HANDLEBARS **************/

app.engine('handlebars',handlebars.engine()) 
app.set('views','src/views')
app.set('view engine', 'handlebars')
app.use('/', viewRoutes) //Configuracion de las vistas handlebars

 //*************** ROUTES API **************/

app.use('/api/products', productRouter)
app.use('/api/carts', cartRouter)
app.use('/api/messages', messagesRouter)

//*************** SERVER **************/

const httpServer = app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});


//*************** SOCKETS **************/
const socketServer = new Server(httpServer) 

const messages=[]

//Conexion Socket.io
socketServer.on("connection", async (socket)=>{
  console.log("Nuevo cliente conectado");
  
  socket.on('addProd', async prod => {
    try {
     const rdo = await productManager.addProduct(prod)
     if (rdo.message==="OK")
     {
      const resultado = await productManager.getProducts();
      if (resultado.message==="OK")
      {
        socket.emit("getAllProducts",resultado.rdo )  
      }
     }
     return rdo
    } catch (error) {
      console.log("Error al dar de alta un producto: ", error)
    }
	})

  socket.on('delProd', async id => {
    const deleted=await productManager.deleteProduct(id)
    if (deleted.message==="OK")
    {
      const resultado = await productManager.getProducts();
      if (resultado.message==="OK")
      {
        socket.emit("getAllProducts",resultado.rdo )  
      }
    }
    else
      console.log("Error al eliminar un producto: ", deleted.rdo)
  });

  socket.on('message', data=>{
    messages.push(data)
    messageManager.addMessage(data)
    socketServer.emit('messageLogs', messages)
  })

  socket.on('newUser', data =>{
    socket.emit('newConnection', 'Un nuevo usuario se conecto - ' + data)
    socket.broadcast.emit('notification', data)
  })

});
