+function() {
	'use strict';
	var myWebDirectives = angular.module('myWebDirectives',[]);

	myWebDirectives.directive('navUser', function(){
		return {
			restrict: 'E',
			replace: true,
			scope: true,
			templateUrl: 'views/partials/navUser.html'
		}
	});

	myWebDirectives.directive('errSrc', function() {
		return {
			restrict: 'A',
			link: function(scope, element, attrs) {
				element.bind('error', function(){
					if (attrs.src != attrs.errSrc) {
          				attrs.$set('src', attrs.errSrc);
        			}
				})
			}
		}
	});
}()