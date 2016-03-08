'use strict';

describe('Movie core', function(){

	var PopularMovies
	,	$httpBackend;

	beforeEach(module('MovieCore'));
	beforeEach(inject(function(_PopularMovies_, _$httpBackend_){
		PopularMovies = _PopularMovies_;
		$httpBackend = _$httpBackend_;
	}));

	afterEach(function(){
		$httpBackend.verifyNoOutstandingExpectation();
		$httpBackend.verifyNoOutstandingRequest();
	});

	it('should create popular movie', function(){

		var expectedData = function(data) {
			//dump(angular.mock.dump(data));
			return angular.fromJson(data).movieId === 'tt0076795';
		}

		$httpBackend.expectPOST(/./, expectedData)
			.respond(201);

		var popularMovies = new PopularMovies({
			movieId: 'tt0076795',
			description: 'Great movie!'
		});

		popularMovies.$save()

		expect($httpBackend.flush).not.toThrow();
	});

	it('should get popular movie by id', function(){
		$httpBackend.expectGET('popular/tt0076795')
			.respond(200);

		PopularMovies.get({movieId: 'tt0076795'});

		expect($httpBackend.flush).not.toThrow();

	});

	it('should update popular movie', function(){
		$httpBackend.expectPUT('popular')
			.respond(200);

		var popularMovie = new PopularMovies({
			movieId : 'tt0076795',
			description: 'Great movie!!'
		});

		popularMovie.$update();

		expect($httpBackend.flush).not.toThrow();

	});

	it('should authenticate requests', function(){
		var headerData = function(headers) {
			//"authToken": "michael","Accept": "application/json, text/plain, */*"
			//dump(angular.mock.dump(headers));
			return angular.fromJson(headers).authToken === 'michael';
		}
		var matchAny = /.*/;

		$httpBackend.whenGET(matchAny, headerData)
			.respond(200);

		$httpBackend.expectPOST(matchAny, matchAny, headerData)
			.respond(200);

		$httpBackend.expectPUT(matchAny, matchAny, headerData)
			.respond(200);

		$httpBackend.expectDELETE(matchAny, headerData)
			.respond(200);

		var popularMovie = {id: 'tt0076795', description: 'Great Movie!'};
		
		PopularMovies.query();
		PopularMovies.get({id: 'tt0076795'})
		new PopularMovies(popularMovie).$save();
		new PopularMovies(popularMovie).$update();
		new PopularMovies(popularMovie).$remove();

		$httpBackend.flush();
	});
});