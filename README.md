# Desafios CoderHouse BackEnd

## Desafio 1

Consigna

✓ Realizar una clase “ProductManager” que gestione un conjunto de productos.

✓ Debe crearse desde su constructor con el elemento products, el cual será un arreglo vacío.
Cada producto que gestione debe contar con las propiedades:
- title (nombre del producto)
- description (descripción del producto)
- price (precio)
- thumbnail (ruta de imagen)
- code (código identificador)
- stock (número de piezas disponibles)
  
✓ Debe contar con un método “addProduct” el cual agregará un producto al arreglo de productos inicial.
- Validar que no se repita el campo “code” y que todos los campos sean obligatorios
- Al agregarlo, debe crearse con un id autoincrementable ✓ Debe contar con un método “getProducts” el cual debe devolver el arreglo con todos los productos creados hasta ese momento

✓ Debe contar con un método “getProductById” el cual debe buscar en el arreglo el producto que coincida con el id
- En caso de no coincidir ningún id, mostrar en consola un error “Not found”


## Desafio 2

Consigna

✓ Realizar una clase de nombre “ProductManager”, el cual permitirá trabajar con múltiples productos. Éste debe poder agregar, consultar, modificar y eliminar un producto y manejarlo en persistencia de archivos (basado en entregable 1).

✓ La clase debe contar con una variable this.path, el cual se inicializará desde el constructor y debe recibir la ruta a trabajar desde el momento de generar su instancia.

✓ Debe guardar objetos con el siguiente formato:
id (se debe incrementar automáticamente, no enviarse desde el cuerpo)
title (nombre del producto)
description (descripción del producto)
price (precio)
thumbnail (ruta de imagen)
code (código identificador)
stock (número de piezas disponibles)

✓ Debe tener un método addProduct el cual debe recibir un objeto con el formato previamente especificado, asignarle un id autoincrementable y guardarlo en el arreglo (recuerda siempre guardarlo como un array en el archivo).

✓ Debe tener un método getProducts, el cual debe leer el archivo de productos y devolver todos los productos en formato de arreglo.

✓ Debe tener un método getProductById, el cual debe recibir un id, y tras leer el archivo, debe buscar el producto con el id especificado y devolverlo en formato objeto

✓ Debe tener un método updateProduct, el cual debe recibir el id del producto a actualizar, así también como el campo a actualizar (puede ser el objeto completo, como en una DB), y debe actualizar el producto que tenga ese id en el archivo. NO DEBE BORRARSE SU ID 

✓ Debe tener un método deleteProduct, el cual debe recibir un id y debe eliminar el producto que tenga ese id en el archivo.

## Desafio 3

Consigna

✓ Desarrollar un servidor basado en express donde podamos hacer consultas a nuestro archivo de productos.

✓ Se deberá utilizar la clase ProductManager que actualmente utilizamos con persistencia de archivos. 

✓ Desarrollar un servidor express que, en su archivo app.js importe al archivo de ProductManager que actualmente tenemos.

✓ El servidor debe contar con los siguientes endpoints:
- ruta ‘/products’, la cual debe leer el archivo de productos y devolverlos dentro de un objeto. Agregar el soporte para recibir por query param el valor ?limit= el cual recibirá un límite de resultados.
- Si no se recibe query de límite, se devolverán todos los productos
- Si se recibe un límite, sólo devolver el número de productos solicitados
- ruta ‘/products/:pid’, la cual debe recibir por req.params el pid (product Id), y devolver sólo el producto solicitado, en lugar de todos los productos.

✓ Tu clase lee archivos con promesas. recuerda usar async/await en tus endpoints

✓ Utiliza un archivo que ya tenga productos, pues el desafío sólo es para gets. 

## Primera PreEntrega

Consigna

Se debe entregar

Desarrollar el servidor basado en Node.JS y express, que escuche en el puerto 8080 y disponga de dos grupos de rutas: /products y /carts. Dichos endpoints estarán implementados con el router de express, con las siguientes especificaciones:

