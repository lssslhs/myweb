+function() {
	'use strict';

	var jobServices = angular.module('JobServices', ['ngResource']);

	jobServices.factory('Job', ['$resource', function($resource){
		return $resource('/auth/joblist', {}, {
			'update': {method: 'PUT'},
		});
	}]);

	jobServices.filter('jobStatus', function(){
		return function(input) {
			var status = {
				0: 'Applied',
				1: 'Interviewing',
				2: 'Accept',
				3: 'Reject'
			}

			return	status[input];
		}
	});

}();