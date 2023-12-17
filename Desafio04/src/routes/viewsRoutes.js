import express from "express";

const viewRoutes = express.Router();

viewRoutes.get('/', (req,res) =>{
  res.render('home', {title: 'Home'})
 })

 viewRoutes.get('/realtimeproducts', (req,res) =>{
  res.render('realtimeproducts', {title: 'RealTime Products'})
 })

 export default viewRoutes