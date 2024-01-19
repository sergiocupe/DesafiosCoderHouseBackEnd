import express from "express";
import handlebars from 'express-handlebars' 
import { Server } from 'socket.io'
import productRoutes from "./routes/productRoutes.js";
import cartsRoutes from "./routes/cartsRoutes.js";
import { ProductManager } from "./clases/Producto.js";
import viewRoutes from './routes/viewsRoutes.js'

const PORT = 8080;
const app = express();
const pathJson = "./src/json/productos.json"
const productManager = new ProductManager(pathJson);
const products = await productManager.getProducts();

//*************** MIDLEWEARES **************/

app.use(express.json())
app.use(express.urlencoded({ extended: true}))
app.use(express.static('public'))

//*************** CONFIGURACION HANDLEBARS **************/

app.engine('handlebars',handlebars.engine()) 
app.set('views','src/views')
app.set('view engine', 'handlebars')
app.use('/', viewRoutes) //Configuracion de las vistas handlebars

 //*************** ROUTES API **************/

app.use('/api/products', productRoutes)
app.use('/api/carts', cartsRoutes)

//*************** SERVER **************/

const httpServer = app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});


//*************** SOCKETS **************/
const socketServer = new Server(httpServer) 

//Conexion Socket.io
socketServer.on("connection", async (socket)=>{
  console.log("Nuevo cliente conectado");
  
  socket.on('addProd', async prod => {
    try {
     const rdo = await productManager.addProduct(prod)
     const products = await productManager.getProducts();
     socket.emit("getAllProducts",products )  
     return rdo
    } catch (error) {
      console.log("Error al dar de alta un producto: ", error)
    }
	})

  socket.on('delProd', async id => {
    await productManager.deleteProduct(id)
    const products = await productManager.getProducts();
    socket.emit("getAllProducts",products )  
  });

});

