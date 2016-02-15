+function() {
  "use strict";

  var JwtStrategy = require("passport-jwt").Strategy
  ,   mongoose    = require("mongoose");

  //load up the user model
  var User = mongoose.model("User")
  ,   authConfig = require("./auth");

  module.exports = function(passport) {
    var localOpts = {};
    localOpts.secretOrKey = authConfig.localAuth.secret;
    passport.use(new JwtStrategy(localOpts, function(jwt_payload, done){
      User.findOne({id: jwt_payload.id}, function(err, user){
        if (err) {
          return done(err);
        }
        if (user) {
          done(null, user);
        }
        else {
          done(null, false);
        }
      });
    }));
  };

}();
