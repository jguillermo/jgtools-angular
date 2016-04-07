(function() {
    'use strict';

    var nextUniqueId = 0;

    function utilService() {
        /**
         * Get a unique ID.
         *
         * @returns {string} an unique numeric string
         */
        this.nextUid = function() {
            return '' + nextUniqueId++;
        }
    }

    angular
        .module('jgTools.core')
        .service('$jgUtil', utilService);
})();