+function() {
  'use strict';

  var express = require("express");

  var api = require("./api")
  ,   auth = require("./auth")
  ,   router = express.Router();

  //get home page
  router.get("/", function(req, res, next){
    res.render("index");
  });

  router.use("/api", api);

  router.use("/auth", auth);

  module.exports = router;

}();
