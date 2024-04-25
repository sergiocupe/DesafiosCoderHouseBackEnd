import chai from "chai"
import supertest from "supertest"

const expect = chai.expect
const requester = supertest("http://localhost:8080")

describe("Testing BackEnd Ecommerce", () => {

  describe("Test de endpoint sessions", () => {

    it("Debe registrar correctamente un usuario", async () => {      
      const mockUser = {
        first_name: "Susana",
        last_name: "Gomez",
        email: "susanagomez@gmail.com",
        password: "12345",
        rol: "Usuario",
      };
      const { statusCode, _body } = await requester
        .post("/api/session/register")
        .send(mockUser);

      expect(statusCode).to.be.equal(200)  
    })

    
    it("Debe loguear correctamente al usuario y devolver una cookie", async () => {
      const mockUser = {
        email: "susanagomez@gmail.com",
        password: "12345",
      }

      const { headers } = await requester
        .post("/api/session/login")
        .send(mockUser)

      const cookieResult = headers["set-cookie"][0]
      expect(cookieResult).to.be.ok
      const cookie = {
        name: cookieResult.split("=")[0],
        value: cookieResult.split("=")[1],
      }
    
      expect(cookie.name).to.be.ok.and.equal("connect.sid")
      expect(cookie.value).to.be.ok
    });

    it("Debe loguear correctamente, devolver la informacion del usuario y desestructurarla correctamente", async () => {
      
      const mockUser = {
        first_name: "Susana",
        last_name: "Gomez",
        email: "susanagomez@gmail.com",
        password: "12345",
        rol: "Usuario",
      }

      await requester
        .post("/api/session/login")
        .send(mockUser);

      const { statusCode, _body } = await requester.get("/api/session/current")

      console.log(_body);
      expect(statusCode).to.be.equal(200);

    });
  })
})