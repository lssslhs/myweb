+function() {
  "use strict";

  var michaelServices = angular.module("michaelServices", ["ngResource"]);

  michaelServices.service("AuthService", [
    "$q",
    "$http",
    "API_ENDPOINT",
    function($q, $http, API_ENDPOINT){
      var LOCAL_TOKEN_KEY = ""
      ,   isAuthenticated = false
      ,   authToken ;

      function loadUserCredentials() {
        var token = window.localStorage.getItem(LOCAL_TOKEN_KEY);
        if (token) {
          useCredentials(token);
        }
      }

      function storeUserCredentials(token) {
        window.localStorage.setItem(LOCAL_TOKEN_KEY, token);
        useCredentials(token);
      }

      function useCredentials(token) {
        isAuthenticated = true;
        authToken = token;

        $http.defaults.headers.common.Authorization = authToken;
      }

      function destroyUserCredentials() {
        authToken = undefined;
        isAuthenticated = false;
        $http.defaults.headers.common.Authorization = undefined;
        window.localStorage.removeItem(LOCAL_TOKEN_KEY);
      }

      var register = function(user) {
        return $q(function(resolve, reject){
          $http.post(API_ENDPOINT.url + "/auth/signup", user)
          .then(function(result) {
            if (result.data.success) {
              storeUserCredentials(result.data.token);
              resolve(result.data.user);
            }
            else {
              reject(result.data.msg);
            }
          });
        });
      };

      var login = function(user) {
        return $q(function(resolve, reject) {
          $http.post(API_ENDPOINT.url + "/auth/login", user)
          .then(function(result){
            if(result.data.success) {
              storeUserCredentials(result.data.token);
              resolve(result.data.user);
            }
            else {
              reject(result.data.msg);
            }
          });
        });
      };

      var logout = function() {
        destroyUserCredentials();
      }

      var getUserInfo = function() {
        return $q(function(resolve, reject){
          $http.get(API_ENDPOINT.url + "/auth/info")
          .then(function(result){
            if (result.data.success) {
              resolve(result.data.user);
            }
            else {
              reject(result.data.msg);
            }
          }, function(err){
            reject(result.data.msg);
          });
        });
      }

      loadUserCredentials();

      return {
        getUserInfo: getUserInfo,
        login: login,
        register: register,
        logout: logout,
        isAuthenticated: function() {return isAuthenticated;},
      };

    }]);

    michaelServices.factory("Profile",["$resource",
    function($resource){
      return $resource("/auth/profile", {} , {
        update: {method: "PUT"},
        create: {method: "POST"}
      });
    }]);

  }()
