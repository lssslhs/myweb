
+function(){
	var movieControllers = angular.module('MovieCtrls',['omdb', 'MovieCore', 'ui.bootstrap']);

	movieControllers.controller('MovieMainCtrl', ["$scope", "MovieTemplate", function($scope, MovieTemplate){

		$scope.template = MovieTemplate;

		$scope.setSelected = function(index) {
			$scope.selected = index;
			switch(index) {
				case 0:
					$scope.template.setTemplate('populars');
					break;
				case 1:
					$scope.template.setTemplate('movielist');
					break;
				case 2:
					$scope.template.setTemplate('results');
					break;
				default:
					$scope.template.setTemplate('populars');
			};
		}

		$scope.setSelected(0);

		$scope.$on('movie:getResult', function(evet, results){
			$scope.results = results.Search;
			$scope.setSelected(2);
		});
	}]);

	movieControllers.controller('MoviePopularCtrl', ['$scope', '$interval', 'omdbApi', 'PopularMovies', 
		function($scope, $interval, omdbApi, PopularMovies){

			//XXX hard coded now
			var results = ["tt0076759", "tt0080684", "tt0086190"]
			,	slideId = 0;


			//for config carousel
			$scope.slideIndex = 0;
			$scope.slideInterval = 3000;
			$scope.slides = [];
			$scope.noWrapSlides = false;

			var findMovie = function(id) {
				omdbApi.find(id)
					.then(function(data) {
						data.id = slideId;
						slideId++;
						$scope.addSlide(data);
					})
					.catch(function(err){
						console.log(err);
					})
			};

			$scope.addSlide = function(data) {
				$scope.slides.push(data);
			}

			//findMovie(results[0]);
			for(var i=0; i<results.length; i++) {
				findMovie(results[i]);
			}

			//PopularMovies.get()
			//	.then(function(data){
					//results = data;
					// results = ["tt0076759", "tt0080684", "tt0086190"];
					// findMovie(results[0]);
					// $interval(function(){
					// 	index++;
					// 	findMovie(results[index % results.length]);
					// }, 5000);
			//	});


		}]);


	movieControllers.controller('SearchCtrl', ['$scope', '$timeout', 'omdbApi',
		function($scope, $timeout, omdbApi){
			var timeoutFn ;

			$scope.query = '';

			$scope.keyup = function(){
				timeoutFn = $timeout(function(){
					$scope.search();
				},1000);
			}

			$scope.keydown = function() {
				$timeout.cancel(timeoutFn)
			}

			$scope.search = function() {
				if($scope.query) {
					$timeout.cancel(timeoutFn);
					omdbApi.search($scope.query)
					.then(function(data){
						$scope.$emit('movie:getResult', data);
					})
					.catch(function(err){
						console.log(err);
					});
				}
			}
		}]);

	movieControllers.controller('ResultCtrl',["$scope", "omdbApi",
		function($scope, omdbApi){
			$scope.$watch('results', function(){
				if ($scope.results) {
					for(var i=0; i<$scope.results.length; i++) {
						findMovie($scope.results[i].imdbID, i);
					}
				}
			});

			$scope.changeTemplate = function(name) {
				$scope.template.setTemplate(name);
			}

			var findMovie = function(id , index){
				omdbApi.find(id)
				.then(function(data){
					$scope.results[index].data = data; 
				});
			}
		}]);
}();