+function() {
  "use strict";

  var mongoose = require("mongoose")
  ,   jwt = require("jwt-simple")
  ,   authConfig = require("../../config/auth")
  ,   util = require('../../lib/util.js');

  var User     = mongoose.model("User")
  ,   Profile  = mongoose.model("Profile");

  var UserApi = {

    create: function(req, res, next){
      if (!req.body.username || !req.body.password) {
        res.json({
          success: false,
          msg: "Please enter username and password."
        });
      }
      else {
        var newUser = new User({
          "local.username": req.body.username,
          "local.password": req.body.password
        });

        newUser.save(function(err){
          if (err) {
            return res.json({
              success: false,
              msg: err
            });
          }
          //generate token
          var token = jwt.encode(newUser, authConfig.localAuth.secret);
          res.json({
            success: true,
            msg: "Successful created new user.",
            user: newUser.infoLocal,
            token: "JWT " + token
          });
        });
      }
    },

    login: function(req, res, next) {
      User.findOne({
        "local.username": req.body.username
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
                msg: "Authentication failed. Wrong username or password."
              });
            }
            else {
              var token = jwt.encode(user, authConfig.localAuth.secret);
              res.json({
                success: true,
                msg: "Authentication Success.",
                user: user.infoLocal,
                token: "JWT " + token
              });
            }
          })
        }
      });
    },

    info: function(req, res, next){
      var token = util.getToken(req.headers);
      if (token) {
        var decoded = jwt.decode(token, authConfig.localAuth.secret);
        User.findOne({
          "local.username": decoded.local.username
        },function(err, user){
          if (err) {
            throw err;
          }
          if (!user) {
            res.json({
              success: false,
              msg: "User not found"
            });
          }
          else {
            res.json({
              success: true,
              msg: "User founded",
              user: user.infoLocal
            });
          }
        });
      }
      else {
        return res.status(403).json({
          success: false,
          msg: "No token provided"
        });
      }
    },

    getProfile: function(req, res, next) {
      var token = util.getToken(req.headers);
      if (token) {
        var decoded = jwt.decode(token, authConfig.localAuth.secret);

        Profile.findOne({
          "user_id": decoded._id
        }, function(err, profile){
          if (err) {
            throw err;
          }
          if(!profile) {
            return res.json({
              success: false,
              msg: "Fail to find user profile",
            });
          }
          else {
            return res.json({
              success: true,
              msg: "Profile founded",
              profile: profile.profileInfo
            });
          }
        })
      }
      else {
        return res.status(403).json({
          success: false,
          msg: "No token provided"
        });
      }
    },

    createProfile: function(req, res, next) {
      var token = util.getToken(req.headers);
      var data = req.body;
      if (token) {
        var decoded = jwt.decode(token, authConfig.localAuth.secret);
        User.findOne({
          "local.username": decoded.local.username
        }, function(err, user) {
          if (err) {
            throw err;
          }
          if (!user) {
            return res.json({
              success: false,
              msg: "Auth Failed"
            });
          }
          var profile = new Profile({
            user_id: user._id,
            fullname: data.fullname,
            email: data.email,
            phone: data.phone,
            gender: data.gender,
            foodtype: data.foodtype,
            address: data.address
          });
          profile.save(function(err){
            if (err) {
              return res.json({
                success: false,
                msg: err
              });
            }
            res.json({
              success: true,
              msg: "Successful created user's profile",
              profile: profile
            })
          });
        });
      }
      else {
        return res.json({
          success: false,
          msg: "token not provided"
        });
      }
    },

    updateProfile: function(req, res, next) {
      var token = util.getToken(req.headers);
      if (token) {
        var decoded = jwt.decode(token, authConfig.localAuth.secret);
        Profile.findOne({
          user_id: decoded._id
        }, function(err, profile){
          if(err) {
            throw err;
          }

          if(!profile) {
            return res.json({
              success: false,
              msg: "profile not found"
            });
          }
          else {
            profile.fullname = req.body.fullname;
            profile.email = req.body.email;
            profile.phone = req.body.phone;
            profile.gender = req.body.gender;
            profile.foodtype = req.body.foodtype;
            profile.address = req.body.address;

            profile.save(function(err, profile) {
              if (err) {
                return res.json({
                  success: false,
                  msg: "failed to save profile"
                });
              }
              return res.json({
                success: true,
                msg: "profile saved",
                profile: profile
              });
            });
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

  module.exports = UserApi;

}();
