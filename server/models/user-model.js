const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const UserSchema = new Schema(
    {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        email: { type: String, required: true },
        username: { type: String, required: true },
        passwordHash: { type: String, required: true },
        maps: [{ type: ObjectId, ref: 'Map' }],
        likedMaps: [{ type: ObjectId, ref: 'Map' }],
        numPosts: {type: Number, required: true},
        bio: { type: String, required: true },
        numLikes: {type: Number, required: true},
    },
    { timestamps: true },
    { typeKey: '$type' },
);

module.exports = mongoose.model('User', UserSchema);
