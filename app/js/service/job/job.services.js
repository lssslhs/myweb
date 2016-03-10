+function() {
	'use strict';

	var jobServices = angular.module('JobServices', ['ngResource']);

	jobServices.factory('Job', ['$resource', function($resource){
		return $resource('/auth/joblist', {}, {
			'update': {method: 'PUT'},
		});
	}]);

}();