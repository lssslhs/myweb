+function() {
  "use strict";

  var mongoose = require("mongoose")
  ,   passport = require("passport");

  var User     = mongoose.model("User")
  ,   ObjectId = mongoose.Types.ObjectId;

  var UserApi = {

    create: function(req, res, next){
      if (!req.body.email || !req.body.password) {
        res.json({
          success: false,
          msg: "Please enter email and password."
        });
      }
      else {
        var newUser = new User({
          "local.email": req.body.email,
          "local.password": req.body.password,
          "local.username": req.body.username
        });

        console.log(newUser);
        //save the user
        newUser.save(function(err){
          if (err) {
            //var errObj = {};
            // if (err.errors["local.email"]) {
            //   errObj.emailError = err.errors["local.email"].message;
            // }
            console.log(err);
            return res.json({
              success: false,
              msg: err
            });
          }

          res.json({success: true, msg: 'Successful created new user.'});
        });
      }
    },
  };

  module.exports = UserApi;

}();
