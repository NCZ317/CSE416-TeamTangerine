const express = require('express')
const router = express.Router()
const MapController = require('../controllers/map-controller')
const auth = require('../auth')
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

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

router.post('/upload-thumbnail', auth.verify, upload.single('thumbnail'), async (req, res) => {
    try {
        if (!req.file) {
            throw new BadRequest('No file uploaded');
        }
        const mapObjectId = req.body.mapObjectId;
        const thumbnailUploaded = await MapController.uploadThumbnail(req.file, mapObjectId);
        if (!thumbnailUploaded) {
            throw new Error('Error uploading thumbnail');
        }

        res.status(200).json({ message: 'Thumbnail uploaded successfully' });
    } catch (error) {
        console.error('Error handling thumbnail upload:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


module.exports = router