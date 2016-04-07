'use strict';

describe('Service hash ', function() {

	// load modules
	beforeEach(module('jgTools.core.services.hash'));

	it('check the existence of hash service', inject(function(jgsHashServices) {
		expect(jgsHashServices).toBeDefined();
	}));

	it('check the md5 ', inject(function(jgsHashServices) {
		expect(jgsHashServices.md5('')).toBe('d41d8cd98f00b204e9800998ecf8427e');
		expect(jgsHashServices.md5('aeiou')).toBe('ce3730b948e9fb2145a7f1b387551979');
		expect(jgsHashServices.md5('áeiou')).toBe('72b22f05fa49c2a7cb0cb7b64eaae003');

		
	}));
});