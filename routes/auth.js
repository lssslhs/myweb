+function() {
  "use strict";

  var express = require("express")
  ,   passport = require("passport")
  ,   router = express.Router();

  var user = require("./api/user")
  ,   joblist = require("./api/joblist");

  router.post("/signup", user.create);

  router.post("/login", user.login);

  router.get("/info", passport.authenticate("jwt", {session:false}), user.info);

  router.route("/profile", passport.authenticate("jwt", {session:false}))
          .get(user.getProfile)
          .post(user.createProfile)
          .put(user.updateProfile);

 router.route("/joblist", passport.authenticate("jwt", {session:false}))
          .get(joblist.getJoblist)
          .post(joblist.create)
          .put(joblist.updateJob)
          .delete(joblist.deleteJob);

  module.exports = router;

}();
