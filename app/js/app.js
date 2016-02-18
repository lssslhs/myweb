+function() {
  "use strict";

  var michaelApp = angular.module("michaelApp", [
    "ngRoute",
    "michaelControllers",
    "michaelConstants",
    "michaelServices"
  ]);

  michaelApp.config(["$httpProvider", function($httpProvider){
    $httpProvider.interceptors.push('AuthInterceptor');
  }]);

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
        needAuth: true
      }).
      otherwise({
        redirectTo: '/'
      });
    }]);

    michaelApp.run(["$rootScope", "$location", "AuthService", function ($rootScope, $location, AuthService) {

      $rootScope.user = {
        email: "",
        username: "",
        isAuthenticated: false,
        isAdmin: false
      };

      if (AuthService.isAuthenticated()) {
        AuthService.getUserInfo()
        .then(function(user){
          storeUserInfo($rootScope, user);
          console.log($rootScope.user);
        },function(err){
          console.log(err);
        });
      }

      $rootScope.$on('$routeChangeStart', function (event, to, ee) {
        console.log("route change start");
        if(to.needAuth && !$rootScope.user.isAuthenticated) {
          $location.url("/");
        }
      });
    }]);

  }();
