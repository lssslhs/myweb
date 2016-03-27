+function() {

	var myWebFilters = angular.module('myWebFilters',[]);

	myWebFilters.filter('navUpperCase', function() {
		return function(input) {
			return input.charAt(0).toUpperCase() + input.slice(1);
		}
	});

}();