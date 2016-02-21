+function() {
  "use strict";

  var michaelApp = angular.module("michaelApp", [
    "ngRoute",
    "michaelControllers",
    "michaelConstants",
    "michaelServices"
  ]);

  michaelApp.config([
    "$routeProvider", "$locationProvider",
    function($routeProvider, $locationProvider){
      //config to use angular route
      $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
      });
      $routeProvider.
      when('/profile',{
        templateUrl: 'views/partials/profile.html',
        controller: 'ProfileCtrl',
        resolve: {
          authorize: ["$location", "AuthService",
           function($location, AuthService){
             if (!AuthService.isAuthenticated()) {
               $location.path("/");
             }
           }]
        }
      }).
      otherwise({
        redirectTo: '/'
      });
    }]);

    michaelApp.run(["$rootScope", "$location", function ($rootScope, $location) {

      console.log("app run");

      $rootScope.user = {
        isAuthenticated: false
      };

    }]);

  }();
