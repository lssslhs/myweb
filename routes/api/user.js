+function() {
  "use strict";

  var mongoose = require("mongoose")
  ,   jwt = require("jwt-simple")
  ,   authConfig = require("../../config/auth");

  var User     = mongoose.model("User");

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
            return res.json({
              success: false,
              msg: err
            });
          }

          res.json({success: true, msg: 'Successful created new user.'});
        });
      }
    },

    auth: function(req, res, next) {
      User.findOne({
        "local.email": req.body.email
      }, function(err, user) {
        if (err) {
          throw err;
        }

        if(!user) {
          res.json({
            success: false,
            msg: "Authentication failed. User not found."
          });
        }
        else {
          user.comparePassword(req.body.password, function(err, isMatch) {
            if(err || !isMatch) {
              res.json({
                success: false,
                msg: "Authentication failed. Wrong email or password."
              });
            }
            else {
              var token = jwt.encode(user, authConfig.localAuth.secret);
              console.log("----jwt----"+token);
              res.json({
                success: true,
                token: "JWT " + token
              });
            }
          })
        }
      });
    },

    getInfo: function(req, res, next) {
      var token = getToken(req.headers);
      if(token) {
        var decoded = jwt.decode(token, authConfig.localAuth.secret);
        User.findOne({
          "local.email": decoded.local.email
        }, function(err, user) {
          if (err) {
            throw err;
          }

          if (!user) {
              return res.status(403).json({
              success: false,
              msg: "Authentication failed. User not found."
            });
          }
          else {
            return res.json({
              success: true,
              msg: "Welcome "+user.local.username
            })
          }
        });
      }
      else {
        return res.status(403).json({
          success: false,
          msg: "No token provided"
        });
      }
    }

  };

  var getToken = function(headers) {
    if(headers && headers.authorization) {
      var parted = headers.authorization.split(' ');
      if (parted.length === 2) {
        return parted[1];
      }
      else {
        return null;
      }
    }
    else {
      return null;
    }
  }

  module.exports = UserApi;

}();
