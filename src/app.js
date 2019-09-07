const express = require("express");
const app = express();
const mainConfig = require("./config/main-config.js");
const routeConfig = require("./config/route-config.js");

mainConfig.init(app);
routeConfig.init(app);
module.exports = app;
