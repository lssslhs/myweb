+function() {
	'use strict';

	var jobApp = angular.module('JobApp',['JobServices']);

	jobApp.controller('JobCtrl', ['$scope', 'Job',
		function($scope, Job){
			$scope.jobDetail = {
				companyname: '',
				location: '',
				jobtitle: '',
				applydate: new Date(),
				status: 0,
				jobid: '',
				interviewtime: new Date()
			};

			$scope.statusOptions = {
				options: [
					{id: 0, name: 'Applied'},
					{id: 1, name: 'Interviewing'},
					{id: 2, name: 'Accept'},
					{id: 3, name: 'Reject'}
				],

				selected: {id: 0, name: 'applied'}
			};

			$scope.statusFilterOptions = {
				options: [
					{id: 0, name: 'All'},
					{id: 1, name: 'Applied'},
					{id: 2, name: 'Interviewing'},
					{id: 3, name: 'Accept'},
					{id: 4, name: 'Reject'}
				],

				selected : {id: 0, name: 'All'}
			}

			$scope.dateFormats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
  			$scope.format = $scope.dateFormats[0];
  			$scope.altInputFormats = ['M!/d!/yyyy'];

  			$scope.pop = {
  				apply : false,
  				interview: false
  			};

			$scope.openApply = function (target) {
				if (target) {
					target.pop.apply = true;
				}
				else {
					$scope.pop.apply = true;
				}
			};

			$scope.setStatus = function(selected) {
				$scope.jobDetail.status = selected.id;
			};

			$scope.openInterview = function (target) {
				if (target) {
					target.pop.interview = true;
				}
				else {
					$scope.pop.interview = true;
				}
			};

			$scope.submit = function() {
				//Job submit
				console.log('submit press');
				console.log($scope.jobDetail);
				Job.save($scope.jobDetail).$promise
					.then(function(data){
						$scope.joblist.unshift(data.job);
				});
			}

			$scope.getPanelInfo = function(status) {
				var panelClass = {
					0: 'panel-default',
					1: 'panel-info',
					2: 'panel-success',
					3: 'panel-danger'
				}

				return panelClass[status];
			}

			$scope.openEdit = function(job) {
				job.isEdit = true;
				job.pop = {
					apply: false,
					interview: false
				};
			};

			$scope.saveJob = function(job) {
				job.isEdit = false;
				job.pop = {
					apply: false,
					interview: false
				};
				Job.update(job);
			};

			$scope.deleteJob = function(job) {
				Job.delete({jid: job.id}).$promise
					.then(function(data) {
						var index = $scope.joblist.indexOf(job);
						if (index > -1) {
							$scope.joblist.splice(index, 1);
						}
					});
			}

			Job.get().$promise.then(function(data){
				if (data.success) {
					$scope.joblist = data.joblist;
				}
				else {
					$scope.joblist = [];
				}
			});
		}
	]);
}();