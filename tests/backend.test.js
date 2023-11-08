
const request = require('supertest')
const app = require('../server/index')

describe("POST /auth/register", () => {

    describe("given a first name, last name, email, username, password, and confirmPassword", ()=> {

        test("should respond with a 200 status code", async () => {
            const response = await request(app).post("/auth/register").send({
                firstName : "random",
                lastName : "name",
                email : "random@gmail.com",
                username: "randomuser123",
                password : "password123",
                passwordVerify : "password123"
            })
            expect(response.statusCode).toBe(200)
        })

    })

})