const express = require('express')
const router = express.Router()
const MapController = require('../controllers/map-controller')
const auth = require('../auth')

router.post('/map', auth.verify, MapController.createMap)
router.delete('/map/:id', auth.verify, MapController.deleteMap)
router.get('/map/:id', MapController.getMapById)
router.get('/mappairs', auth.verify, MapController.getMapPairs)
router.put('/map/:id', auth.verify, MapController.updateMap)
router.get('/map/:keyword', MapController.getMapsByKeyword)
router.get('/map/:username', MapController.getMapsByUser)
router.get('/maps', MapController.getMaps)
router.get('/allmappairs', MapController.getAllPublishedMapPairs)

module.exports = router