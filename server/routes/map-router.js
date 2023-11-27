const express = require('express')
const router = express.Router()
const MapController = require('../controllers/map-controller')
const auth = require('../auth')

router.post('/map', auth.verify, MapController.createMap)
router.delete('/map/:id', auth.verify, MapController.deleteMap)
router.get('/map/:id', auth.verify, MapController.getMapById)
router.get('/mappairs', auth.verify, MapController.getMapPairs)
router.put('/map/:id', auth.verify, MapController.updateMap)
router.get('/map/:keyword', auth.verify, MapController.getMapsByKeyword)
router.get('/map/:username', auth.verify, MapController.getMapsByUser)
router.get('/maps', auth.verify, MapController.getMaps)
router.get('/allmappairs', auth.verify, MapController.getAllPublishedMapPairs)

module.exports = router