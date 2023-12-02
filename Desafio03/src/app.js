import express from 'express'
import {ProductManager} from './Clases.js'

const PORT=8080
const app = express()

app.get('/products',async (req,res) => {
  const {limit} = req.query

  const products = new ProductManager('./productos.json')
  let resultado=await products.getProducts()

  console.log(limit)
  //Si no tiene limite, devuelve todos los productos
  if (!limit)
    return res.send(resultado)

  let productsLimit=[]
  for(let i=0;i<+limit;i++)
  {
    if (i<=resultado.length) //Controlo por si limit supera la cantidad entonces no hago push de null
    productsLimit.push(resultado[i])
  }
  resultado=productsLimit

  res.send(resultado)
})

app.get('/products/:pId',async (req,res) => {
  const {pId}=req.params
  const products = new ProductManager('./productos.json')
  const resultado=await products.getProductById(+pId)
  res.send(resultado)
})

app.listen(PORT,()=>{
  console.log(`listening on port ${PORT}`)
}) 