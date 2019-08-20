const staticRoutes = require("../routes/static");

module.exports = {
    init(app){
      app.use(staticRoutes);
    }
  }