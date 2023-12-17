import express from "express"

const viewRoutes = express.Router()

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

viewRoutes.get("/realtimeproducts", (req, res) => {
  res.render("realtimeproducts", { title: "RealTime Products" })
})

export default viewRoutes
