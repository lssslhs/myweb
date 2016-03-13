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

	jobServices.filter('jobStatusFilter', function(){
		return function(input, option) {
			if (option.id === 0) {
				return input;
			}
			else {
				return input.filter(function(job) {
					return parseInt(job.status) === option.id-1;
				});
			}
		}
	});

}();