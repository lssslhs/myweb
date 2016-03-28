+function(){
  "use strict";

  var myWebControllers = angular.module("myWebControllers",["ui.bootstrap"]);

  myWebControllers.controller("NavUserCtrl",[
    "$rootScope",
    "$scope",
    "$uibModal",
    function($rootScope, $scope, $uibModal){
      $scope.userDropdown = {
        isopen: false,
        items: [
        "profile"
        ]
      };

      $scope.logout = function() {
        $rootScope.user.logout();
      };

      $scope.openModal = function () {

        var modalInstance = $uibModal.open({
          animation: true,
          templateUrl: "views/template/signModal.html",
          controller: "UserModalCtrl"
        });
      };

    }]);


  myWebControllers.controller("NavCtrl", [
    "$rootScope",
    "$scope",
    function($rootScope, $scope){
      //nothing to do now
    }]);

  myWebControllers.controller("UserModalCtrl",
    ["$rootScope", "$scope", "$uibModalInstance",
    function($rootScope, $scope, $uibModalInstance){

      $scope.user = {
        email: "",
        username: "",
        password: ""
      };

      $scope.signup = true;

      $scope.submit = function () {
        if ($scope.signup) {
          $rootScope.user.register($scope.user);
        }
        else {
          $rootScope.user.login($scope.user);
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

  myWebControllers.controller("ProfileCtrl", [
    "$rootScope", "$scope", "Profile",
    function($rootScope, $scope, Profile) {

      $scope.profile = {
        fullname: "",
        phone: "",
        gender: "male",
        email: "",
        address: "",
        foodtype: "chinese"
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

  myWebControllers.controller("AlertCtrl", ["$scope", "$uibModalInstance", "data", function($scope, $uibModalInstance, data){
    $scope.alert = {
      title: data.title,
      body: data.body
    };

    $scope.close = function() {
      $uibModalInstance.dismiss('cancel');
    }

  }]);

  myWebControllers.controller("ConfirmCtrl", ["$scope", "$uibModalInstance", "data", function($scope, $uibModalInstance, data){
    
    $scope.data = {
      title: data.title,
      body: data.body
    };

    $scope.cancel = function() {
      $uibModalInstance.dismiss('cancel');
    }

    $scope.confirm = function() {
       $uibModalInstance.close();
    }

  }]);

}()
