+function() {
	'use strict';

	var movieDirectives = angular.module('MovieDirectives',[]);

	movieDirectives.directive('movieDetail', function(){
		return {
			restrict: 'E',
			replace: true,
			scope: {
				result: '=result'
			},
			templateUrl: 'views/partials/movie/movie-detail.html'
		}
	});

	movieDirectives.directive('cutText', function(){
		return {
			restrict: 'A',
			scope: {
				origintext: '=',
				max: '='
			},
			link: function(scope, elem, attrs) {
				var text 
				,	expandElem
				,	closeElem;

				expandElem = angular.element('<span style="color:#337ab7; cursor:pointer"> more...</span>');
				expandElem.on('click', function(){
					elem.context.innerText = text;
					elem.append(closeElem);
				});

				closeElem = angular.element('<span style="color:#337ab7; cursor:pointer"> close</span>');
				closeElem.on('click', function(){
					elem.context.innerText = trunc(scope.max, text, true);
					elem.append(expandElem);
				})

				scope.$watch('origintext', function(){
					if (!scope.origintext) {
						return ;
					}
					text = scope.origintext;
					elem.context.innerText = trunc(scope.max, text, true);
					if (elem.context.innerText === text) {
						return ;
					}
					elem.append(expandElem);
				});

				function trunc(n, text, useWordBoundary) {
					if (!text) {
						return '';
					}
			    	var toLong = text.length > n,
			    	s_ = toLong ? text.substr(0, n-1) : text;
			    	s_ = useWordBoundary && toLong ? s_.substr(0, s_.lastIndexOf(' ')) : s_;
			    	return s_;
			    }
			}
		}
	})
}();