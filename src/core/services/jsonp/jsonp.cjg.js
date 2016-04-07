(function() {
    'use strict';
    angular
        .module('jgTools.core.services.jsonp', ['jgTools.core.services.hash']);
})();
(function() {
    'use strict';
    sessionStorage.removeItem('jgs-cachehttp');

    function jgsJsonpServices($http, $q, jgsHashServices) {

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



        this.jsonp = function(url, data, cache) {



            var href = url + '?callback=JSON_CALLBACK';

            if (typeof data === "undefined") {
                // no esta definido la data, el cache es false
                cache = false;
            } else {

                if (typeof data == "boolean") {
                    // se puso un booleano en ellugar de la cache, entonces data es caache
                    cache = data;
                } else {
                    // si se ingreso datos, se agregan los datos en formato de array
                    href += "&data=" + encodeURIComponent(angular.toJson({
                        data: data
                    }));

                    // si el cache es de tipo booleano entonces se graba, caso contrario es false
                    if(typeof cache !== "boolean"){
                        
                        cache =  false;
                    }
                }
            }



            if (cache) {
                // se debe mojorar este script, 
                // al hacer varias llamas al mismo tiempo, se van a aser todas las llamas al servidor

                var defered = $q.defer();

                var id = 'jgs-ch' + jgsHashServices.md5(href);

                var cache = getCache(id);
                if (cache === null) {
                    $http.jsonp(href).then(
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
            } else {
                return $http.jsonp(href);
            }



        };
    }
    angular
        .module('jgTools.core.services.jsonp')
        .service('jgsJsonpServices', [
            '$http', '$q', 'jgsHashServices',
            jgsJsonpServices
        ]);
})();