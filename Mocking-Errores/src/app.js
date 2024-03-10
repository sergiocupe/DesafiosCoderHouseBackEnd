import express from "express";
import mongoose from 'mongoose';
import handlebars from 'express-handlebars' 
import { Server } from 'socket.io'
import productRouter from "./routes/productRoutes.js";
import cartRouter from "./routes/cartsRoutes.js";
import messagesRouter from "./routes/messagesRoutes.js";
import { ProductMongoManager } from "./dao/managerDB/ProductMongoManager.js";
import { MessageMongoManager } from "./dao/managerDB/MessageMongoManager.js";
import viewRoutes from './routes/viewsRoutes.js'
import session from 'express-session'
import MongoStore from "connect-mongo"
import sessionRoutes from "./routes/sessionRoutes.js";
import passport from "passport"
import initializePassport from "./config/passport.config.js"
import { Command } from 'commander';
import { getVariables } from './config/config.js';

const app = express();

const program = new Command();
program.option('--mode <mode>', 'Modo de trabajo', 'production');
const options = program.parse();
const { port, mongoUrl, tockenSecret } = getVariables(options);

const productManager = new ProductMongoManager();
const messageManager = new MessageMongoManager()

//*************** MIDLEWEARES **************/
app.use(express.json())
app.use(express.urlencoded({ extended: true}))
app.use(express.static('public'))

//*************** MONGODB **************/

app.use(session({
  secret: tockenSecret, //constraseña secreta
  store: MongoStore.create({
    mongoUrl: mongoUrl,
    ttl: 1000
  }),
  resave: true, //guarda la session tras actualizarla
  saveUninitialized: true //si la session esta vacia, que se guarde igual
}))

mongoose.connect(mongoUrl)

//*************** PASSPORT **************/
initializePassport()
app.use(passport.initialize())
app.use(passport.session())

//*************** CONFIGURACION HANDLEBARS **************/
const hbs=handlebars.create({
  runtimeOptions: {
    allowProtoPropertiesByDefault : true
  }
}) //Nos permite pasar algunas propiedades de tipo prototipo, entonces en la vista no las mostraria. Mnadamos prop de mongoo sin problemas
app.engine("handlebars",hbs.engine)
app.set('views','src/views')
app.set('view engine', 'handlebars')
app.use('/', viewRoutes) //Configuracion de las vistas handlebars

 //*************** ROUTES API **************/
app.use('/api/products', productRouter)
app.use('/api/carts', cartRouter)
app.use('/api/messages', messagesRouter)
app.use('/api/session', sessionRoutes)

//*************** SERVER **************/
const httpServer = app.listen(port, () => {
  console.log(`listening on port ${port}`);
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
