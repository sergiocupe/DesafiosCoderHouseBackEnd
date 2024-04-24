import {Faker, es, en} from '@faker-js/faker' 

const faker = new Faker({
  locale: [es, en]
})

export const getProducts = async (req, res) => {
  try {    
    const products = []
    for(let i=0 ; i <100;  i++){
        products.push(generateProduct())
    }
    return res.status(200).send({satus: 'success', payload: products})
  } 
  catch (err) {
    res.status(400).send({message: err})
  }
}

export const generateProduct = () => {
  const id=faker.database.mongodbObjectId()
  return  {
    "_id": id,
    "title": faker.commerce.productName(),
    "description": faker.lorem.paragraph(),
    "price": faker.commerce.price(),
    "code": faker.string.alphanumeric({length: 10}).toUpperCase(),
    "stock": faker.commerce.stock,
    "status": faker.datatype.boolean(),
    "category": faker.commerce.department(),
    //"thunbnail": [faker.image.url()],
    "id": id
  }
}