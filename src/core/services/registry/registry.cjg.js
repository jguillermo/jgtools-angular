(function() {
    'use strict';
    angular
        .module('jgTools.core.services.registry', []);
})();
(function() {
    'use strict';

    function jgComponentRegistry($log) {

        var instances = {};

        function isValidID(handle) {
            return handle && (handle !== "");
        }

        /**
         * Register an instance.
         * @param instance the instance to register
         * @param handle the handle to identify the instance under.
         */
        this.register = function(instance, handle) {
            if (!handle) {
                $log.error('se debe definir un handle');
                return false;
            }

            instances[handle] = instance;


            //instance.$$mdHandle = handle;
            //instances.push(instance);
            ///**
            // * Remove registration for an instance
            // */
            ////console.log(instances);
            //var index = instances.indexOf(instance);
            //console.log(index);
            //console.log(instances);
            //if (index !== -1) {
            //    instances.splice(index, 1);
            //}
            return true;



        };


        this.get = function(handle) {
            if (!isValidID(handle)) {
                return null;
            }

            if(typeof instances[handle] === "undefined" ) {
                $log.error('No instance found for handle', handle);
                return null;
            }else{
                return instances[handle];
            }

            //var i, j, instance;
            //for (i = 0, j = instances.length; i < j; i++) {
            //    instance = instances[i];
            //    if (instance.$$mdHandle === handle) {
            //        return instance;
            //    }
            //}
            return null;
        };
    }

    angular
        .module('jgTools.core.services.registry')
        .service('$jgComponentRegistry', [
            '$log',
            jgComponentRegistry
        ]);

})();