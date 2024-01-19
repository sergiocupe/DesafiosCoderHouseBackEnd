import { Router } from "express";
import { CartManager } from "../clases/Cart.js";

const cartRoutes = Router();
const path="./src/json/carritos.json"

cartRoutes.get("/", async (req, res) => {
  const carts = new CartManager(path);
  const resultado = await carts.getCarts();
  res.send(resultado);
});

cartRoutes.get("/:cId", async (req, res) => {
  const {cId}=req.params;
  const carts = new CartManager(path);
  const resultado = await carts.getProductsCartById(+cId);
  res.send(resultado);
});

cartRoutes.post("/", async (req, res) => {
  const carts = new CartManager(path);
  const resultado = await carts.addCart();
  res.send({ message: resultado });
})

cartRoutes.post("/:cId/product/:pId", async (req, res) => {
  const {cId, pId} = req.params
  const carts = new CartManager(path);
  const resultado = await carts.addProductsInCart(cId,pId,1);
  res.send({ message: resultado});
})

export default cartRoutes;