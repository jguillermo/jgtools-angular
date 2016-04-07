'use strict';

describe('Service utf8 ', function() {

	// load modules
	beforeEach(module('jgTools.core.services.utf8'));

	it('check the existence of Phone factory', inject(function(jgsUtf8Services) {
		expect(jgsUtf8Services).toBeDefined();
	}));

	it('check the encode ', inject(function(jgsUtf8Services) {
		expect(jgsUtf8Services.encode('qwe')).toBe('qwe');
		expect(jgsUtf8Services.encode('áeiou')).toBe('Ã¡eiou');
	}));
});