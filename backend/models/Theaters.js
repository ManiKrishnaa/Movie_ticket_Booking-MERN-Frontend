const mongoose = require('mongoose');

const theaterSchema = new mongoose.Schema({
    name: { type: String, required: true },
    location: { type: String, required: true },
    city : {type:String,required:true},
    capacity: { type: Number, required: true }
});

const Theater = mongoose.model('Theaters', theaterSchema);

module.exports = Theater;
