+function() {
  "use strict";

  var mongoose = require("mongoose")
  ,   Schema = mongoose.Schema;

  var testSchema = new Schema({
    message: String
  });

  mongoose.model("Test", testSchema);
}()
