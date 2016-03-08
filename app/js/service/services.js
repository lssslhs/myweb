+function() {
  "use strict";

  var myWebServices = angular.module("myWebServices", ["ngResource"]);

  myWebServices.factory("User",["AuthService", "Profile", function(AuthService, Profile){

    var User = {

      isAuthenticated: AuthService.isAuthenticated(),

      isAdmin: false,

      username: '',

      login: function(user) {
        var that = this;
        
        AuthService.login(user)
        .then(function(data){
          that.storeUser(data);
        }, function(err){
          console.log(err);
        });
      },

      logout: function() {
        AuthService.logout();
        this.resetUser();
      },

      register: function(data) {
        var that = this;

        AuthService.register(data)
        .then(function(data){
          that.storeUser(data);
        }, function(err){
          console.log(err);
        });
      },

      resetUser: function() {
        this.username = '';
        this.isAdmin = false;
        this.isAuthenticated = false;
      },

      storeUser: function(user) {
        this.username = user.username;
        this.isAdmin = user.isAdmin;
        this.isAuthenticated = true;
      }
    };

    if (User.isAuthenticated) {
        AuthService.getUserInfo()
        .then(function(data){
          User.storeUser(data);
        }, function(err){
          console.log(err);
        });
      }

    return User;
  }]);

myWebServices.service("AuthService", [
  "$q",
  "$http",
  "API_ENDPOINT",
  function($q, $http, API_ENDPOINT){
    var LOCAL_TOKEN_KEY = ""
    ,   isAuthenticated = false
    ,   authToken ;

    console.log("Auth service finished");

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

myWebServices.factory("Profile",["$resource",
  function($resource){
    return $resource("/auth/profile", {} , {
      update: {method: "PUT"},
      create: {method: "POST"}
    });
  }]);

}()
