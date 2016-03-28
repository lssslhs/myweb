+function() {
  "use strict";

  var myWebServices = angular.module("myWebServices", ["ngResource"]);

  myWebServices.factory("User",["$route", "AuthService", "Profile", function($route, AuthService, Profile){

    var User = {

      isAuthenticated: AuthService.isAuthenticated(),

      isAdmin: false,

      username: '',

      login: function(user) {
        var that = this;
        
        AuthService.login(user)
        .then(function(data){
          that.storeUser(data);
          $route.reload();
        }, function(err){
          console.log(err);
        });
      },

      logout: function() {
        AuthService.logout();
        this.resetUser();
        $route.reload();
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

myWebServices.factory('ModalService', ['$uibModal', function($uibModal){
  return {
    openAlert: function(title, body) {
      var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: "views/template/alertModal.html",
        controller: "AlertCtrl",
        resolve : {
          data: function(){
            return {
              title: title,
              body: body
            }
          }
        }
      });
    },

    openConfirm: function(title, body) {
      var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: "views/template/confirmModal.html",
        controller: "ConfirmCtrl",
        resolve : {
          data: function(){
            return {
              title: title,
              body: body
            }
          }
        }
      });

      return modalInstance.result;
    }

  };
}]);

myWebServices.factory('CalendarHelper', function(){
  var monthNames = [ 
  "January", 
  "February", 
  "March", 
  "April", 
  "May", 
  "June",
  "July", 
  "August", 
  "September", 
  "October", 
  "November", 
  "December" 
  ];

  return {
    incrementMonth: function(calendar) {
      if (calendar.month === 11) {
        calendar.month = 0;
        calendar.year++;
      }
      else {
        calendar.month++;
      }
    },

    decrementMonth: function(calendar) {
      if (calendar.month === 0) {
        calendar.month = 11;
        calendar.year--;
      }
      else {
        calendar.month--;
      }
    },

    getCalendarDays: function(year, month) {
      var monthStartDate = new Date(year, month, 1);
      var days = [];
      var week = [];

      var dayObj = function(date, events) {
        this.date = date;
        this.events = events;
      }

      for (var idx = 0; idx < monthStartDate.getDay(); idx++) {
        week.push(new dayObj('', []));
      }
      for (var idx = 1; idx <= new Date(year, month+1, 0).getDate(); idx++) {
        if (week.length === 7) {
          days.push(week);
          week = [];
        }
        week.push(new dayObj(idx, []));
      }

      if (week.length > 0 ) {
        var remain = 7 - week.length;
        for(var i = 0; i < remain; i++) {
          week.push(new dayObj('', []));
        }
        days.push(week);
      }

      return days;
    },

    getMonthName: function(month) {
      return monthNames[month];
    }
  }
});

}()
