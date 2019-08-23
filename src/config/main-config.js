require("dotenv").config();
const logger = require('morgan');
const path = require("path");
const viewsFolder = path.join(__dirname, "..", "views");
const bodyParser = require("body-parser");

module.exports = {
    init(app){
        app.set("views", viewsFolder);
        app.set("view engine", "ejs");
        app.use(bodyParser.urlencoded({ extended: true }));
        app.use(logger('dev'));
     }
  };
  