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
    Map.findById({ _id: req.params.id }, (err, map) => {
        console.log("map found: " + JSON.stringify(map));
        if (err) {
            return res.status(404).json({
                errorMessage: 'Map not found!',
            })
        }

        // DOES THIS LIST BELONG TO THIS USER?
        async function asyncFindUser(map) {
            User.findOne({ email: map.ownerEmail }, (err, user) => {
                console.log("user._id: " + user._id);
                console.log("req.userId: " + req.userId);
                if (user._id == req.userId) {
                    console.log("correct user!");
                    Map.findOneAndDelete({ _id: req.params.id }, () => {
                        return res.status(200).json({ success: true });
                    }).catch(err => console.log(err))
                }
                else {
                    console.log("incorrect user!");
                    return res.status(401).json({ 
                        errorMessage: "authentication error" 
                    });
                }
            });
        }
        asyncFindUser(map);
    })
}

getMapById = async (req, res) => {
    console.log("Find Map with id: " + JSON.stringify(req.params.id));

    await Map.findOne({ _id: req.params.id }, (err, map) => {
        if (err) {
            return res.status(404).json({ success: false, error: err })
        }

        return res.status(200).json({ success: true, map: map })
    }).catch(err => console.log(err))
}

getMapPairs = async (req, res) => {
    console.log("getMapPairs");
    await User.findOne({ _id: req.userId }, (err, user) => {
        console.log("find user with id " + req.userId);
        async function asyncFindMap(email) {
            console.log("find all Maps owned by " + email);
            await Map.find({ ownerEmail: email }, (err, maps) => {
                console.log("found Maps: " + JSON.stringify(maps));
                if (err) {
                    return res.status(400).json({ success: false, error: err })
                }
                if (!maps) {
                    console.log("!maps.length");
                    return res
                        .status(404)
                        .json({ success: false, error: 'Maps not found' })
                }
                else {
                    console.log("Send the Maps pairs");
                    // PUT ALL THE LISTS INTO ID, NAME PAIRS
                    let pairs = [];
                    for (let key in maps) {
                        let map = maps[key];
                        let pair = {
                            _id: map._id,
                            title: map.title,
                            description: map.description,
                            username: map.username,
                            mapType: map.mapType,
                            likes: map.likes,
                            comments: map.comments,
                            published: map.published
                        };
                        pairs.push(pair);
                    }
                    return res.status(200).json({ success: true, idNamePairs: pairs })
                }
            }).catch(err => console.log(err))
        }
        asyncFindMap(user.email);
    }).catch(err => console.log(err))
}

updateMap = async (req, res) => {
    const body = req.body
        console.log("updateMap: " + JSON.stringify(body));
        if (!body) {
            return res.status(400).json({
                success: false,
                error: 'You must provide a body to update',
            })
        }
        Map.findOne({ _id: req.params.id }, (err, map) => {
            if (err) {
                return res.status(404).json({
                    err,
                    message: 'Map not found!',
                })
            }
            map.title = body.map.title;
            map.description = body.map.description;
            map.jsonData = body.map.jsonData;
            map.mapLayers = body.map.mapLayers;
            map.likes = body.map.likes;
            map.views = body.map.views;
            map.comments = body.map.comments;
            map.published = body.map.published;
            map.publishedDate = body.map.publishedDate
            
            map
                .save()
                .then(() => {
                    console.log("SUCCESS!!!");
                    return res.status(200).json({
                        success: true,
                        id: map._id,
                        message: 'Map updated!',
                    })
                })
                .catch(error => {
                    console.log("FAILURE: " + JSON.stringify(error));
                    return res.status(404).json({
                        error,
                        message: 'Map not updated!',
                    })
                })
        })
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