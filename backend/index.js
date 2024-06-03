const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors');
const usermodel = require("./models/Users");
const moviemodel = require("./models/Movies");
const theatermodel = require("./models/Theaters");
const seatingmodel = require("./models/Seatings");
const bookingmodel = require("./models/Bookings");
const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const moment = require("moment");

const secretKey = "Movie_booking00124123124";

mongoose.connect('mongodb://localhost:27017/moviebooking')
.then(()=>{
    console.log("mongodb connected !");
})
.catch((error)=>{
    console.log("error while connecting to database !");
});

const app = express()

app.use(bodyParser.json())
app.use(cors())
app.use(express.json());

app.post('/signup',async(req,res)=>{
    const {email,password,mobile} = req.body;
    try{
        const hashedpassword = await bcryptjs.hash(password, 12);
        const newuser = await usermodel({email : email,mobile : mobile,password : hashedpassword});
        await newuser.save();
        res.json({ status: 'ok'});
    }catch(error){
        console.log(error);
        res.json({status : 'error'});
    }
});

app.post('/signin', async (req, res) => {
    const { email, password } = req.body;
    const user = await usermodel.findOne({ email: email });
    if (!user) {
        res.json({ status: 'nouser' });
    }
    const passwordmatch = await bcryptjs.compare(password, user.password);
    if (!passwordmatch) {
        res.json({ status: 'invalid_credintials' });
    }
    const token = jwt.sign({ email: email }, secretKey, { expiresIn: '1h' });
    res.cookie('token', token, { httpOnly: true, maxAge: 3600000 });
    res.json({ status: 'ok', isLoggedIn: true , userdata : user});
});

app.get('/cities',async(req,res)=>{
    try {
        const theaters = await theatermodel.find({}, 'city'); 
        const cities = [...new Set(theaters.map(theater => theater.city))];
        res.json({ cities });
      } catch (error) {
        console.error('Error fetching cities:', error);
        res.status(500).json({ error: 'An error occurred while fetching cities' });
      }
});

app.get('/movies/:city', async (req, res) => {
    try {
        const city = req.params.city;
        const movies = await moviemodel.find({ city: city });
        res.json({ movies });
    } catch (error) {
        console.error('Error fetching movies:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/moviess/:id', async (req, res) => {
    try {
      const id = req.params.id;
      const movie = await moviemodel.findById(id);
      res.json({ movie });
    } catch (error) {
      console.error('Error fetching movie:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/movies/:id/:theater/:showtime/:date', async (req, res) => {
    try {
        const { id, showtime, theater, date } = req.params;
        const decodedTheater = decodeURIComponent(theater);
        const decodedDate = decodeURIComponent(date);
        const dateString = decodedDate.split('T')[0];

        const movie = await moviemodel.findById(id);
        const theaterData = await theatermodel.findOne({ name: decodedTheater });
        const moviename = movie.title;

        if (!theaterData) {
            return res.status(404).json({ message: 'Theater not found' });
        }

        const theatercapacity = theaterData.capacity;
        const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J','K','L','M','N','O','P','Q','R','S'];
        const seatNumbers = [];

        const seatsPerRow = Math.ceil(theatercapacity / rows.length); 
        for (let row of rows) {
            for (let i = 1; i <= seatsPerRow; i++) {
                seatNumbers.push(`${row}${i}`);
            }
        }

        const existingSeating = await seatingmodel.findOne({ theaterName: decodedTheater, movieName: moviename, showTiming: showtime, date: dateString });

        if (existingSeating) {
            console.log('Seating data already exists ');
        } else {
            const seatingData = new seatingmodel({
                theaterName: decodedTheater,
                theateraddress : theaterData.location,
                movieName: moviename,
                showTiming: showtime,
                date: decodedDate,
                seats: seatNumbers.map(seatNumber => ({ seatNumber: seatNumber, isBooked: false }))
            });

            await seatingData.save();
            console.log('Seating data saved ');
        }

        const updatedSeatingData = await seatingmodel.findOne({ theaterName: decodedTheater, movieName: moviename, showTiming: showtime, date: decodedDate });

        res.json({ seatingData: updatedSeatingData });
    } catch (error) {
        console.error('Error fetching movie:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.post('/movies/seating/booking', async(req, res) => {
    const { seatNumber, movieName, showtime, email, formattedDate, theaterName } = req.body;
    const [day, month, year] = formattedDate.split('-');
    const date = `${year}-${month}-${day}`;
    try {
        const theaterdata = await theatermodel.findOne({ name: theaterName });
        const userdata = await usermodel.findOne({ email: email });
        let show;
        if(showtime == "11:00 AM"){
            show = "11"
        }else if(showtime == "2:00 PM"){
            show = "14"
        }else if(showtime == "6:00 PM"){
            show = "18"
        }else if(showtime == "9:00 PM"){
            show = "21"
        }
        const query = { theaterName: theaterName, showTiming: show, date: date };
        const seatings = await seatingmodel.findOne(query);
        const update = { $set: { 'seats.$[elem].isBooked': true } };
        const options = { arrayFilters: [{ 'elem.seatNumber': seatNumber }], new: true };

        if(seatings){
            const seat = seatings.seats.find(s => s.seatNumber === seatNumber);
            if(seat){
                if(seat.isBooked){
                    res.json({bookingstatus : "already booked"});
                    return;
                }else{
                    await seatingmodel.findOneAndUpdate(query, update, options);
                    const newbooking = await bookingmodel({seatnumber: seatNumber,useremail: email,usermobile: userdata.mobile,theatername: theaterName,moviename: movieName,showtime: show,showdate: date});
                    await newbooking.save();
                    res.json({ bookingstatus: "success" });
                    console.log("Seat booked");
                    return;
                }
            }
        }
      } catch (error) {
        console.error('Error booking seat:', error);
        res.status(500).json({ status: 'error', message: 'Internal Server Error' });
      }
});

app.listen(5000,()=>{
    console.log("server running at port 5000 ");
})
