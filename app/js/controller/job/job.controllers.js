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

			$scope.statusItems = [
				{value: 0, name: 'applied'},
				{value: 1, name: 'interviewing'},
				{value: 2, name: 'accept'},
				{value: 3, name: 'reject'}
			];

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

			$scope.setStatus = function(index) {
				$scope.jobDetail.status = index;
			}

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