import fs from "fs"

export class Producto{
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

export class ProductManager{
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
      return (prod)
    else
      return {}
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