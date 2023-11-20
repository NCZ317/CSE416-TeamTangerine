const express = require('express')
const router = express.Router()
const AuthController = require('../controllers/auth-controller')

router.post('/register', AuthController.registerUser)
router.post('/login', AuthController.loginUser)
router.get('/logout', AuthController.logoutUser)
router.get('/loggedIn', AuthController.getLoggedIn)
router.post('/editProfile', AuthController.editUser)
router.post('/changePassword', AuthController.changeUserPassword)
router.post('/sendEmail', AuthController.sendEmail)
module.exports = router