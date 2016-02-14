+function() {
  var JwtStrategy = require("passport-jwt").Strategy;

  //load up the user model
  var User = require("../app/models/user");
  var auth = require("./auth");

  module.exports = function(passport) {
    var localOpts = {};
    localOpts.secretOrKey = auth.secret;
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
