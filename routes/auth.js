+function() {
  "use strict";

  var express = require("express")
  ,   passport = require("passport")
  ,   router = express.Router();

  var user = require("./api/user");

  router.post("/singup", user.create);
  //router.get("/user/:userId", user.get);

  module.exports = router;

}();
