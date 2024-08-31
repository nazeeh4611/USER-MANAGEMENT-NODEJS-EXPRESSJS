const express = require('express');
const user_route = express();
const session = require('express-session');
const config = require('../config/config');

user_route.use(session({ secret: config.sessionSecret, resave: false, saveUninitialized: true }));

const auth = require("../authentication/auth");

user_route.set('view engine', 'ejs');
user_route.set('views', './view/User');

const bodyParser = require('body-parser');
user_route.use(bodyParser.json());
user_route.use(bodyParser.urlencoded({ extended: true }));

const userController = require('../controller/userController');

user_route.get('/register', auth.islogout, userController.loadRegister);
user_route.post('/register', auth.islogout, userController.insertUser);

user_route.get('/', auth.islogout, userController.loginLoad);
user_route.get('/login',userController.loginLoad);
user_route.post('/login', userController.verifyLogin);

user_route.get('/home', auth.islogin, userController.loadHome);

user_route.post('/logout', auth.islogin, userController.userLogout);

user_route.get('/edit', auth.islogin, userController.editLoad);
user_route.post('/edit', auth.islogin, userController.updateprofile);

module.exports = user_route;


