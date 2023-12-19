
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

        test('should respond with a 400 status code for invalid email format', async () => {
            const response = await request(app).post('/auth/register').send({
              firstName: 'random',
              lastName: 'name',
              email: 'invalid-email', // Invalid email format
              username: 'randomuser123',
              password: 'password123',
              passwordVerify: 'password123',
            });
            expect(response.statusCode).toBe(400);
            expect(response.body.errorMessage).toBe('Please enter a valid email address.');
          });
        
          test('should respond with a 400 status code for a short password', async () => {
            const response = await request(app).post('/auth/register').send({
              firstName: 'random',
              lastName: 'name',
              email: 'valid@gmail.com',
              username: 'randomuser123',
              password: 'short', // Password less than 8 characters
              passwordVerify: 'short',
            });
            expect(response.statusCode).toBe(400);
            expect(response.body.errorMessage).toBe('Please enter a password of at least 8 characters.');
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
                username: expect.any(String)
            }));

            // Store the authentication token for future requests
            authToken = response.headers['set-cookie'][0];
        });
    });

    describe('GET /auth/loggedIn (after logging in)', () => {
        test('should respond with the logged-in user details', async () => {
            const response = await request(app)
                .get('/auth/loggedIn')
                .set('Cookie', authToken)
    
            expect(response.statusCode).toBe(200);
            expect(response.body.loggedIn).toBe(true);
            expect(response.body.user).toEqual(expect.objectContaining({
                firstName: expect.any(String),
                lastName: expect.any(String),
                email: expect.any(String),
                username: expect.any(String)
            }));
        });
    });
});

  
describe('Map Controller Tests', () => {
    // You can create a small GeoJSON with 4 points for testing
    const geoJSON = {
        type: "FeatureCollection",
        features: [
            {
                type: "Feature",
                properties: {},
                geometry: {
                    type: "Point",
                    coordinates: [0, 0]
                }
            },
            {
                type: "Feature",
                properties: {},
                geometry: {
                    type: "Point",
                    coordinates: [1, 1]
                }
            },
            {
                type: "Feature",
                properties: {},
                geometry: {
                    type: "Point",
                    coordinates: [2, 2]
                }
            },
            {
                type: "Feature",
                properties: {},
                geometry: {
                    type: "Point",
                    coordinates: [3, 3]
                }
            }
        ]
    };

    // Use the map controller functions to create, update, and delete maps
    let mapId;
    let authToken
    it('should create a map', async () => {
        const userCredentials = {
            email: 'random@gmail.com',
            password: 'password123'
        };

        // Assuming there is a user in the database with the provided credentials
        const response1 = await request(app)
            .post('/auth/login')
            .send(userCredentials);

        expect(response1.statusCode).toBe(200);
        expect(response1.body.success).toBe(true);
        expect(response1.body.user).toEqual(expect.objectContaining({
            firstName: expect.any(String),
            lastName: expect.any(String),
            email: expect.any(String),
            username: expect.any(String)
        }));

        // Store the authentication token for future requests
        authToken = response1.headers['set-cookie'][0];

        const response = await request(app)
            .post('/api/map')
            .set('Cookie', authToken)
            .send({
                title: 'Test Map',
                ownerEmail: 'random@gmail.com',
                username: 'randomuser123',
                description: 'This is a test map',
                mapType: 'choroplethMap',
                jsonData: geoJSON,
                mapLayers: null,
                likes: 0,
                views: 0,
                comments: [],
                published: false,
                publishedDate: new Date(),
                updatedAt: new Date()
            });

        expect(response.statusCode).toBe(201);
        expect(response.body.map).toHaveProperty('_id');
        mapId = response.body.map._id;
    });

    it('should update a map', async () => {
        const response = await request(app)
            .put(`/api/map/${mapId}`)
            .set('Cookie', authToken)
            .send({
                map: {
                    title: 'Updated Test Map',
                    ownerEmail: 'random@gmail.com',
                    username: 'randomuser123',
                    description: 'This map has been updated',
                    mapType: 'choroplethMap',
                    jsonData: geoJSON,
                    mapLayers: null,
                    likes: 0,
                    views: 0,
                    comments: [],
                    published: false,
                    publishedDate: new Date(),
                    updatedAt: new Date()
                }
            });

        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.id).toBe(mapId);
    });

    it('should get a map by ID', async () => {
        const response = await request(app)
            .get(`/api/map/${mapId}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.map).toHaveProperty('_id', mapId);
    });

    it('should delete a map', async () => {
        const response = await request(app)
            .delete(`/api/map/${mapId}`)
            .set('Cookie', authToken);

        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);
    });
});