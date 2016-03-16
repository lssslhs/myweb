+function() {
  "use strict";

  var myWebApp = angular.module("myWebApp", [
    "ngRoute",
    "ngAnimate",
    "myWebControllers",
    "myWebConstants",
    "myWebDirectives",
    "myWebServices",
    "Movie",
    "JobApp"
  ]);

  myWebApp.config([
    "$routeProvider", "$locationProvider",
    function($routeProvider, $locationProvider){
      //config to use angular route
      $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
      });
      $routeProvider
      .when('/profile',{
        templateUrl: '/views/partials/profile.html',
        controller: 'ProfileCtrl',
        resolve: {
          authorize: ["$location", "$rootScope",
           function($location, $rootScope){
             if (!$rootScope.user.isAuthenticated) {
               $location.path("/");
             }
           }]
        }
      })
      .when('/job', {
        templateUrl: '/views/partials/job/job.html',
        controller: 'JobCtrl',
      })
      .when('/movie', {
        templateUrl: '/views/partials/movie/movie.html',
        controller: 'MovieMainCtrl',
      })
      .otherwise({
        redirectTo: '/'
      });
    }]);

    myWebApp.run(["$rootScope", "AuthService", "User", function ($rootScope, AuthService, User) {

      console.log("app run");

      $rootScope.user = User;

    }]);

  }();
