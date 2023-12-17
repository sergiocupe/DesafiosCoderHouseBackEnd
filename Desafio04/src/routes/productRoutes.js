import { Router } from "express";
import { ProductManager } from "../clases/Producto.js";

const productRoutes = Router();
const path="./src/json/productos.json"

productRoutes.get("/", async (req, res) => {
  const { limit } = req.query;
  const products = new ProductManager(path);
  let resultado = await products.getProducts();
  //Si no tiene limite, devuelve todos los productos
  if (!limit) 
    return res.send(resultado);
  const productsLimit = resultado.slice(0, limit);
  res.send(productsLimit);
});

productRoutes.get("/:pId", async (req, res) => {
  const { pId } = req.params;
  const products = new ProductManager(path);
  const resultado = await products.getProductById(+pId);
  res.send(resultado);
});

productRoutes.post("/", async (req, res) => {
  const product = req.body;
  const products = new ProductManager(path);
  const resultado = await products.addProduct(product);
  res.send({ message: resultado });
});

productRoutes.put("/:pId", async (req, res) => {
  const { pId } = req.params;
  const product = req.body;
  const products = new ProductManager(path);
  const resultado = await products.updateProduct(+pId,product);
  res.send({ message: resultado });
});

productRoutes.delete("/:pId", async (req, res) => {
  const { pId } = req.params;
  const products = new ProductManager(path);
  const resultado = await products.deleteProduct(+pId);
  res.send({ message: resultado });
})

export default productRoutes;
