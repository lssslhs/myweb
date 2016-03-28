+function() {
	'use strict';

	var jobServices = angular.module('JobServices', ['ngResource']);

	jobServices.factory('Job', ['$resource', function($resource){
		return $resource('/auth/joblist', {}, {
			'update': {method: 'PUT'},
		});
	}]);

	jobServices.value('JobTable', {
		table: {},

		jobExist: function(job) {
			if (job.companyname === '' || job.jobid === ''){
				return false;
			}

			var list = this.table[job.companyname];
			if (list && list.indexOf(job.jobid) > -1) {
				return true;
			} 
			else {
				return false;
			}
		},

		addJob: function(job){
			if (job.companyname === '' || job.jobid === '') {
				return ;
			}

			var list = this.table[job.companyname];

			if (list) {
				list.push(job.jobid);
			}
			else {
				list = [];
				list.push(job.jobid);
				this.table[job.companyname] = list;
			}
		},

		addJobs: function(jobs) {
			for(var i in jobs) {
				if (this.jobExist(jobs[i])) {
					return false;
				}

				this.addJob(jobs[i]);
			}
			return true;
		},

		updateTable: function(ojob, njob) {

			if (ojob.companyname === njob.companyname && ojob.jobid === njob.jobid) {
				return true;
			}

			if (this.jobExist(njob)) {
				return false;
			}

			this.addJob(njob);

			this.deleteJob(ojob);

			return true;
		},

		deleteJob: function(job) {
			if (!this.jobExist(job)) {
				return ;
			}

			var list = this.table[job.companyname];
			list.splice(list.indexOf(job.jobid), 1);
		}
	});

	jobServices.filter('jobStatus', function(){
		return function(input) {
			var status = {
				0: 'Applied',
				1: 'Interview',
				2: 'Waiting',
				3: 'Accept',
				4: 'Reject'
			}

			return	status[input];
		}
	});

	jobServices.filter('jobStatusFilter', function(){
		return function(input, option) {
			/*
				0: All
				1: Applied
				2: Interview
				3: Waiting
				4: Accept
				5: Reject
			*/
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

	jobServices.filter('calDayFormat', function() {
		return function(input) {
			if(!input) {
				return ;
			}

			if (input<10) {
				return '0' + input;
			}
			else {
				return input;
			}
		}
	});

}();