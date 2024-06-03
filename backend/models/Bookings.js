const mongoose = require("mongoose");

const bookingdata = new mongoose.Schema({
    seatnumber : {type:String,required:true},
    useremail : {type:String,required:true},
    usermobile : {type:Number,required:true},
    theatername : {type:String,required:true},
    moviename : {type : String,required : true},
    showtime : {type:String,required:true},
    showdate : {type : String}
});

module.exports = mongoose.model('Bookings',bookingdata);
