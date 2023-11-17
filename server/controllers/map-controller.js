const Map = require('../models/map-model')

createMap = async (req, res) => {
    try {
        const { title, description, ownerEmail, userName, jsonData, mapType, mapLayers, likes, views, comments, published, publishedDate } = req.body;
        const newMap = new Map({
            title,
            description,
            ownerEmail,
            userName,
            jsonData,
            mapType,
            mapLayers,
            likes,
            views,
            comments,
            published,
            publishedDate,
        });

        const savedMap = await newMap.save();

        res.status(201).json({
            status: 201,
            data: { Map: savedMap },
        });
    } catch (err) {
        console.log("err: " + err);
        res.json(false);
    }
}

deleteMap = async (req, res) => {
    try {
        // Extract map ID from request parameters
        const { id } = req.params;

        await Map.findByIdAndDelete(id);

        res.status(200).json({
            status: 200,
            data: { successMessage: 'Map deleted successfully' },
        });
    } catch (error) {
        console.log("err: " + err);
        res.json(false);
    }
}

getMapById = async (req, res) => {
    try {
        // Extract map ID from request parameters
        const { id } = req.params;
        const map = await Map.findById(id);

        res.status(200).json({
            status: 200,
            data: { Map: map },
        });
    } catch (error) {
        console.log("err: " + err);
        res.json(false);
    }
}

getMapPairs = async (req, res) => {
    try {
        // Find all maps and retrieve title and id pairs
        const maps = await Map.find({}, 'title');

        // Respond with the pairs
        res.status(200).json({
            status: 200,
            data: {
                success: true,
                idNamePairs: maps.map(map => ({ _id: map._id, name: map.title })),
            },
        });
    } catch (error) {
        console.log("err: " + err);
        res.json(false);
    }
}

updateMap = async (req, res) => {
    try {
        // Extract map ID from request parameters
        const { id } = req.params;
        await Map.findByIdAndUpdate(id, req.body);

        res.status(200).json({
            status: 200,
            data: { success: true, _id: id },
        });
    } catch (error) {
        // Handle errors
        if (error.name === 'CastError') {
            console.log("err: " + err);
            res.json(false);
        }
    }
}

getMapsByKeyword = async (req, res) => {
    try {
        // Extract keyword from request parameters
        const { keyword } = req.params;

        const maps = await Map.find({ title: { $regex: new RegExp(keyword, 'i') } });

        // Respond with the maps
        res.status(200).json({
            status: 200,
            data: { success: true, maps },
        });
    } catch (error) {
        console.log("err: " + err);
        res.json(false);
    }
}

getMapsByUser = async (req, res) => {
    try {
        // Extract username from request parameters
        const { username } = req.params;

        const maps = await Map.find({ userName: username });

        // Respond with the maps
        res.status(200).json({
            status: 200,
            data: { success: true, maps },
        });
    } catch (error) {
        console.log("err: " + err);
        res.json(false);
    }
}

getMaps = async (req, res) => {
    try {
        const maps = await Map.find();

        res.status(200).json({
            status: 200,
            data: { success: true, maps },
        });
    } catch (error) {
        console.log("err: " + err);
        res.json(false);
    }
}

module.exports = {
    createMap,
    deleteMap,
    getMapById,
    getMapPairs,
    updateMap,
    getMapsByKeyword,
    getMapsByUser,
    getMaps,
}