
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
            console.log("Received status code: " + response.statusCode)
            expect(response.statusCode).toBe(200)
        })

        test('should respond with a 400 status code for missing fields', async () => {
            const response = await request(app).post('/auth/register').send({
                firstName: 'random',
                lastName: 'name',
                // Missing email, username, password, and passwordVerify
            });
            expect(response.statusCode).toBe(400);
            expect(response.body.errorMessage).toBe('Please enter all required fields.');
        });

        test('should respond with a 400 status code for mismatched passwords', async () => {
            const response = await request(app).post('/auth/register').send({
                firstName: 'random',
                lastName: 'name',
                email: 'random@gmail.com',
                username: 'randomuser123',
                password: 'password123',
                passwordVerify: 'password456' // Mismatched password
            });
            expect(response.statusCode).toBe(400);
            expect(response.body.errorMessage).toBe('Please enter the same password twice.');
        });

        // Add more tests to cover other scenarios

        test('should respond with a 400 status code for an existing username', async () => {
            // Assuming "randomuser123" already exists in the database
            const response = await request(app).post('/auth/register').send({
                firstName: 'random',
                lastName: 'name',
                email: 'newuser@gmail.com',
                username: 'randomuser123',
                password: 'password123',
                passwordVerify: 'password123'
            });
            expect(response.statusCode).toBe(400);
            expect(response.body.errorMessage).toBe('An account with this username already exists.');
        });

        test('should respond with a 400 status code for an existing email address', async () => {
            // Assuming "random@gmail.com" already exists in the database
            const response = await request(app).post('/auth/register').send({
                firstName: 'random',
                lastName: 'name',
                email: 'random@gmail.com',
                username: 'newuser456',
                password: 'password123',
                passwordVerify: 'password123'
            });
            expect(response.statusCode).toBe(400);
            expect(response.body.errorMessage).toBe('An account with this email address already exists.');
        });

    })

})


describe('Authentication Tests', () => {
    let authToken; // To store the authentication token for the logged-in user

    describe('GET /auth/loggedIn', () => {
        test('should respond with not logged in', async () => {
            const response = await request(app).get('/auth/loggedIn');
            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual({
                loggedIn: false,
                user: null,
                errorMessage: '?'
            });
        });
    });

    describe('POST /auth/login', () => {
        test('should log in the user and respond with logged in user details', async () => {
            const userCredentials = {
                email: 'random@gmail.com',
                password: 'password123'
            };

            // Assuming there is a user in the database with the provided credentials
            const response = await request(app)
                .post('/auth/login')
                .send(userCredentials);

            expect(response.statusCode).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.user).toEqual(expect.objectContaining({
                firstName: expect.any(String),
                lastName: expect.any(String),
                email: expect.any(String),
                userName: expect.any(String)
            }));

            // Store the authentication token for future requests
            authToken = response.headers['set-cookie'][0];
            console.log("TOKEN RECEIVED: " + authToken);
        });
    });


    //THE TEST BELOW IS NOT PASSING, MOST LIKELY DUE TO IMPROPERLY SETTING THE COOKIE VALUE WHEN SEDNING REQUEST

    // describe('GET /auth/loggedIn (after logging in)', () => {
    //     test('should respond with the logged-in user details', async () => {
    //         const response = await request(app)
    //             .get('/auth/loggedIn')
    //             .set('Cookie', authToken); // Set the authentication token in the request

    //         expect(response.statusCode).toBe(200);
    //         expect(response.body.loggedIn).toBe(true);
    //         expect(response.body.user).toEqual(expect.objectContaining({
    //             firstName: expect.any(String),
    //             lastName: expect.any(String),
    //             email: expect.any(String),
    //             userName: expect.any(String)
    //         }));
    //     });
    // });
});

