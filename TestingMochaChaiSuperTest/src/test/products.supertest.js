import chai from "chai"
import supertest from "supertest"

const expect = chai.expect
const requester = supertest("http://localhost:8080")

describe("Testing BackEnd Ecommerce", () => {

  let sessionCookie; // Variable para almacenar la cookie de sesión

  // Hook "before" para realizar el inicio de sesión antes de ejecutar las pruebas
  before(async () => {
    // Realiza una solicitud de inicio de sesión para obtener la cookie de sesión
    const loginResponse = await requester
      .post('/api/session/login')
      .send({
        email: 'luciano@gmail.com',
        password: '1234'
      });

    // Verifica que la solicitud de inicio de sesión haya sido exitosa
    expect(loginResponse.status).to.equal(302);

    // Extrae la cookie de sesión de la respuesta de inicio de sesión y almacénala en sessionCookie
    sessionCookie = loginResponse.headers['set-cookie'].map(cookie => cookie.split(';')[0]).join(';');

    //elimina el producto para el test de post
    const { _body: listProducts } = await requester.get("/api/products?limit=5000")
    let product = listProducts.rdo.payload.find((p) => p.code === "ACF9090")
    let id = product && product.id
    if (id) {
      await requester.delete(`/api/products/${id}`).set('Cookie', sessionCookie) 
    }
    
    //elimina el producto para el test de update
    product = listProducts.rdo.payload.find((p) => p.code === "AAA0001")
    id = product && product.id
    if (id) {
      await requester.delete(`/api/products/${id}`).set('Cookie', sessionCookie) 
    }
  });

  describe("Test de endpoint de productos", () => {
   
   it("El endpoint POST /api/products debe crear un producto correctamente", async () => {
      const productMock = {
        title: "Pantalon Joggins",
        description: "Pantalon Joggins de color azul",
        price: 500,
        code: "ACF9090",
        stock: 200,
        status: true,
        category: "Ropa",
        thunbnail: "",
        owner: "Premium"
      }

      const { statusCode, _body } = await requester
        .post("/api/products")  
        .set('Cookie', sessionCookie) 
        .send(productMock)

      expect(statusCode).to.be.eql(200);
    })

   it("Si se desea crear un producto con el campo category que no sea de los Enum, debe responder con un status 404", async () => {
      const productMock = {
        title: "Pantalon Joggins",
        description: "Pantalon Joggins de color azul",
        price: 500,
        code: "ABP9863",
        stock: 200,
        status: true,
        category: "Pantalon",
        thunbnail: "",
        owner: "Premium"
      }

      const { statusCode } = await requester
        .post("/api/products")  
        .set('Cookie', sessionCookie) 
        .send(productMock)
      expect(statusCode).to.be.equal(404);
    })

    it("Al obtener los productos con el método GET, la respuesta debe tener los campos status y payload. Además, payload debe ser de tipo arreglo", async () => {

      const { statusCode, _body } = await requester
        .get("/api/products");
      expect(statusCode).to.be.equal(200);
      expect(_body.message).to.be.equal("OK");
      expect(_body.rdo.payload).to.be.an("array");
      expect(_body.rdo.status).to.be.equal("success");
    })

    it("El método PUT debe poder actualizar correctamente un producto determinado", async () => {
      const productMock = {
        title: "Perfume de 50ml",
        description: "Perfume de mujer floral",
        price: 2500,
        code: "AAA0001",
        stock: 50,
        status: true,
        category: "Perfume",
        thunbnail: "",
        owner: "660b24a0bd3b28e71909c81a"
      };

      const { statusCode, _body } = await requester
        .post("/api/products")  
        .set('Cookie', sessionCookie) 
        .send(productMock)

      expect(statusCode).to.be.eql(200);

      const { _body: listProducts } = await requester.get("/api/products?limit=5000");

      const product = listProducts.rdo.payload.find((p) => p.code === "AAA0001");;
      const id = product.id

      const modifiedProduct = {
        title: "Perfume de 100ml",
        price: 4000,
        stock: 200,
      };

      await requester
        .put(`/api/products/${id}`)
        .set('Cookie', sessionCookie) 
        .send(modifiedProduct);

      const { _body: updatedProducts } = await requester.get("/api/products?limit=5000");
        
      const products = updatedProducts.rdo.payload;
      const updatedProduct = products.find((p) => p._id === id);

      expect(updatedProduct.title).to.be.equal(modifiedProduct.title);
      expect(updatedProduct.price).to.be.equal(modifiedProduct.price);
    });

    
    it("El método DELETE debe poder borrar un producto de la base", async () => {
      const productMock = {
        title: "Remera Azul",
        description: "Remera escote en V de hombre",
        price: 98334,
        code: "BBB0001",
        stock: 50,
        status: true,
        category: "Ropa",
        thunbnail: "",
        owner: "660b24a0bd3b28e71909c81a"
      };

      const { statusCode, _body } = await requester
        .post("/api/products")  
        .set('Cookie', sessionCookie) 
        .send(productMock)

      expect(statusCode).to.be.eql(200);

      const { _body: listProducts } = await requester.get("/api/products?limit=5000");

      const product = listProducts.rdo.payload.find((p) => p.code === "BBB0001");;
      const id = product.id

      await requester
      .delete(`/api/products/${id}`)
      .set('Cookie', sessionCookie) 

      const { _body: listProducts1 } = await requester.get("/api/products?limit=5000");
      const products = listProducts1.rdo.payload;
      const deleteProduct = products.find((p) => p._id === id);
      expect(deleteProduct).to.not.exist;
    })
  })
 })