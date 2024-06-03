const mongoose = require('mongoose');

const userschema = new mongoose.Schema({
    email : {type:String,required:true},
    mobile : {type:String,required:true},
    password : {type:String,required:true},
})

module.exports = mongoose.model('Users',userschema)