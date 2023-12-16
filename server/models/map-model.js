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
    regions: { type: [String], default: [] },
    mapLayers: { type: Schema.Types.Mixed }, 
    likes: { type: Number, required: true },
    views: { type: Number, required: true },
    comments: [{
        user: { type: String, required: true },
        message: { type: String, required: true }
    }],
    imageURL: {type: String, default: ''},
    published: { type: Boolean, required: true },
    publishedDate: { type: Date, required: true },
    // currentRegions: {type: [Object], default: []}
});
const Map = mongoose.model('Map', mapSchema);

const choroplethLayerSchema = new Schema({
    graphicTitle: { type: String},
    graphicDescription: { type: String},
    style: { type: Object, required: true},
    geographicRegion: [{
        name: String,
        geometry: Object,
        value: Object
    }],
    valueField: { type: String},
    colorScale: [{
        value: String,
        color: String
    }],
    defaultColor: {type: String},
    currentRegions: {type: [Object], default: []}
}, {minimize: false});

const ChoroplethLayer = mongoose.model('ChoroplethLayer', choroplethLayerSchema);

const heatmapLayerSchema = new Schema({
    graphicTitle: { type: String },
    graphicDescription: { type: String },
    style: { type: Object },
    // dataValues: [{
    //     latitude: Number,
    //     longitude: Number,
    //     intensity: Number
    // }],
    dataValues: [],
    radius: { type: Number },
    colorScale: { type: Object },
    currentRegions: {type: [Object], default: []}
}, {minimize: false});

const HeatmapLayer = mongoose.model('HeatmapLayer', heatmapLayerSchema);

const dotdensityLayerSchema = new Schema({
    graphicTitle: { type: String },
    graphicDescription: { type: String },
    style: { type: Object },
    geographicRegion: [{
        name: String,
        dots: [{
            coordinates: {
                type: [Number], // [longitude, latitude]
                index: '2dsphere', // for geospatial indexing
            },
            // additional properties for each dot if needed
        }],
    }],
    dotSize: { type: Number },
    dotValue: { type: Number },
    dotColor: { type: String },
    valueField: { type: String},
    currentRegions: {type: [Object], default: []}
}, {minimize: false});

const DotDensityLayer = mongoose.model('DotDensityLayer', dotdensityLayerSchema);

const graduatedSymbolLayerSchema = new Schema({
    graphicTitle: { type: String },
    graphicDescription: { type: String },
    style: { type: Object },
    dataValues: [{
        coordinates: {
            type: [Number], // [longitude, latitude]
            index: '2dsphere', // for geospatial indexing
        },
        radius: Number
    }],
    symbolColor: { type: String },
    currentRegions: {type: [Object], default: []}
}, {minimize: false});

const GraduatedSymbolLayer = mongoose.model('GraduatedSymbolLayer', graduatedSymbolLayerSchema);

const flowmapLayerSchema = new Schema({
    graphicTitle: { type: String },
    graphicDescription: { type: String },
    style: { type: Object },
    dataValues: [],
    valueField: { type: String},
    colorScale: [{
        value: String,
        color: String
    }],
    
    currentRegions: {type: [Object], default: []}
}, {minimize: false});

const FlowmapLayer = mongoose.model('FlowmapLayer', flowmapLayerSchema);

module.exports = { ChoroplethLayer, HeatmapLayer, DotDensityLayer, GraduatedSymbolLayer, FlowmapLayer, Map };