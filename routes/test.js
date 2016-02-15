+function(){
  "use strict";

  var express = require("express")
  ,   mongoose = require("mongoose")
  ,   router = express.Router();

  var Test = mongoose.model("Test");

  router.post("/", function(req, res, next){
    var newTest = new Test({
      message: req.body.message
    });

    newTest.save(function(err){
      if(err) {
        console.log(err);
        res.json({
          success: false,
          message: "insert failed"
        });
      }
      res.json({
        success: true,
        message: req.body.message
      });
    });
  });

  module.exports = router;

}();
