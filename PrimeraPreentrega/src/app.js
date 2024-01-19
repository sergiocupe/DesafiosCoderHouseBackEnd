import express from "express";
import productRoutes from "./routes/productRoutes.js";
import cartsRoutes from "./routes/cartsRoutes.js";

const PORT = 8080;
const app = express();

app.use(express.json())
app.use(express.urlencoded({ extended: true}))

app.use('/api/products', productRoutes)
app.use('/api/carts', cartsRoutes)

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
