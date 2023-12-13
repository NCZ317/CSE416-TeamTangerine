const { ChoroplethLayer, HeatmapLayer, DotDensityLayer, GraduatedSymbolLayer, FlowmapLayer, Map } = require('../models/map-model');
const User = require('../models/user-model')
const turf = require('@turf/turf');


createMap = async (req, res) => {
    try {
        const body = req.body;
        // console.log("createMap body: " + JSON.stringify(body));

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

        //Create the appropriate layer schema for the map, depending on the map type
        let mapLayer;
        let graphicTitle = "";
        let graphicDescription = "";
        let style = {};
        let currentRegions = [];
        if (body.mapType === "choroplethMap") {
            let valueField = "";
            let colorScale = [];
            mapLayer = new ChoroplethLayer({
                graphicTitle: graphicTitle,
                graphicDescription: graphicDescription,
                style: style,
                geographicRegion: [],
                valueField: valueField,
                colorScale: colorScale,
                defaultColor: "#79C200",
                currentRegions: currentRegions
            });
            // mapLayer = new ChoroplethLayer();
        } else if (body.mapType === "heatMap") {
            let radius = 0;
            let colorScale = {};
            mapLayer = new HeatmapLayer({
                graphicTitle: graphicTitle, 
                graphicDescription: graphicDescription, 
                style: style, 
                radius: radius, 
                colorScale: colorScale,
                currentRegions: currentRegions
            });

        } else if (body.mapType === "dotDensityMap") {
            
            let dotSize = 1;
            let dotValue = 0;
            mapLayer = new DotDensityLayer({
                graphicTitle: graphicTitle, 
                graphicDescription: graphicDescription, 
                style: style, 
                dotSize: dotSize, 
                dotValue: dotValue, 
                dotColor: '#000000',
                valueField: 'Value',
                defaultColor: "#79C200",
                currentRegions: currentRegions
            });
            map.jsonData.features.forEach((feature) => {
                const regionName = feature.properties.name || `Region ${feature.index}`;
                //console.log(regionName);
        
                // Get the polygon geometry of the region
                const regionPolygon = feature.geometry;
                //console.log(regionPolygon);
        
                // Generate 10 random dots for each region using Turf.js
                const dots = Array.from({ length: 10 }, () => {
                    let randomPoint;
        
                    // Ensure that the generated point is within the region's polygon
                    do {
                        // Get the bounding box of the region geometry
                        const bbox = turf.bbox(regionPolygon);
        
                        // Generate random coordinates within the bounding box
                        const randomLng = bbox[0] + Math.random() * (bbox[2] - bbox[0]);
                        const randomLat = bbox[1] + Math.random() * (bbox[3] - bbox[1]);
        
                        // Create a Turf.js point geometry
                        randomPoint = turf.point([randomLng, randomLat]);
                        if (turf.booleanPointInPolygon(randomPoint, regionPolygon)) break;
        
                        // Check if the point is inside the region's polygon
                    } while (!turf.booleanPointInPolygon(randomPoint, regionPolygon));
        
                    return {
                        coordinates: turf.getCoord(randomPoint),
                    };
                });
        
                // Add the region and its dots to the geographicRegion array
                mapLayer.geographicRegion.push({
                    name: regionName,
                    dots: dots,
                });
            });
            //console.log(mapLayer.geographicRegion);

        } else if (body.mapType === "graduatedSymbolMap") {
            let symbolColor = "";
            let sizeScale = {};
            mapLayer = new GraduatedSymbolLayer({
                graphicTitle: graphicTitle, 
                graphicDescription: graphicDescription, 
                style: style, 
                symbolColor: symbolColor, 
                sizeScale: sizeScale,
                currentRegions: currentRegions
            });

        } else if (body.mapType === "flowMap") {
            let lineSizeScale = {};
            let colorScale = {};
            mapLayer = new FlowmapLayer({
                graphicTitle: graphicTitle, 
                graphicDescription: graphicDescription, 
                style: style, 
                lineSizeScale: lineSizeScale, 
                colorScale: colorScale,
                currentRegions: currentRegions
            });
        }

        console.log(mapLayer);
        map.mapLayers = mapLayer._id;

        console.log(map.mapLayers);
        
        const user = await User.findOne({ _id: req.userId });

        console.log("User found ", user);

        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        user.maps.push(map._id);

        await Promise.all([user.save(), map.save(), mapLayer.save()]);

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
        // console.log("map found: " + JSON.stringify(map));

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
        console.log(map);
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

        //console.log("found Maps: " + JSON.stringify(maps));

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

getLikedMapPairs = async (req, res) => {
    console.log("getLikedMapPairs");
    try {
        // Find the user by userId
        const user = await User.findOne({ _id: req.userId });
        console.log("find user with id " + req.userId);

        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        // Find maps that the user has liked
        console.log("find all Maps liked by " + user.email);
        let likedMaps = []
        likedMaps = await Map.find({ _id: { $in: user.likedMaps } });

        if (!likedMaps) {
            console.log("!likedMaps");
            return res.status(404).json({ success: false, error: 'Liked maps not found' });
        } else {
            console.log("Send the liked Maps pairs");
            // Put all the liked maps into id, name pairs
            const pairs = likedMaps.map(map => ({
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
getAllPublishedMapPairs = async (req, res) => {
    console.log("getAllPublishedMapPairs");
    try {
        // Find all users with published maps
        const usersWithPublishedMaps = await User.find({});
        console.log(usersWithPublishedMaps);

        if (!usersWithPublishedMaps) {
            console.log("No users with published maps found");
            return res.status(404).json({ success: false, error: 'No users with published maps found' });
        }

        // Collect maps from all users with published maps
        let allPublishedMaps = [];
        for (const user of usersWithPublishedMaps) {
            const maps = await Map.find({ ownerEmail: user.email, published: true });

            if (maps && maps.length > 0) {
                allPublishedMaps = allPublishedMaps.concat(maps);
            }
        }

        if (!allPublishedMaps) {
            console.log("No published maps found");
            return res.status(404).json({ success: false, error: 'No published maps found' });
        }

        console.log("Send the published Maps pairs");
        // PUT ALL THE MAPS INTO ID, NAME PAIRS
        const pairs = allPublishedMaps.map(map => ({
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
    } catch (err) {
        console.log(err);
        return res.status(500).json({ success: false, error: "Internal Server Error" });
    }
};



updateMap = async (req, res) => {
    const body = req.body;
    //console.log("updateMap: " + JSON.stringify(body));

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
        // map.currentRegions = body.map.currentRegions;

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

getMapLayerById = async (req, res) => {
    console.log("Find Map Layer with id: " + JSON.stringify(req.params.id));
    let mapLayer = null;
    const mapType = req.query.mapType;

    try {
        if (mapType === "choroplethMap") {
            mapLayer = await ChoroplethLayer.findOne({ _id: req.params.id });

        } else if (mapType === "heatMap") {
            mapLayer = await HeatmapLayer.findOne({ _id: req.params.id });

        } else if (mapType === "dotDensityMap") {
            mapLayer = await DotDensityLayer.findOne({ _id: req.params.id });

        } else if (mapType === "graduatedSymbolMap") {
            mapLayer = await GraduatedSymbolLayer.findOne({ _id: req.params.id });

        } else if (mapType === "flowMap") {
            mapLayer = await FlowmapLayer.findOne({ _id: req.params.id });

        }

        if (!mapLayer) {
            return res.status(404).json({ success: false, error: "Map Layer not found" });
        }

        return res.status(200).json({ success: true, mapLayer: mapLayer });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ success: false, error: "Internal Server Error" });
    }
};

updateMapLayer = async (req, res) => {
    const body = req.body;
    // console.log("updateMapLayer: " + JSON.stringify(body));

    try {
        if (!body) {
            return res.status(400).json({
                success: false,
                error: 'You must provide a body to update',
            });
        }

        let mapLayer;
        let mapType = body.mapType

        if (mapType === "choroplethMap") {
            mapLayer = await ChoroplethLayer.findOne({ _id: req.params.id });
            if (mapLayer) {
                mapLayer.geographicRegion = body.mapLayer.geographicRegion;
                mapLayer.valueField = body.mapLayer.valueField;
                mapLayer.colorScale = body.mapLayer.colorScale;
                mapLayer.defaultColor = body.mapLayer.defaultColor;
            }

        } else if (mapType === "heatMap") {
            mapLayer = await HeatmapLayer.findOne({ _id: req.params.id });
            if (mapLayer) {
                mapLayer.dataValues = body.mapLayer.dataValues;
                mapLayer.radius = body.mapLayer.radius;
                mapLayer.colorScale = body.mapLayer.colorScale;
            }

        } else if (mapType === "dotDensityMap") {
            mapLayer = await DotDensityLayer.findOne({ _id: req.params.id });
            if (mapLayer) {
                mapLayer.geographicRegion = body.mapLayer.geographicRegion;
                mapLayer.dotSize = body.mapLayer.dotSize;
                mapLayer.dotValue = body.mapLayer.dotValue;
                mapLayer.dotColor = body.mapLayer.dotColor;
                mapLayer.valueField = body.mapLayer.valueField;
            }

        } else if (mapType === "graduatedSymbolMap") {
            mapLayer = await GraduatedSymbolLayer.findOne({ _id: req.params.id });
            if (mapLayer) {
                mapLayer.dataValues = body.mapLayer.dataValues;
                mapLayer.symbolColor = body.mapLayer.symbolColor;
                mapLayer.sizeScale = body.mapLayer.sizeScale;
            }

        } else if (mapType === "flowMap") {
            mapLayer = await FlowmapLayer.findOne({ _id: req.params.id });
            if (mapLayer) {
                console.log(mapLayer);
                mapLayer.dataValues = body.mapLayer.dataValues;
                mapLayer.lineSizeScale = body.mapLayer.lineSizeScale;
                mapLayer.colorScale = body.mapLayer.colorScale;
            }

        }

        if (!mapLayer) {
            return res.status(404).json({ success: false, error: "Map Layer not found" });
        }

        
        mapLayer.graphicTitle = body.mapLayer.graphicTitle;
        mapLayer.graphicDescription = body.mapLayer.graphicDescription;
        mapLayer.style = body.mapLayer.style;
        mapLayer.currentRegions = body.mapLayer.currentRegions;

        await mapLayer.save();

        console.log("SUCCESS!!!");
        return res.status(200).json({
            success: true,
            message: 'Map Layer updated!',
        });
    } catch (error) {
        console.log("FAILURE: " + JSON.stringify(error));
        return res.status(404).json({
            error,
            message: 'Map not updated!',
        });
    }
};

likeMapById = async (req, res) => {
    console.log("Like with id: " + JSON.stringify(req.params.id));

    try {
        const map = await Map.findById(req.params.id);
        console.log("map found: " + JSON.stringify(map));

        if (!map) {
            return res.status(404).json({
                errorMessage: 'Map not found!',
            });
        }

        const user = await User.findOne({ _id: req.userId });

        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        console.log("User found!");

        map.likes += 1;

        // Save the updated map
        await map.save();

        // Push the map's _id to the user's likedMaps array
        user.likedMaps.push(map._id);

        // Save the updated user
        await user.save();

        return res.status(200).json({
            success: true,
            message: 'Map liked successfully!',
            map: map,
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ success: false, error: "Internal Server Error" });
    }
}

unlikeMapById = async (req, res) => {
    console.log("Unlike with id: " + JSON.stringify(req.params.id));

    try {
        const map = await Map.findById(req.params.id);

        if (!map) {
            return res.status(404).json({
                errorMessage: 'Map not found!',
            });
        }

        const user = await User.findOne({ _id: req.userId });

        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        console.log("User found!");

        map.likes -= 1;

        // Save the updated map
        await map.save();

        // Remove the map's _id from the user's likedMaps array
        user.likedMaps = user.likedMaps.filter((mapId) => mapId.toString() !== map._id.toString());

        // Save the updated user
        await user.save();

        return res.status(200).json({
            success: true,
            message: 'Map unliked successfully!',
            map: map,
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ success: false, error: "Internal Server Error" });
    }
}

viewMapById = async (req, res) => {
    console.log("View with id: " + JSON.stringify(req.params.id));

    try {
        const map = await Map.findById(req.params.id);
        console.log("map found: " + JSON.stringify(map));

        if (!map) {
            return res.status(404).json({
                errorMessage: 'Map not found!',
            });
        }

        map.views += 1;

        // Save the updated map
        await map.save();

        return res.status(200).json({
            success: true,
            message: 'Map viewed successfully!',
            map: map,
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ success: false, error: "Internal Server Error" });
    }
}
module.exports = {
    createMap,
    deleteMap,
    getMapById,
    getMapPairs,
    getLikedMapPairs,
    getAllPublishedMapPairs,
    updateMap,
    getMapsByKeyword,
    getMapsByUser,
    getMaps,
    getMapLayerById,
    updateMapLayer,
    likeMapById,
    unlikeMapById,
    viewMapById
}