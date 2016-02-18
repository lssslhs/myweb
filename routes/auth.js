+function() {
  "use strict";

  var express = require("express")
  ,   passport = require("passport")
  ,   router = express.Router();

  var user = require("./api/user");

  router.post("/signup", user.create);

  router.post('/auth', user.auth);

  //router.get('/info', user.getInfo);

  router.get('/info', passport.authenticate("jwt", {session: false}), user.getInfo);

  module.exports = router;

}();
