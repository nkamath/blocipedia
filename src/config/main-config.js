require("dotenv").config();
const logger = require('morgan');
const path = require("path");
const viewsFolder = path.join(__dirname, "..", "views");
const bodyParser = require("body-parser");
const passportConfig = require("./passport-config");
const session = require("express-session");
const flash = require("express-flash");


module.exports = {
    init(app){
        app.set("views", viewsFolder);
        app.set("view engine", "ejs");
        app.use(bodyParser.urlencoded({ extended: true }));
        app.use(logger('dev'));
        app.use(session({
            secret: process.env.COOKIE_SECRET,
            resave: false,
            saveUninitialized: false,
            cookie: { maxAge: 1.21e+9 }
          }));
        app.use(flash());         
        passportConfig.init(app);

        app.use((req,res,next) => {
            res.locals.currentUser = req.user;
            next();
          })     
     }
  };
  