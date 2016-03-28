+function() {
	'use strict';

	var jobApp = angular.module('JobApp',['JobServices']);

	jobApp.controller('JobCtrl', ['$rootScope', '$scope', 'Job', 'JobTable', 'ModalService',
		function($rootScope, $scope, Job, JobTable, ModalService){
			$scope.jobDetail = {
				companyname: '',
				location: '',
				jobtitle: '',
				applydate: new Date(),
				status: 0,
				jobid: '',
				haveinterview: false,
				interviewtime: new Date()
			};

			$scope.closeInterview = function(){
				$scope.jobDetail.haveinterview = false;
			}

			var templates = [
				{name: 'joblist', url: 'views/partials/job/joblist.html'},
				{name: 'calendar', url: 'views/partials/job/jobcalendar.html'}
			];


			$scope.template = {
				name: '',

				url: '',

				setUrl: function(index) {
					this.url = templates[index].url;
					this.name = templates[index].name;
				}
			}

			$scope.template.setUrl(0);

			$scope.statusOptions = {
				options: [
				{id: 0, name: 'Applied'},
				{id: 1, name: 'Interview'},
				{id: 2, name: 'Waiting'},
				{id: 3, name: 'Accept'},
				{id: 4, name: 'Reject'}
				],

				selected: {id: 0, name: 'Applied'}
			};

			$scope.statusFilterOptions = {
				options: [
				{id: 0, name: 'All'},
				{id: 1, name: 'Applied'},
				{id: 2, name: 'Interview'},
				{id: 3, name: 'Waiting'},
				{id: 4, name: 'Accept'},
				{id: 5, name: 'Reject'}
				],

				selected : {id: 0, name: 'All'}
			};

			var joblistOptions = {
				0: 'companyname',
				1: 'jobtitle',
				2: 'interviewtime',
				3: 'status'
			}

			$scope.joblistOption = joblistOptions[2];

			$scope.setListOrder = function(index) {

				if ($scope.joblistOption === joblistOptions[index]) {
					//toggle dec or ace
					$scope.joblistOption = '-' + joblistOptions[index];
					return ;
				}

				$scope.joblistOption = joblistOptions[index];
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
				console.log('submit press');
				console.log($scope.jobDetail);

				if (!$rootScope.user.isAuthenticated) {
					var title = 'You have not signed in yet';
					var body = 'Please sign up as user or sign in';
					ModalService.openAlert(title, body);
					return ;
				}

				if (JobTable.jobExist($scope.jobDetail)) {
					var title = 'Job ID already exsit!';
					var body = 'You already applied this job before!';
					ModalService.openAlert(title, body);
					return ;
				}

				if ($scope.jobDetail.haveinterview && $scope.jobDetail.interviewtime < $scope.jobDetail.applydate) {
					var title = 'Interview date time is wrong!';
					var body = 'Interview date before Apply date?';
					ModalService.openAlert(title, body);
					return ;
				}

				Job.save($scope.jobDetail).$promise
				.then(function(data){
					$scope.joblist.unshift(data.job);
					JobTable.addJob(data.job);
					$scope.$broadcast('getJobList', $scope.joblist);
				});
			}

			$scope.getPanelInfo = function(status) {
				var panelClass = {
					0: 'panel-default',
					1: 'panel-info',
					2: 'panel-warning',
					3: 'panel-success',
					4: 'panel-danger'
				}

				return panelClass[status];
			}

			$scope.openEdit = function(job) {
				job.isEdit = true;

				job.pop = {
					apply: false,
					interview: false
				};

				job.statusOptions = {
					options: [
					{id: 0, name: 'Applied'},
					{id: 1, name: 'Interview'},
					{id: 2, name: 'Waiting'},
					{id: 3, name: 'Accept'},
					{id: 4, name: 'Reject'}
					],

					selected: {}
				}

				for (var i in job.statusOptions.options) {
					if (job.statusOptions.options[i].id === parseInt(job.status)) {
						job.statusOptions.selected = job.statusOptions.options[i];
						break;
					}
				}

				job.temp = {
					companyname : job.companyname,
					jobid: job.jobid,
					jobtitle: job.jobtitle,
					status : job.status,
					location: job.location,
					applydate: job.applydate,
					interviewtime: job.interviewtime
				};

			};

			$scope.closeEdit = function(job) {
				job.isEdit = false;

				job.pop = {
					apply: false,
					interview: false
				};
			}

			$scope.saveJob = function(job) {
				//make sure job id not duplicate
				if (!JobTable.updateTable(job, job.temp)) {
					var title = 'Job ID already exsit!';
					var body = 'You already applied this job before!';
					ModalService.openAlert(title, body);
					return ;
				}

				job.isEdit = false;
				job.pop = {
					apply: false,
					interview: false
				};

				for(var prop in job.temp) {
					if (job.temp.hasOwnProperty(prop)) {
						job[prop] = job.temp[prop];
					}
				}
				job.status = job.statusOptions.selected.id;
				delete job.temp;
				Job.update(job);
			};

			$scope.deleteJob = function(job) {
				var title = 'Delete Job!';
				var body = 'Are you sure you want to delete the job?';
				var result = ModalService.openConfirm(title, body);

				//console.log(result.then);

				result.then(function(){
					Job.delete({jid: job.id}).$promise
					.then(function(data) {
						var index = $scope.joblist.indexOf(job);
						if (index > -1) {
							$scope.joblist.splice(index, 1);
						}
						JobTable.deleteJob(job);
					});
				},function(){
					console.log('job delete cancel');
				});
			}

			Job.get().$promise.then(function(data){
				if (data.success) {
					$scope.joblist = data.joblist;
					JobTable.addJobs(data.joblist);
					$scope.$broadcast('getJobList', data.joblist);
				}
				else {
					$scope.joblist = [];
				}
			});
		}
		]);

	jobApp.controller('CalendarCtrl',['$scope', '$interval', 'CalendarHelper',function($scope, $interval, CalendarHelper){
		var d = new Date();
		$scope.calendar = {
			year: d.getFullYear(),
			month: d.getMonth(),
			monthName: CalendarHelper.getMonthName(d.getMonth())
		};

		function updateTime () {
			if ($scope.events.length > 0) {
				var oneDay = 24*60*60*1000;
				var oneHour = oneDay/24;
				var oneMin = oneHour/60;
				for(var i =0; i<$scope.events.length; i++) {
					var interviewtime = new Date($scope.events[i].interviewtime);
					var curDate = new Date();
					if (interviewtime > curDate) {
						var daydiff = Math.floor((interviewtime - curDate)/oneDay);
						var hourdiff = Math.floor((interviewtime - curDate - daydiff*oneDay)/oneHour);
						var mindiff = Math.round( (interviewtime - curDate - daydiff*oneDay - hourdiff*oneHour)/oneMin);
						$scope.events[i].timeleft = daydiff + ' days'+' '+hourdiff+' hours'
														+' '+mindiff +' mins';
					}
					else {
						$scope.events[i].timeleft = 'pass';
					}
				}
			}
		}

		var timer = $interval(updateTime, 1000);

		$scope.days = CalendarHelper.getCalendarDays(d.getFullYear(), d.getMonth());
		$scope.events = [];

		$scope.nextMonth = function() {
			CalendarHelper.incrementMonth($scope.calendar);
			$scope.calendar.monthName = CalendarHelper.getMonthName($scope.calendar.month);
			$scope.days = CalendarHelper.getCalendarDays($scope.calendar.year, $scope.calendar.month);
			$scope.insertEvents();
		};

		$scope.preMonth = function() {
			CalendarHelper.decrementMonth($scope.calendar);
			$scope.calendar.monthName = CalendarHelper.getMonthName($scope.calendar.month);
			$scope.days = CalendarHelper.getCalendarDays($scope.calendar.year, $scope.calendar.month);
			$scope.insertEvents();
		};

		$scope.nextYear = function() {
			$scope.calendar.year++;
			$scope.days = CalendarHelper.getCalendarDays($scope.calendar.year, $scope.calendar.month);
			$scope.insertEvents();
		};

		$scope.preYear = function() {
			$scope.calendar.year--;
			$scope.days = CalendarHelper.getCalendarDays($scope.calendar.year, $scope.calendar.month);
			$scope.insertEvents();
		};

		$scope.insertEvents = function(){
			if (!$scope.joblist) {
				return ;
			}
			var shift = new Date($scope.calendar.year, $scope.calendar.month, 1).getDay();
			for(var i=0; i<$scope.joblist.length; i++) {
				if (!$scope.joblist[i].haveinterview) {
					continue;
				}
				var curDate = new Date($scope.joblist[i].interviewtime);
				if (curDate.getMonth() === $scope.calendar.month && curDate.getFullYear() === $scope.calendar.year) {
					var week = Math.floor((curDate.getDate() + shift)/7);
					$scope.days[week][curDate.getDay()].events.push($scope.joblist[i]);
				}
			}
		}

		$scope.insertEvents();

		$scope.showEvents = function(events) {
			$scope.events = events;
		}

		$scope.$on('$destroy',function(){
			$interval.cancel(timer);
		});

		$scope.$on('getJobList', function(event, joblist){
			$scope.joblist = joblist;
			console.log(joblist);
			$scope.days = CalendarHelper.getCalendarDays($scope.calendar.year, $scope.calendar.month);
			$scope.insertEvents();
		});

	}]);

}();