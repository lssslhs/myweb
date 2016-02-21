+function() {
  "use strict";

  var mongoose = require("mongoose")
  ,   Schema = mongoose.Schema
  ,   bcrypt = require("bcrypt");

  var UserSchema = new Schema({
    local: {
      username: {
        type: String,
        unique: true,
        required: true
      },
      password: {
        type: String,
        required: true
      }
    },

    isAdmin: {
      type: Boolean,
      default: false
    }
  });

  UserSchema
  .virtual("infoLocal")
  .get(function(){
    return {
      "username": this.local.username,
      "isAdmin": this.isAdmin
    };
  });

  UserSchema.pre("save", function(next){
    var user = this;

    //need to be encode
    if (this.isModified("password") || this.isNew) {
      bcrypt.genSalt(10, function(err, salt){
        if (err) {
          return next(err);
        }
        bcrypt.hash(user.local.password, salt, function(err, hash){
          if (err) {
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
