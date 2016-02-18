+function(undefined) {
  "use strict";

  /**********************************************************
  *                      Load Modules                      *
  **********************************************************/

  var express = require("express")
  ,   path = require("path")
  ,   fs = require("fs");

  var favicon = require("serve-favicon")
  ,   logger = require("morgan")
  ,   cookieParser = require("cookie-parser")
  ,   bodyParser = require("body-parser")
  ,   passport = require("passport")
  ,   dbConfig = require("./config/database");

  var app = express();

  // set server root for future use
  global.serverRoot = path.resolve(__dirname);

  /**********************************************************
  * Connect MongoDB, Bootstrap models and Config passport  *
  **********************************************************/

  var db_url = process.env.MONGODB_DB_URL || dbConfig.database;
  require("mongoose").connect(db_url, function (err) {
    if (err) {
      console.log(err, err.stack);
    } else {
      console.log("Connected to mongodb.");
    }
  });

  //get all models
  var modelsPath = path.join(__dirname, "app/models");
  fs.readdirSync(modelsPath).forEach(function(file) {
    require(modelsPath + "/" + file);
  });

  // pass passport for configuration
  require('./config/passport')(passport);


  /**********************************************************
  *                     Configuration                      *
  **********************************************************/

  //set views folder and template engine
  app.set("views", path.join(__dirname, "app/views"));
  app.engine("html", require("ejs").renderFile);
  app.set("view engine", "html");

  //set favicon
  app.use(favicon(__dirname + "/app/favicon.ico"));

  //log to console
  app.use(logger("dev"));

  //parse cookie
  app.use(cookieParser());

  //get request params
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));

  //use passport
  app.use(passport.initialize());


  app.use(express.static(path.join(__dirname, "app")));

  /**********************************************************
  *                         Routes                         *
  **********************************************************/

  var routes = require("./routes/index");

  app.use("/", routes);

  app.get('*', function(req, res, next){
    res.render("index");
  });

  /// catch 404 and forward to error handler
  app.use(function(req, res, next) {
    var err = new Error("Not Found");
    err.status = 404;
    next(err);
  });

  /// error handlers

  // development error handler
  // will print stacktrace
  if (app.get("env") === "development") {
    app.use(function(err, req, res, next) {
      res.status(err.status || 500);
      res.render("error", {
        message: err.message,
        error: err
      });
    });
  }

  // production error handler
  // no stacktraces leaked to user
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render("error", {
      message: err.message,
      error: {}
    });
  });

  //exports for future use
  module.exports = app;

}();
