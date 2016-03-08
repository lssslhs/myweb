+function() {
  "use strict";

  var myWebConstants = angular.module("myWebConstants", []);

  myWebConstants.constant("API_ENDPOINT", {
    url: "http://localhost:3002"
  });

  myWebConstants.constant("AUTH_EVENTS", {
    notAuthenticated: 'auth-not-authenticated'
  });
}();
