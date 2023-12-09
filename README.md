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
