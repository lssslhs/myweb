+function() {
  "user strict";

  var mongoose = require("mongoose")
  ,   Schema = mongoose.Schema;

  var ProfileSchema = new Schema({
    user_id: {
      type: String,
      unique: true,
      required: true
    },

    fullname: {
      type: String,
      default: ""
    },

    email: {
      type: String,
      default: ""
    },

    phone: {
      type: String,
      default: 0
    },

    gender: {
      type: String,
      default: "male"
    },

    foodtype: {
      type: String,
      default: "chinese"
    },

    address: {
      type: String,
      default: ""
    }
  });

  ProfileSchema.path("email").validate(function(email){
    var emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    return emailRegex.test(email);
  }, "The email is invalid");

  ProfileSchema
  .virtual("profileInfo")
  .get(function(){
    return {
      fullname: this.fullname,
      email: this.email,
      phone: this.phone,
      gender: this.gender,
      foodtype: this.foodtype,
      address: this.address
    };
  });

  mongoose.model("Profile", ProfileSchema);

}();
