const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },
    comment: {
        type: String,
        required: true
    },
    author: {
        type: String,
        rqeuired: true
    }
}, {
    timestamps: true   // created at and updated at timestamps 
});

const dishSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    comments: [ commentSchema ]   // array of type commentSchema; subdocuments in a document
}, {
    timestamps: true   // created at and updated at timestamps 
});

var Dishes = mongoose.model('Dish', dishSchema);   // mongoose automatically makes the name plural
module.exports = Dishes;