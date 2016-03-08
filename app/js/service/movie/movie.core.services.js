+function() {
	'use strict';

	var movieCore = angular.module('MovieCore',['ngResource']);

	movieCore.factory('PopularMovies', function($resource){
		var token = "michael";
		return $resource('popular/:movieId', {movieId: '@id'}, {
			update: {
				method: 'PUT',
				headers: { 'authToken': token}
			},
			get: {
				method: 'GET',
				headers: { 'authToken': token}
			},
			query: {
				method: 'GET',
				headers: { 'authToken': token}
			},
			save: {
				method: 'POST',
				headers: { 'authToken': token}
			},
			remove: {
				method: 'DELETE',
				headers: { 'authToken': token}
			},
		});
	});

	movieCore.factory('MovieTemplate', function(){
		var templateUrl = {
			populars: '/views/partials/movie/populars.html',
			results: '/views/partials/movie/results.html'
		};

		var MovieTemplate = {
			url: '',

			setTemplate: function(name) {
				this.url = templateUrl[name];
			},
		}

		return MovieTemplate;
	});

}();