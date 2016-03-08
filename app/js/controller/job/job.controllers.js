+function() {
	'use strict';

	var jobApp = angular.module('JobApp',['JobServices']);

	jobApp.controller('JobCtrl', ['$rootScope', '$scope', 'Job',
		function($rootScope, $scope, Job){
			$scope.companyName = '';

			$scope.submit = function() {
				//Job submit
			}
		}
	]);
}();