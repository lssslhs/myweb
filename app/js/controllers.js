+function(){
  "use strict";

  var michaelControllers = angular.module("michaelControllers",["ui.bootstrap"]);

  michaelControllers.controller("NavCtrl", [
    "$rootScope",
    "$scope",
    "$uibModal",
    "$log",
    "$location",
    "AuthService",
    function($rootScope, $scope, $uibModal, $log, $location, AuthService){

      $scope.userDropdown = {
        isopen: false,
        items: [
          "profile"
        ]
      };

      if (AuthService.isAuthenticated()) {
        AuthService.getUserInfo()
        .then(function(user){
          storeUserInfo($rootScope, user);
        },function(err){
          console.log(err);
        });
      }

      $scope.logout = function() {
        AuthService.logout();
        clearUserInfo($rootScope);
        $location.url("/");
      };

      $scope.openModal = function () {

        var modalInstance = $uibModal.open({
          animation: false,
          templateUrl: "views/template/signModal.html",
          controller: "UserModalCtrl"
        });

        modalInstance.result.then(function () {
          $log.info("submit press");
        }, function () {
          $log.info('Modal dismissed at: ' + new Date());
        });
      };

    }]);

    michaelControllers.controller("UserModalCtrl",
    ["$rootScope", "$scope", "$uibModalInstance", "AuthService",
    function($rootScope, $scope, $uibModalInstance, AuthService){

      $scope.user = {
        email: "",
        username: "",
        password: ""
      };

      $scope.signup = true;

      $scope.submit = function () {
        if ($scope.signup) {
          AuthService.register($scope.user)
          .then(function(user){
            storeUserInfo($rootScope, user);
          },function(err){
            console.log(err);
          });
        }
        else {
          AuthService.login($scope.user)
          .then(function(user){
            storeUserInfo($rootScope, user);
          },function(err){
            console.log(err);
          })
        }
        $uibModalInstance.close();
      };

      $scope.close = function () {
        $uibModalInstance.dismiss();
      };

      $scope.switchState = function() {
        $scope.signup = !$scope.signup;
      };

    }]);

    michaelControllers.controller("ProfileCtrl", [
      "$rootScope", "$scope", "Profile",
      function($rootScope, $scope, Profile) {

        $scope.profile = {
          fullname: "",
          phone: "",
          gender: "male",
          email: "",
          address: "",
          foodtype: "chinese",
        };

        Profile.get(function(res){
          $scope.getprofile = res.success;
          if (res.success) {
            $scope.profile = res.profile;
          }
        });

        $scope.submit = function() {
          if(!$scope.getprofile) {
            Profile.create($scope.profile);
          }
          else {
            Profile.update($scope.profile);
          }
        }
      }
    ]);

    var storeUserInfo = function($rootScope, user) {
      $rootScope.user = user;
      $rootScope.user.isAuthenticated = true;
    };

    var clearUserInfo = function($rootScope) {
      $rootScope.user = {};
      $rootScope.user.isAuthenticated = false;
    }

  }()
