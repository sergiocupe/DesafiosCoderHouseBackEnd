import express from "express"
import { ProductManager } from "../clases/Producto.js";

const viewRoutes = express.Router()
const path="./src/json/productos.json"
const productManager = new ProductManager(path);


viewRoutes.get("/", async (req, res) => {
  let products = []

  const url = `http://localhost:8080/api/products?limit=100`
  const requestOptions = {
    method: "GET",
  }

  await fetch(url, requestOptions)
    .then((response) => {
      if (!response.ok) {
        throw new Error("No se pudo cargar los productos")
      }
      return response.json()
    })
    .then((data) => {
      products = data;
    })
    .catch((error) => {
      console.error(error)
    })

  res.render("home", { title: "Home", data: products })
})

viewRoutes.get("/realtimeproducts", async (req, res) => {
  const productos = await productManager.getProducts();
  res.render("realtimeproducts", { title: "RealTime Products", data: productos })
})

export default viewRoutes
