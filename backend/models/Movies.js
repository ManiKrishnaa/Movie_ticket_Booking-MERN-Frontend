const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
    title: {type:String,required:true},
    description: {type:String,required:true},
    genre: {type:String,required:true},
    releaseDate: {type:Date,required:true},
    duration: {type:Number,required:true},
    city : {type:String,required:true},
    theaters :{type:String,required:true},
    posterUrl: {type:String,required:true},
});

module.exports = mongoose.model('Movies',movieSchema)
