class ProductManager{
  #products

  constructor(){
    this.#products = [];
  }

  addProduct(title, description,price,thunbnail,code,stock){ this
    const prod = this.#products.find(e => e.code === code)
    const id = this.#products.length + 1

    //Validacion de los campos
    const validacion = !title || !description || !price  || !thunbnail || !code  || !stock ? false : true

    if(!prod)
        validacion ? this.#products.push({title, description,price,thunbnail,code,stock, id: id}) : console.log("Faltan datos en el producto a ingresar")
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

/***************************** 1- MIS  PRUEBA DE LA CLASES *****************************/

/*
//Instancia clase ProductManager 
const productManager = new ProductManager()

//Agregamos los productos a la clase ProducManager
productManager.addProduct("Remera","Remera de lino lisa",3150,"https://fakestoreapi.com/img/51eg55uWmdL._AC_UX679_.jpg","A100",50)
productManager.addProduct("Pantalon","Pantalon de Jean Ngero",2000,"https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_.jpg","A200",34)
productManager.addProduct("Campera","Campera de coderoy",3300,"https://fakestoreapi.com/img/71HblAHs5xL._AC_UY879_-2.jpg","A300",18)
productManager.addProduct("Pollera","Pollera a cuadros",4029,"https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg","A400",20)
// Devuelve en consola que producto ya existe, mismo codigo que producto2
productManager.addProduct("Campera","Campera de coderoy",3300,"https://fakestoreapi.com/img/71HblAHs5xL._AC_UY879_-2.jpg","A300",18) 
//Devuelve que faltan datos en el producto porque tiene el monto en null
productManager.addProduct("Sombrero","Sombrero de hobre",null,"https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg","A500",10) 

//Llamada a los metodos de la clase ProductManager
//Muestra listado de productos llamando al metodo getProducts()
const productos=productManager.getProducts()
console.log(productos)

//Muestra el resultado de bucar un producto por id llamando al metodo getProductById()
productManager.getProductById(2)

//Devuelve Not Found porque el id 100 no existe
productManager.getProductById(100) 
*/

/***************************** FIN DE MIS  PRUEBA DE LA CLASES *****************************/


/*****************************  2- PRUEBA INDICADAS POR EL TUTOR *****************************/
//Instancia clase ProductManager 
const productManager = new ProductManager()

console.log(productManager.getProducts())

productManager.addProduct("Producto Prueba","Este es un producto de Prueba",200,"Sin imagen","abc123",25)

console.log(productManager.getProducts())

productManager.addProduct("Producto Prueba","Este es un producto de Prueba",200,"Sin imagen","abc123",25)

//Muestra el resultado de bucar un producto por id llamando al metodo getProductById()
productManager.getProductById(1)

//Devuelve Not Found porque el id 100 no existe
productManager.getProductById(100) 

/***************************** FIN PRUEBA INDICADAS POR EL TUTOR *****************************/
