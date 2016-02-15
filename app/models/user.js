+function() {
  "use strict";

  var mongoose = require("mongoose")
  ,   Schema = mongoose.Schema
  ,   bcrypt = require("bcrypt");

  var UserSchema = new Schema({
    local: {
      email: {
        type: String,
        unique: true,
        required: true
      },
      password: {
        type: String,
        required: true
      },
      username: String
    },

    isAdmin: Boolean
  });

  UserSchema
  .virtual("infoLocal")
  .get(function(){
    return {
      "_id": this._id,
      "username": this.local.username,
      "isAdmin": this.isAdmin
    };
  });

  UserSchema.path("local.email").validate(function(email){
    var emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    return emailRegex.test(email);
  }, "The email is invalid");

  UserSchema.pre("save", function(next){
    var user = this;

    //need to be encode
    if (this.isModified("password") || this.isNew) {
      bcrypt.genSalt(10, function(err, salt){
        console.log("-------- salt: "+salt);
        if (err) {
          //console.log("====== "+err);
          return next(err);
        }
        console.log("------user----- "+user);
        bcrypt.hash(user.local.password, salt, function(err, hash){
          if (err) {
            console.log("====== "+err);
            return next(err);
          }
          user.local.password = hash;
          next();
        });
      });
    }
  });

  UserSchema.methods.comparePassword = function(password, cb) {
    console.log(this.local.password);
    console.log(password);
    bcrypt.compare(password, this.local.password, function(err, isMatch) {
      if(err) {
        return cb(err);
      }
      cb(null, isMatch);
    })
  };

  mongoose.model('User', UserSchema);

}();
