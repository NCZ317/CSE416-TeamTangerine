const express = require('express')
const router = express.Router()
const AuthController = require('../controllers/auth-controller')

router.post('/register', AuthController.registerUser)

router.get('/user/:email', AuthController.getRegisteredUser)

module.exports = router