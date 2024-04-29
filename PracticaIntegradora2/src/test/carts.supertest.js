import chai from "chai"
import supertest from "supertest"

const expect = chai.expect
const requester = supertest("http://localhost:8080")

describe("Testing BackEnd Ecommerce", () => {

  let sessionCookie // Variable para almacenar la cookie de sesión

  // Hook "before" para realizar el inicio de sesión antes de ejecutar las pruebas
  before(async () => {
    // Realiza una solicitud de inicio de sesión para obtener la cookie de sesión
    const loginResponse = await requester
      .post('/api/session/login')
      .send({
        email: 'luciano@gmail.com',
        password: '1234'
      })

    // Verifica que la solicitud de inicio de sesión haya sido exitosa
    expect(loginResponse.status).to.equal(302)

    // Extrae la cookie de sesión de la respuesta de inicio de sesión y almacénala en sessionCookie
    sessionCookie = loginResponse.headers['set-cookie'].map(cookie => cookie.split(';')[0]).join(';');
  })

  describe("Test de endpoint del carrito", () => {

    it("El endpoint POST /api/carts debe crear un carrito vacio correctamente", async () => {
      const cartMock = {
        product: []
      }

      const { statusCode, _body } = await requester
        .post("/api/carts")
        .set('Cookie', sessionCookie)
        .send(cartMock)

      expect(statusCode).to.be.eql(200)
      expect(_body.rdo).to.exist
    })

    it("Al obtener los carritos con el método GET, la respuesta debe tener los campos status y rdo. Además, rdo debe ser de tipo arreglo", async () => {

      const { statusCode, _body } = await requester
        .get("/api/carts")

      expect(statusCode).to.be.equal(200)
      expect(_body.message).to.be.equal("OK")
      expect(_body.rdo).to.be.an("array")
    })


    it("Al obtener un carrito por un Id especifico", async () => {
      const { statusCode, _body } = await requester
        .get("/api/carts")
      expect(statusCode).to.be.equal(200)

      const id = _body.rdo[0]._id

      const { statusCode: statusCode1, body: _body1 } = await requester
        .get(`/api/carts/${id}`)

      expect(statusCode1).to.be.equal(200)
      expect(_body1).to.be.exist
    })


    it("El endpoint POST /api/carts/:cId/products/:pId debe agregar un producto a un carrito determinado con el usuario autorizado", async () => {
      const mockCartQuantity = { quantity: 1 }

      const { statusCode, _body } = await requester
        .get("/api/carts")
      expect(statusCode).to.be.equal(200)

      const idCart = _body.rdo[0]._id

      const { statusCode: statusCode1, _body: listProducts } = await requester.get("/api/products?limit=5000")

      expect(statusCode1).to.be.eql(200)

      const idProd = listProducts.rdo.payload.find((p) => p.owner != "660b24a0bd3b28e71909c81a").id

      const { statusCode: statusCode2, _body: _body2 } = await requester
        .post(`/api/carts/${idCart}/products/${idProd}`)
        .set('Cookie', sessionCookie)
        .send(mockCartQuantity)

      expect(statusCode2).to.be.eql(200)
      expect(_body.rdo).to.exist
    })


    it("El endpoint POST /api/carts/:cId/products/:pId debe agregar un producto a un carrito determinado con el usuario NO autorizado", async () => {
      const mockCartQuantity = { quantity: 1 }

      const { statusCode, _body } = await requester
        .get("/api/carts")
      expect(statusCode).to.be.equal(200)

      const idCart = _body.rdo[0]._id

      const { statusCode: statusCode1, _body: listProducts } = await requester.get("/api/products?limit=5000")

      expect(statusCode1).to.be.eql(200)

      const idProd = listProducts.rdo.payload.find((p) => p.owner === "660b24a0bd3b28e71909c81a").id

      const { statusCode: statusCode2, _body: _body2 } = await requester
        .post(`/api/carts/${idCart}/products/${idProd}`)
        .set('Cookie', sessionCookie)
        .send(mockCartQuantity)

      expect(statusCode2).to.be.eql(403)
      expect(_body.rdo).to.exist
    })

    it("El método DELETE debe poder borrar un carrito de la base", async () => {

      const cartMock = {
        product: []
      }

      const { statusCode, _body } = await requester
        .post("/api/carts")
        .set('Cookie', sessionCookie)
        .send(cartMock)

      expect(statusCode).to.be.eql(200)
      expect(_body.rdo).to.exist

      const cId = _body.rdo

      await requester
        .delete(`/api/carts/${cId}`)
        .set('Cookie', sessionCookie)

      const { _body: _body1 } = await requester.get(`/api/carts/${cId}`)

      expect(_body1.rdo).to.be.an("array")
      expect(_body1.rdo).to.be.an("array").that.is.empty;
    })

  })
})