
const express = require('express');
const app = express();
const nocache = require("nocache");
const path =require('path');
const PORT = process.env.PORT ||8080
const morgan = require('morgan')
const connectDB = require('./DB/connection')
const dotenv = require('dotenv')
require('dotenv').config();
dotenv.config({path: 'config.env' });

console.log("Hello, World!");

// log request
app.use(morgan('tiny'));

// mongodb connection 
connectDB();

// parse request to express.urlencoded
app.use(express.urlencoded({ extended: true }));

// set view engine
app.set('view engine', 'ejs');

// load assets
app.use('/css', express.static(path.resolve(__dirname, "public/css")));
app.use('/img', express.static(path.resolve(__dirname, "public/img")));
app.use('/js', express.static(path.resolve(__dirname, "public/js")));
app.use(nocache());
app.use(express.static(path.join(__dirname,'public')));


// load routes

// admin route 
// app.use('/',require('/route/admin_route'));
  // const adminRoute = require('./route/admin_route')

//use route
const userRoute = require('./Routes/Userroute');
app.use('/',userRoute);


console.log("Before starting the server");

app.listen(PORT,function(){
    console.log(`server running at http://localhost:${PORT}`);
});
   