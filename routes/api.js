+function() {
  "use strict";

  var express = require("express");

  var router = express.Router();

  router.get("/", function(req, res, next){
    res.send("api TBD");
  });

  module.exports = router;

}();
