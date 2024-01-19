const fs = require("fs");

class Producto{
  constructor(title, description,price,thunbnail,code,stock)
  {
    this.title=title
    this.description=description
    this.price=price
    this.thunbnail=thunbnail
    this.code=code
    this.stock=stock
  }
}

class ProductManager{
  #products

  constructor(path){
    this.path = path;
    this.#products = [];
  }

  async addProduct(producto){ 
    try {

    //Validacion de los campos
    const validacion = !producto.title || !producto.description || !producto.price  || !producto.thunbnail || !producto.code  || !producto.stock ? false : true

    if (!validacion)
      return console.log("Faltan datos en el producto a ingresar")

    this.#products = await this.getProducts()
    const prod = this.#products.find(e => e.code === producto.code)

    if(prod)
      return console.log("Producto con código Existente existente!")

    const id = this.#products.length + 1
    this.#products.push({...producto, id: id})
    await fs.promises.writeFile(this.path,JSON.stringify(this.#products), "utf-8")

    }
    catch (e) {
        console.error("Error al momento de agregar el producto")
    }
  }

  async getProducts(){
    try{
      const productos = await fs.promises.readFile(this.path,"utf-8");
      const parseProductos = JSON.parse(productos);
      return parseProductos
    }
    catch (e) {
      console.log("No hay datos");
      return []
    }
  }

 async getProductById(id){
    this.#products = await this.getProducts()
    const prod = this.#products.find(e => e.id === id)

    if (prod)
      console.log("PRODUCTO BUSCADO:" , prod)
    else
      console.log("Not Found")
  }

  async updateProduc(id, newProduct){
    this.#products = await this.getProducts()
    const index = this.#products.findIndex(e => e.id === id)
    // Verifica si se encontró un producto con el id
    if (index !== -1) {
      // Reemplaza el producto en el array productos
      this.#products[index] = {...newProduct, id: id};
      await fs.promises.writeFile(this.path,JSON.stringify(this.#products), "utf-8")
      console.log(`Producto con ID ${id} actualizado exitosamente.`);
    } 
    else 
      console.log(`No se encontró un producto con el ID ${id}. No se realizó ninguna actualización.`);
  }

  async deleteProduct(id){
    this.#products = await this.getProducts()
    const index = this.#products.findIndex(e => e.id === id)
    if (index !== -1) {
      this.#products.splice(index,1)
      await fs.promises.writeFile(this.path,JSON.stringify(this.#products), "utf-8")
      console.log(`Producto con ID ${id} eliminado exitosamente.`);
    } 
    else 
      console.log(`No se encontró un producto con el ID ${id}. No se pudo eliminar.`);
  }
}

/***************************** MIS  PRUEBA DE LA CLASES *****************************/

//Instancia clase ProductManager 
const test = async () => {
  const productManager = new ProductManager('./productos.json')
  let data = await productManager.getProducts();
  console.log(data)

  const producto1 = new Producto("Producto 1 Prueba","Este es un producto de Prueba",200,"Sin imagen","abc123",25)
  await productManager.addProduct(producto1)

  data = await productManager.getProducts();
  console.log(data)
 
  const producto2 = new Producto("Producto 2 Prueba","Este es un producto de Prueba",200,"Sin imagen","abc1231",25)
  productManager.addProduct(producto2)

  data = await productManager.getProducts();
  console.log(data)
 
  const producto3 = new Producto("Producto 3 Prueba","Este es un producto de Prueba",200,"Sin imagen","abc123",25)
  productManager.addProduct(producto3)

  const producto4 = new Producto("Producto 4 Prueba","Este es un producto actualizado",123,"Sin imagen","abc123",100)
  await productManager.updateProduc(1,producto4);

  data = await productManager.getProducts();
  console.log(data)

  await productManager.deleteProduct(1)
  data = await productManager.getProducts();
  console.log(data)
  
  //Muestra el resultado de bucar un producto por id llamando al metodo getProductById()
   await productManager.getProductById(2)

  //Devuelve Not Found porque el id 100 no existe
  await productManager.getProductById(100) 
}

test()

/***************************** FIN MIS PRUEBA DE LA CLASES *****************************/
