(function() {
    'use strict';
    angular
        .module('jgTools.core.services', [
        	'jgTools.core.services.config',
        	'jgTools.core.services.utf8',
        	'jgTools.core.services.hash',
        	'jgTools.core.services.registry',
        	'jgTools.core.services.scrip-async',
        	'jgTools.core.services.cache-link',
            //'jgTools.core.services.cache-http',
            'jgTools.core.services.jsonp'
        ]);
})();