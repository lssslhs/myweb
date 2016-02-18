+function() {
  "use strict";

  var michaelConstants = angular.module("michaelConstants", []);

  michaelConstants.constant("API_ENDPOINT", {
    url: "http://localhost:3002"
  });

  michaelConstants.constant("AUTH_EVENTS", {
    notAuthenticated: 'auth-not-authenticated'
  });
}();
