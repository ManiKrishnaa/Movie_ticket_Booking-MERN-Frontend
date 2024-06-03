const mongoose = require("mongoose");

const seatSchema = new mongoose.Schema({
    seatNumber: { type: String, required: true },
    isBooked: { type: Boolean, default: false }
}, { _id: false });

const seatingSchema = new mongoose.Schema({
    theaterName: { type: String, required: true },
    theateraddress : {type:String,required:true},
    movieName: { type: String, required: true },
    showTiming: { type: String, required: true },
    date: { type: String, required: true },
    seats: [seatSchema]
});

module.exports = mongoose.model('Seatings', seatingSchema);
