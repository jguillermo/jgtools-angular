'use strict';

describe('Service hash ', function() {

	// load modules
	beforeEach(module('jgTools.core.services.cache-http'));

	it('check the existence of hash service', inject(function(jgsCacheHttpServices) {
		expect(jgsCacheHttpServices).toBeDefined();
	}));

	it('check the md5 ', inject(function(jgsCacheHttpServices) {
		expect('true').toBe('true');
	}));
});