Para el manejo de productos, el cual tendrá su router en /api/products/ , configurar las siguientes rutas:
✓ La ruta raíz GET / deberá listar todos los productos de la base. (Incluyendo la limitación ?limit del desafío anterior
✓ La ruta GET /:pid deberá traer sólo el producto con el id proporcionado
✓ La ruta raíz POST / deberá agregar un nuevo producto con los campos:
id: Number/String (A tu elección, el id NO se manda desde body, se autogenera como lo hemos visto desde los primeros entregables, asegurando que NUNCA se repetirán los ids en el archivo.
title:String,
description:String
code:String
price:Number
status:Boolean
stock:Number
category:String
thumbnails:Array de Strings que contenga las rutas donde están almacenadas las imágenes referentes a dicho producto
Status es true por defecto.
Todos los campos son obligatorios, a excepción de thumbnails
✓ La ruta PUT /:pid deberá tomar un producto y actualizarlo por los campos enviados desde body. NUNCA se debe actualizar o eliminar el id al momento de hacer dicha actualización.
✓ La ruta DELETE /:pid deberá eliminar el producto con el pid indicado. 

Para el carrito, el cual tendrá su router en /api/carts/, configurar dos rutas:
✓ La ruta raíz POST / deberá crear un nuevo carrito con la siguiente estructura:
Id:Number/String (A tu elección, de igual manera como con los productos, debes asegurar que nunca se dupliquen los ids y que este se autogenere).
products: Array que contendrá objetos que representen cada producto
✓ La ruta GET /:cid deberá listar los productos que pertenezcan al carrito con el parámetro cid proporcionados.
✓ La ruta POST  /:cid/product/:pid deberá agregar el producto al arreglo “products” del carrito seleccionado, agregándose como un objeto bajo el siguiente formato:
- product: SÓLO DEBE CONTENER EL ID DEL PRODUCTO (Es crucial que no agregues el producto completo)
- quantity: debe contener el número de ejemplares de dicho producto. El producto, de momento, se agregará de uno en uno.

Además, si un producto ya existente intenta agregarse al producto, incrementar el campo quantity de dicho producto. 

La persistencia de la información se implementará utilizando el file system, donde los archivos “productos,json” y “carrito.json”, respaldan la información.
No es necesario realizar ninguna implementación visual, todo el flujo se puede realizar por Postman o por el cliente de tu preferencia.

COMENTARIOS para las pruebas

::. Productos
GETS
http://localhost:8080/api/products
http://localhost:8080/api/products?limit=2
http://localhost:8080/api/products/2
POST
http://localhost:8080/api/products
Body
  {
    "title": "Producto 6",
    "description": "6- Este es un producto de Prueba",
    "price": 678,
    "code": "abc1123",
    "stock": 234,
    "status": true,
    "category": "Ropa",
    "thunbnail": ["foto1.jpg"]
  }

PUT
http://localhost:8080/api/products/2
Body
  {
    "title": "Producto 22",
    "description": "22- Este es un producto de Prueba",
    "status": false,
    "id": 44
  }

PUT
http://localhost:8080/api/products/1

::. Carritos

GETS
http://localhost:8080/api/carts
http://localhost:8080/api/carts/1

POST
http://localhost:8080/api/carts 

http://localhost:8080/api/carts/1/product/2


## Desafio 4

Consigna

Configurar nuestro proyecto para que trabaje con Handlebars y websocket.

Aspectos a incluir

✓ Configurar el servidor para integrar el motor de plantillas Handlebars e instalar un servidor de socket.io al mismo.
✓ Crear una vista “home.handlebars” la cual contenga una lista de todos los productos agregados hasta el momento
✓ Además, crear una vista “realTimeProducts.handlebars”, la cual vivirá en el endpoint “/realtimeproducts” en nuestro views router, ésta contendrá la misma lista de productos, sin embargo, ésta trabajará con websockets.
✓ Al trabajar con websockets, cada vez que creemos un producto nuevo, o bien cada vez que eliminemos un producto, se debe actualizar automáticamente en dicha vista la lista.
✓ Ya que la conexión entre una consulta HTTP y websocket no está contemplada dentro de la clase. Se recomienda que, para la creación y eliminación de un producto, Se cree un formulario simple en la vista  realTimeProducts.handlebars. Para que el contenido se envíe desde websockets y no HTTP. Sin embargo, esta no es la mejor solución, leer el siguiente punto.
✓ Si se desea hacer la conexión de socket emits con HTTP, deberás buscar la forma de utilizar el servidor io de Sockets dentro de la petición POST. ¿Cómo utilizarás un emit dentro del POST?

COMENTARIOS PARA LAS PRUEBAS

Existen dos link al correr nodemon
HOME 
http://localhost:8080/
Listado de productos sin WebSocket

REALTIMES PRODUCTS
http://localhost:8080/realtimeproducts
Formulario de alta de producto
Listado de productos con WebSocket
Eliminar un producto con WebSocket

Probe llamar al delete desde Postman y se actualiza en el realtime
POSTMAN
http://localhost:8080/api/products/2

## Desafio Complementario

Consigna

Continuar sobre el proyecto que has trabajado para tu ecommerce y configurar los siguientes elementos:

Aspectos a incluir

✓ Agregar el modelo de persistencia de Mongo y mongoose a tu proyecto.
✓ Crear una base de datos llamada “ecommerce” dentro de tu Atlas, crear sus colecciones “carts”, “messages”, “products” y sus respectivos schemas.
✓ Separar los Managers de fileSystem de los managers de MongoDb en una sola carpeta “dao”. Dentro de dao, agregar también una carpeta “models” donde vivirán los esquemas de MongoDB. La estructura deberá ser igual a la vista en esta clase
✓ Contener todos los Managers (FileSystem y DB) en una carpeta llamada “Dao”
vReajustar los servicios con el fin de que puedan funcionar con Mongoose en lugar de FileSystem
vNO ELIMINAR FileSystem de tu proyecto.
✓ Implementar una vista nueva en handlebars llamada chat.handlebars, la cual permita implementar un chat como el visto en clase. Los mensajes deberán guardarse en una colección “messages” en mongo (no es necesario implementarlo en FileSystem). El formato es:  {user:correoDelUsuario, message: mensaje del usuario}
✓ Corroborar la integridad del proyecto para que todo funcione como lo ha hecho hasta ahora.

## Segunda Prentrega

Consigna

✓ Con base en nuestra implementación actual de productos, modificar el método GET / para que cumpla con los siguientes puntos:
Deberá poder recibir por query params un limit (opcional), una page (opcional), un sort (opcional) y un query (opcional)
-limit permitirá devolver sólo el número de elementos solicitados al momento de la petición, en caso de no recibir limit, éste será de 10.
page permitirá devolver la página que queremos buscar, en caso de no recibir page, ésta será de 1
query, el tipo de elemento que quiero buscar (es decir, qué filtro aplicar), en caso de no recibir query, realizar la búsqueda general
sort: asc/desc, para realizar ordenamiento ascendente o descendente por precio, en caso de no recibir sort, no realizar ningún ordenamiento
✓ El método GET deberá devolver un objeto con el siguiente formato:
{
	status:success/error
payload: Resultado de los productos solicitados
totalPages: Total de páginas
prevPage: Página anterior
nextPage: Página siguiente
page: Página actual
hasPrevPage: Indicador para saber si la página previa existe
hasNextPage: Indicador para saber si la página siguiente existe.
prevLink: Link directo a la página previa (null si hasPrevPage=false)
nextLink: Link directo a la página siguiente (null si hasNextPage=false)
}
✓ Se deberá poder buscar productos por categoría o por disponibilidad, y se deberá poder realizar un ordenamiento de estos productos de manera ascendente o descendente por precio.
✓ Además, agregar al router de carts los siguientes endpoints:
DELETE api/carts/:cid/products/:pid deberá eliminar del carrito el producto seleccionado.
PUT api/carts/:cid deberá actualizar el carrito con un arreglo de productos con el formato especificado arriba.
PUT api/carts/:cid/products/:pid deberá poder actualizar SÓLO la cantidad de ejemplares del producto por cualquier cantidad pasada desde req.body
DELETE api/carts/:cid deberá eliminar todos los productos del carrito 
✓ Esta vez, para el modelo de Carts, en su propiedad products, el id de cada producto generado dentro del array tiene que hacer referencia al modelo de Products. Modificar la ruta /:cid para que al traer todos los productos, los traiga completos mediante un “populate”. De esta manera almacenamos sólo el Id, pero al solicitarlo podemos desglosar los productos asociados.
✓ Crear una vista en el router de views ‘/products’ para visualizar todos los productos con su respectiva paginación. Cada producto mostrado puede resolverse de dos formas:
Llevar a una nueva vista con el producto seleccionado con su descripción completa, detalles de precio, categoría, etc. Además de un botón para agregar al carrito.
Contar con el botón de “agregar al carrito” directamente, sin necesidad de abrir una página adicional con los detalles del producto.
✓ Además, agregar una vista en ‘/carts/:cid (cartId) para visualizar un carrito específico, donde se deberán listar SOLO los productos que pertenezcan a dicho carrito. 

COMENTARIOS PARA LAS PRUEBAS

Ejecutando nodemon en el servidor se puede acceder a

- http://localhost:8080/products
Listado de productos con los botones de Ver Producto y Agregar al Carrito, con paginado.

  - **Ver Producto**
Al hacer click en el boton del producto se redirecciona a una pagina donde se puede visualizar la informacion del producto y el boton de agregar al carrito.
(Ejemplo: http://localhost:8080/product?pId=65a3f62569eff29aac06e897)
  - **Agregar al carrito**
Al hacer click en el boton, ya sea en el listad o en el detalle del producto, se agrega al carrito de la sesion del usuario (para esto guardo el id del carrito generado en el sessionStorage y luego agrego a el llamando a los endpoint del carrito con fetch)
  - **Paginado**
Por default tiene un paginado de 10 productos por pagina.
Si quisieramos modificar el paginado se debe pasar el valor por el queryparams limit o el page
*Ejemplos:*
    - Con Limit: http://localhost:8080/products?limit=4
    - Con Page: http://localhost:8080/products?limit=4&page=2
    - Con Page: http://localhost:8080/products?limit=4&page=2

- http://localhost:8080/carts/(valor del carrito)
Con esta vista se puede observar el detalle del carrito, pasando por query params el id del carrito (se puede obtener del sessionStorage desde la vista de desarrollador del navegador para prbarlo o bien buscandolo por postman llamando al endpoint http://localhost:8080/api/carts)

- http://localhost:8080/carts/(valor del carrito)

- Se pueden probar todos los endpoint solicitados desde POSTMAN para productos y carritos
*Ejemplos de los gets de Productos con sus variantes:*
  - Obtener un producto por Id: http://localhost:8080/api/products/65a3f62569eff29aac06e894
  - Con limite de cantidad de productos: http://localhost:8080/api/products?limit=2
  - Con stock disponible: http://localhost:8080/api/products?stockAvailability=true
  - Sin stock disponible: http://localhost:8080/api/products?stockAvailability=false
  - Por categoria especifica: http://localhost:8080/api/products?category=Ropa
  - Por query: http://localhost:8080/api/products?query= {"title":"Producto 9"}
  - Con ordenamiento disponible: http://localhost:8080/api/products?sort=ASC


## Implementación de login

Consigna

✓ Ajustar nuestro servidor principal para trabajar con un sistema de login.
✓ Deberá contar con todas las vistas realizadas en el hands on lab, así también como las rutas de router para procesar el registro y el login. 
✓ Una vez completado el login, realizar la redirección directamente a la vista de productos.
✓  Agregar a la vista de productos un mensaje de bienvenida con los datos del usuario
✓ Agregar un sistema de roles, de manera que si colocamos en el login como correo adminCoder@coder.com, y la contraseña adminCod3r123, el usuario de la sesión además tenga un campo 
✓ Todos los usuarios que no sean admin deberán contar con un rol “usuario”.
✓ Implementar botón de “logout” para destruir la sesión y redirigir a la vista de login

