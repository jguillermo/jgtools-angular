(function() {
    'use strict';
    angular
        .module('jgTools.core.services.cache-http', ['jgTools.core.services.hash']);
})();
(function() {
    'use strict';

    sessionStorage.removeItem('jgs-cachehttp');

    function jgsCacheLinkServices($http, $q, jgsHashServices) {

        /**
         * obtiene los datos de la memoria cache si existe
         * @param  {string} id md5 de la ruta
         * @return {nuu|| obj}    no existe || el dato de la memoria cache 
         */
        function getCache(id) {
            var cache = {};
            if (sessionStorage['jgs-cachehttp']) {
                cache = JSON.parse(sessionStorage['jgs-cachehttp']);
            }

            if (typeof cache[id] !== "undefined") {

                return cache[id];
            } else {

                return null;
            }
        }

        /**
         * guarda ol obj en la memoria cache
         * @param {string} id   md5 de la ruta
         * @param {obj} data respusta de la lalamda ajax
         */
        function setCache(id, data) {
            var cache = {};
            if (sessionStorage['jgs-cachehttp']) {
                cache = JSON.parse(sessionStorage['jgs-cachehttp']);
            }
            cache[id] = {
                data: data
            };
            sessionStorage['jgs-cachehttp'] = angular.toJson(cache);
        }

        /**
         * guarda el obj que retorna de un ajax, 
         * se debe usar esta funcion cuando se desea guardar informacion pequeña
         * como los tipos de telefono o algun otro dato parecido
         * @param  {string} href ruta a buscar
         * @return {$q}      retorna un promesa
         */
        this.http = function(href) {

            // se debe mojorar este script, 
            // al hacer varias llamas al mismo tiempo, se van a aser todas las llamas al servidor
            
            var defered = $q.defer();

            var id = 'jgs-ch' + jgsHashServices.md5(href);

            var cache = getCache(id);
            if (cache === null) {
                $http.post(href).then(
                    function(rpta) {
                        setCache(id, rpta.data);
                        defered.resolve({
                            data: rpta.data
                        });
                    },
                    function() {
                        defered.reject(false);
                    });
            } else {
                defered.resolve(cache);
            }
            return defered.promise;

        };
    }
    angular
        .module('jgTools.core.services.cache-http')
        .service('jgsCacheHttpServices', [
            '$http', '$q', 'jgsHashServices',
            jgsCacheLinkServices
        ]);
})();