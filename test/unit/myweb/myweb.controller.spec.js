"user strict"

describe("michael controllers", function(){
  // beforeEach(function(){
  //   this.addMatchers({
  //     toEqualData: function(expected) {
  //       return angular.equals(this.actual, expected);
  //     }
  //   });
  // });

  // beforeEach(module("michaelApp"));
  // beforeEach(module("michaelServices"));

  // describe("NavCtrl", function() {
  //   var rootScope, scope, ctrl, rootScope, httpBackend;

  //   beforeEach(inject(function($httpBackend, $rootScope, $controller){
  //     httpBackend = $httpBackend;
  //     rootScope = $rootScope;
  //     scope = $rootScope.$new();
  //     ctrl = $controller("NavCtrl", {$scope: scope});
  //   }));

  //   it("should set the default value of userDropdown", function(){
  //     expect(scope.userDropdown.isopen).toBe(false);
  //     expect(scope.userDropdown.items).toEqual(["profile"]);
  //   });

  //   it("should get user auth state", function(){
  //     expect(rootScope.user).toBeUndefined();
      
  //   });

  // });
  it('should return true', function(){
    expect(true).toBe(true);
  });
});
