const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const mapSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    ownerEmail: { type: String, required: true },
    username: { type: String, required: true },
    jsonData: { type: Object, required: true },
    mapType: { type: String, required: true },
    mapLayers: { type: Schema.Types.Mixed }, 
    likes: { type: Number, required: true },
    views: { type: Number, required: true },
    comments: [{
        user: { type: String, required: true },
        message: { type: String, required: true }
    }],
    published: { type: Boolean, required: true },
    publishedDate: { type: Date, required: true }
});
const Map = mongoose.model('Map', mapSchema);

const choroplethLayerSchema = new Schema({
    graphicTitle: { type: String },
    graphicDescription: { type: String },
    style: { type: Object },
    geographicRegion: [{
        name: String,
        geometry: Object,
        value: Object
    }],
    valueField: { type: String },
    colorScale: { type: Object }
});

const ChoroplethLayer = mongoose.model('ChoroplethLayer', choroplethLayerSchema);

const heatmapLayerSchema = new Schema({
    graphicTitle: { type: String },
    graphicDescription: { type: String },
    style: { type: Object },
    dataValues: [{
        latitude: Number,
        longitude: Number,
        intensity: Number
    }],
    radius: { type: Number },
    colorScale: { type: Object }
});

const HeatmapLayer = mongoose.model('HeatmapLayer', heatmapLayerSchema);

const dotdensityLayerSchema = new Schema({
    graphicTitle: { type: String },
    graphicDescription: { type: String },
    style: { type: Object },
    geographicRegion: [{
        name: String,
        geometry: Object,
        value: Object,
        category: String
    }],
    dotSize: { type: Number },
    dotValue: { type: Number },
    colorScale: { type: Object }
});

const DotDensityLayer = mongoose.model('DotDensityLayer', dotdensityLayerSchema);

const graduatedSymbolLayerSchema = new Schema({
    graphicTitle: { type: String },
    graphicDescription: { type: String },
    style: { type: Object },
    dataValues: [{
        latitude: Number,
        longitude: Number,
        value: Number
    }],
    symbolColor: { type: String },
    sizeScale: { type: Object }
});

const GraduatedSymbolLayer = mongoose.model('GraduatedSymbolLayer', graduatedSymbolLayerSchema);

const flowmapLayerSchema = new Schema({
    graphicTitle: { type: String },
    graphicDescription: { type: String },
    style: { type: Object },
    dataValues: [{
        originLatitude: Number,
        originLongitude: Number,
        destinationLatitude: Number,
        destinationLongitude: Number,
        value: Number,
        category: String
    }],
    lineSizeScale: { type: Object },
    colorScale: { type: Object }
});

const FlowmapLayer = mongoose.model('FlowmapLayer', flowmapLayerSchema);

module.exports = { ChoroplethLayer, HeatmapLayer, DotDensityLayer, GraduatedSymbolLayer, FlowmapLayer, Map };