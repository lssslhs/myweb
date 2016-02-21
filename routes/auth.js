+function() {
  "use strict";

  var express = require("express")
  ,   passport = require("passport")
  ,   router = express.Router();

  var user = require("./api/user");

  router.post("/signup", user.create);

  router.post("/login", user.login);

  router.get("/info", passport.authenticate("jwt", {session:false}), user.info);

  router.use("/profile", passport.authenticate("jwt", {session:false}));

  router.get("/profile", user.getProfile);

  router.post("/profile", user.createProfile);

  router.put("/profile", user.updateProfile);

  module.exports = router;

}();
