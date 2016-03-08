describe('Movie Result Directive', function(){

	var result = {
		Poster: 'http://localhost/image.jpg',
		Title: 'Star wars 4',
		Plot: 'A Plot',
		Director: 'George Lucas',
		Actors: 'A, B and C',
		Release: '25 May 1977',
		Genre: 'Action, Fantasy, Adventure'
	};

	var expectedHTML = [
		'<div class="col-sm-4">',
			'<img ng-src="http://localhost/image.jpg" alt="Star wars 4" width="220" src="http://localhost/image.jpg">',
		'</div>',
		'<div class="col-sm-8">',
			'<h3 class="ng-binding">Star wars 4</h3>',
			'<p class="ng-binding"><strong>Plot:</strong> A Plot</p>',
			'<p class="ng-binding"><strong>Director:</strong> George Lucas</p>',
			'<p class="ng-binding"><strong>Actors:</strong> A, B and C</p>',
			'<p class="ng-binding"><strong>Release:</strong> 25 May 1977</p>',
			'<p class="ng-binding"><strong>Genre:</strong> Action, Fantasy, Adventure</p>',
		'</div>'
	].join('');

	var $scope
	,	$compile
	,	$rootScope;

	beforeEach(module('MovieDirectives'));
	beforeEach(inject(function(_$compile_, _$rootScope_, _$templateCache_){
		$rootScope = _$rootScope_;
		//$scope = $rootScope.$new();
		$compile = _$compile_;
	}));

	it('should output movie result to expect HTML format', function(){
		var element;
		$rootScope.result = result;
		element = $compile('<movie-result result="result"></movie-result>')($rootScope);
		$rootScope.$digest();
		expect(element.html()).toBe(expectedHTML);
	});

});