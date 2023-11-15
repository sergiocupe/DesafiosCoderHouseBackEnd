class Producto{
  constructor(title,description,price,thunbnail,code,stock){
    this.title = title;
    this.description = description;
    this.price = price;
    this.thunbnail = thunbnail;
    this.code = code;
    this.stock=stock;
  }
}

class ProductManager{
  #products

  constructor(){
    this.#products = [];
  }

  addProduct(producto){
    const prod = this.#products.find(e => e.code === producto.code)
    const id = this.#products.length + 1

    //Validacion de los campos
    const validacion = !producto.title || !producto.description || !producto.price  || !producto.thunbnail || !producto.code  || !producto.stock ? false : true

    if(!prod)
        validacion ? this.#products.push({...producto, id: id}) : console.log("Faltan datos en el producto a ingresar")
    else
      console.log("Producto con código Existente existente!")
  }

  getProducts(){
    return this.#products
  }

  getProductById(id){
    
    const prod = this.#products.find(e => e.id === id)

    if (prod)
      console.log("PRODUCTO BUSCADO:" , prod)
    else
      console.log("Not Found")
  }
}

/***************************** PRUEBA DE LA CLASES *****************************/
//Instancia clase ProductManager 
const productManager = new ProductManager()

//Creamos Producto
const producto=new Producto("Remera","Remera de lino lisa",3150,"https://fakestoreapi.com/img/51eg55uWmdL._AC_UX679_.jpg","A100",50)
const producto1=new Producto("Pantalon","Pantalon de Jean Ngero",2000,"https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_.jpg","A200",34)
const producto2=new Producto("Campera","Campera de coderoy",3300,"https://fakestoreapi.com/img/71HblAHs5xL._AC_UY879_-2.jpg","A300",18)
const producto3=new Producto("Pollera","Pollera a cuadros",4029,"https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg","A400",20)
const producto4=new Producto("Campera","Campera de coderoy",3300,"https://fakestoreapi.com/img/71HblAHs5xL._AC_UY879_-2.jpg","A300",18)
const producto5=new Producto("Sombrero","Sombrero de hobre",null,"https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg","A500",10)


//Agregamos los productos a la clase ProducManager
productManager.addProduct(producto)
productManager.addProduct(producto1)
productManager.addProduct(producto2)
productManager.addProduct(producto3)
productManager.addProduct(producto4) // Devuelve en consola que producto ya existe, mismo codigo que producto2
productManager.addProduct(producto5) //Devuelve que faltan datos en el producto porque tiene el monto en null

//Llamada a los metodos de la clase ProductManager
//Muestra listado de productos llamando al metodo getProducts()
const productos=productManager.getProducts()
console.log(productos)

//Muestra el resultado de bucar un producto por id llamando al metodo getProductById()
productManager.getProductById(2)
productManager.getProductById(100) //Devuelve Not Found porque el id 100 no existe