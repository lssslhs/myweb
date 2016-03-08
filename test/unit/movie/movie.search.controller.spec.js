'use strict';

describe('Movie search controller', function(){
	var $scope
	,	$rootScope
	,	omdbApi;

	beforeEach(module('MovieCtrls'));

	beforeEach(inject(function(_$controller_, _$rootScope_, _omdbApi_){
		$scope = {};
		$rootScope = _$rootScope_;
		omdbApi = _omdbApi_;
		_$controller_('SearchCtrl', {$scope: $scope, $rootScope: $rootScope, omdbApi: omdbApi});
	}));

});