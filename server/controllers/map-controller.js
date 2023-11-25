const { ChoroplethLayer, HeatmapLayer, DotDensityLayer, GraduatedSymbolLayer, FlowmapLayer, Map } = require('../models/map-model');
const User = require('../models/user-model')


createMap = async (req, res) => {
    try {
        const body = req.body;
        console.log("createMap body: " + JSON.stringify(body));

        if (!body) {
            return res.status(400).json({
                success: false,
                error: 'You must provide a Map',
            });
        }

        const map = new Map(body);
        console.log("map: " + map.toString());

        if (!map) {
            return res.status(400).json({ success: false, error: err });
        }
        
        const user = await User.findOne({ _id: req.userId });

        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        user.maps.push(map._id);

        await Promise.all([user.save(), map.save()]);

        return res.status(201).json({
            map: map
        });
    } catch (error) {
        console.error("Error creating map:", error);
        return res.status(500).json({
            errorMessage: 'Internal Server Error',
        });
    }
};

deleteMap = async (req, res) => {
    console.log("delete Map with id: " + JSON.stringify(req.params.id));

    try {
        const map = await Map.findById(req.params.id);
        console.log("map found: " + JSON.stringify(map));

        if (!map) {
            return res.status(404).json({
                errorMessage: 'Map not found!',
            });
        }

        const user = await User.findOne({ email: map.ownerEmail });
        console.log("user._id: " + user._id);
        console.log("req.userId: " + req.userId);

        if (user._id == req.userId) {
            console.log("correct user!");

            // Remove the map from the user's maps array
            const userMaps = user.maps.filter((userMap) => String(userMap) !== String(req.params.id));
            user.maps = userMaps;

            // Save the updated user object
            await user.save();
            
            await Map.findOneAndDelete({ _id: req.params.id });
            return res.status(200).json({ success: true });
        } else {
            console.log("incorrect user!");
            return res.status(401).json({
                errorMessage: "Authentication error"
            });
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json({ success: false, error: "Internal Server Error" });
    }
};


getMapById = async (req, res) => {
    console.log("Find Map with id: " + JSON.stringify(req.params.id));

    try {
        const map = await Map.findOne({ _id: req.params.id });

        if (!map) {
            return res.status(404).json({ success: false, error: "Map not found" });
        }

        return res.status(200).json({ success: true, map: map });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ success: false, error: "Internal Server Error" });
    }
};

getMapPairs = async (req, res) => {
    console.log("getMapPairs");
    try {
        const user = await User.findOne({ _id: req.userId });
        console.log("find user with id " + req.userId);

        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        console.log("find all Maps owned by " + user.email);
        const maps = await Map.find({ ownerEmail: user.email });

        console.log("found Maps: " + JSON.stringify(maps));

        if (!maps) {
            console.log("!maps");
            return res.status(404).json({ success: false, error: 'Maps not found' });
        } else {
            console.log("Send the Maps pairs");
            // PUT ALL THE LISTS INTO ID, NAME PAIRS
            const pairs = maps.map(map => ({
                _id: map._id,
                title: map.title,
                description: map.description,
                username: map.username,
                mapType: map.mapType,
                regions: map.regions,
                likes: map.likes,
                views: map.views,
                comments: map.comments,
                published: map.published
            }));

            return res.status(200).json({ success: true, idNamePairs: pairs });
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json({ success: false, error: "Internal Server Error" });
    }
};


updateMap = async (req, res) => {
    const body = req.body;
    console.log("updateMap: " + JSON.stringify(body));

    try {
        if (!body) {
            return res.status(400).json({
                success: false,
                error: 'You must provide a body to update',
            });
        }

        const map = await Map.findOne({ _id: req.params.id });

        if (!map) {
            return res.status(404).json({
                message: 'Map not found!',
            });
        }

        map.title = body.map.title;
        map.description = body.map.description;
        map.jsonData = body.map.jsonData;
        map.mapLayers = body.map.mapLayers;
        map.regions = body.map.regions;
        map.likes = body.map.likes;
        map.views = body.map.views;
        map.comments = body.map.comments;
        map.published = body.map.published;
        map.publishedDate = body.map.publishedDate;

        await map.save();

        console.log("SUCCESS!!!");
        return res.status(200).json({
            success: true,
            id: map._id,
            message: 'Map updated!',
        });
    } catch (error) {
        console.log("FAILURE: " + JSON.stringify(error));
        return res.status(404).json({
            error,
            message: 'Map not updated!',
        });
    }
};


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
    await Map.find({}, (err, maps) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        if (!maps.length) {
            return res
                .status(404)
                .json({ success: false, error: `Maps not found` })
        }
        return res.status(200).json({ success: true, idNamePairs: maps })
    }).catch(err => console.log(err))
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