import ProductModel from "../models/products.model.js"

export class Producto {
  constructor(title, description, price, code, stock, status, category, thunbnail) {
    this.title = title;
    this.description = description;
    this.price = price;
    this.code = code;
    this.stock = stock;
    this.status = status;
    this.category = category;
    this.thunbnail = thunbnail;
  }
}

export class ProductMongoManager {
  async getProducts(limit=10, page=1, priceOrder="", query="", category="", stockAvailability="true" ) {
    try {
      //si viene query lo paso para el search, deb eser en formato {prop:valor,......}
      const parsedQuery = query==="" ? {} : JSON.parse(query)
      let search = parsedQuery instanceof Object ? parsedQuery : {}

      //filtro por la categoria 
      if (category) 
        search = { ...search, category: category }

      //filtro por aquellos que tienen stock disponible o no (debe llegar por query el stockAvailability = a true o false) 
      search = stockAvailability==="true" ? { ...search, stock: { $gt: 0 } } : { ...search, stock: 0 };

      const sort = {};
      if (priceOrder)
      {
          if (priceOrder.toUpperCase() === 'ASC')
            sort.price = 1
          else
            sort.price = -1
      }

      if (limit <= 0) 
        limit = 10;

      const parseProductos = await ProductModel.paginate(search, {
          page: page,
          limit: limit,
          lean: true,
          sort: sort
      })

      let status = "success";
      
      const response = {
        status: status,
        payload: parseProductos.docs,
        totalPages: parseProductos.totalPages,
        prevPage: parseProductos.prevPage,
        nextPage: parseProductos.nextPage,
        page: parseProductos.page,
        hasPrevPage: parseProductos.hasPrevPage,
        hasNextPage: parseProductos.hasNextPage,
        prevLink: parseProductos.hasPrevPage ? `/products?page=${parseProductos.prevPage}&limit=${limit}` : null,
        nextLink: parseProductos.hasNextPage ? `/products?page=${parseProductos.nextPage}&limit=${limit}` : null,
        totalDocs: parseProductos.totalDocs, //Agregado para ver la cantidad de productos preguntar si eliminar o no
        limit: parseProductos.limit //Agregado para saber el límite actual
    };

      return {message: "OK" , rdo: response}
    } catch (e) {
      return {message: "ERROR" , rdo: "Error al recuperar los productos - " + e.message}
   }
  }

  async getProductById(id) {
    try
    {
      const prod=await ProductModel.findOne({_id: id}).lean()
      if (prod) 
        return {message: "OK" , rdo: prod}
      else 
        return {message: "ERROR" , rdo: "El productos no existe"}
    } 
    catch (e) {
      return {message: "ERROR" , rdo: "Error al obtener el producto - " + e.message}
   }
  }

  async addProduct(producto) {
    try {
      let prod = []
      //Validacion de los campos
      const validacion = !producto.title || !producto.description || !producto.price || !producto.code || !producto.stock || !producto.status || !producto.category ? false : true;

      if (!validacion)
        return {message: "ERROR" , rdo: "Faltan datos en el producto a ingresar!"}

      const resultado = await this.getProducts();
      console.log(resultado)
      if (resultado.message === "OK")
        prod = resultado.rdo.payload.find((e) => e.code === producto.code);
      else
        return {message: "ERROR" , rdo: "No se pudieron obtener los productos"}

      if (prod)
        return {message: "ERROR" , rdo: "Producto con código Existente existente!"}
      const added = await ProductModel.create(producto)  
      return {message: "OK" , rdo: "Producto dado de alta correctamente"}
    } 
    catch (e) {
      return {message: "ERROR" , rdo: "Error al agregar el producto - " + e.message}
    }
  }

  async updateProduct(id, updateProduct) {
    try {
      const update = await ProductModel.updateOne({_id: id}, updateProduct)

      if (update.modifiedCount>0)
        return {message: "OK" , rdo: `Producto con ID ${id} actualizado exitosamente.`}
      return {message: "ERROR" , rdo: `No se encontró un producto con el ID ${id}. No se pudo actualizar.`}
    } 
    catch (e) {
      return {message: "ERROR" , rdo: "Error al momento de actualizar el producto - "+ e.message}
    }
  }

  async deleteProduct(id) {
    try {
      const deleted = await ProductModel.deleteOne({_id: id})

      if (deleted.deletedCount === 0){
        return {message: "ERROR" , rdo: `No se encontró un producto con el ID ${id}. No se pudo eliminar.`}
      }

      return {message: "OK" , rdo: `Producto con ID ${id} eliminado exitosamente.`}
    } 
    catch (e) {
      return {message: "ERROR" , rdo: "Error al momento de eliminar el producto - "+ e.message}
    }
  }
}
