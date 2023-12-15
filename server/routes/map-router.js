const express = require('express')
const router = express.Router()
const MapController = require('../controllers/map-controller')
const auth = require('../auth')

router.post('/map', auth.verify, MapController.createMap)
router.delete('/map/:id', auth.verify, MapController.deleteMap)
router.get('/map/:id', MapController.getMapById)
router.get('/mappairs', auth.verify, MapController.getMapPairs)
router.get('/likedmappairs', auth.verify, MapController.getLikedMapPairs);
router.put('/map/:id', auth.verify, MapController.updateMap)
router.get('/map/:keyword', MapController.getMapsByKeyword)
router.get('/maps/:email', MapController.getMapsByUser)
router.get('/maps', MapController.getMaps)
router.get('/allmappairs', MapController.getAllPublishedMapPairs)
router.get('/maplayer/:id', MapController.getMapLayerById);
router.put('/maplayer/:id', auth.verify, MapController.updateMapLayer)
router.post('/map/:id/like', auth.verify, MapController.likeMapById);
router.post('/map/:id/unlike', auth.verify, MapController.unlikeMapById);
router.post('/map/:id/view', MapController.viewMapById);

module.exports = router