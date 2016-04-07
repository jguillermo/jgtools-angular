(function() {
    'use strict';
    angular
        .module('jgTools.core.services.scrip-async', ['jgTools.core.services.hash']);
})();
(function() {
    'use strict';

    function jgsScriptAsyncServices($q, jgsHashServices) {

        var loadingScript = {}; // tip numero 1:cargando, 2:termino de cargar, 3:error

        var resolvingWait = {};

        function issetElemtById(id) {
            var domElement = document.getElementById(id);
            if (domElement === null) {
                return false;
            } else {
                return true;
            }
        }

        function putDomScript(src, id) {
            var defered = $q.defer();
            var s = document.createElement('script');
            s.setAttribute("id", id);
            s.src = src;
            s.type = "text/javascript";
            s.async = true;

            document.body.appendChild(s);
            s.addEventListener('load', function() {

                // se termino de cargar el script
                loadingScript.id = 2; // 2: termino de cargar conforme

                // retorna que ya esta cargado el script
                //defered.resolve('la funcion nativa load ya termino');
                defered.resolve(true);

                // si existen $q pendientes se ejecutan los diferentes resolve
                if (resolvingWait.id) {
                    for (var i = 0; i < resolvingWait.id.length; i++) {
                        //resolvingWait.id[i].resolve('se dispara porque ya cargo el elemto, hijo :' + i);
                        resolvingWait.id[i].resolve(true);

                    }

                    delete resolvingWait.id;
                }


            }, false);


            s.addEventListener('error', function() {

                // se termino de cargar el script
                loadingScript.id = 3; // 3:error


                defered.reject(false);


                // si existen $q pendientes se ejecutan los diferentes resolve
                if (resolvingWait.id) {
                    for (var i = 0; i < resolvingWait.id.length; i++) {
                        //resolvingWait.id[i].resolve('se dispara porque ya cargo el elemto, hijo :' + i);
                        resolvingWait.id[i].reject(false);

                    }

                    delete resolvingWait.id;
                }

            }, false);



            return defered.promise;
        }


        /*jshint validthis: true */
        this.putScript = function(src) {

            //console.log(loadingScript);

            var defered = $q.defer();
            var id = 'jts' + jgsHashServices.md5('jt' + src); //"id-contenedor1";
            //console.log(jgsHashServices.md5(src));

            // si ya esta creado el script, occuren 2 casos
            // 1 el script aun no termina de cargar, se guarda la promesa en memoria para ser lanzada cuando acabe de cargar el script
            // 2 que el script ya termino de cargar, entonces q resolve o reject
            if (issetElemtById(id)) {
                // caso 1
                if (loadingScript.id === 1) { // 1:cargando

                    // se crea un objeto para guardar lo deferd
                    if (!resolvingWait.id) {
                        resolvingWait.id = [];
                    }
                    // se agregan los deferen
                    resolvingWait.id.push(defered);
                    //console.log(resolvingWait);
                } else {
                    // caso 2
                    if (loadingScript.id === 2) { // 2:cargo conforme
                        //defered.resolve('ya esta cargado');
                        defered.resolve(true);
                    } else { // caso 3 : error al cargar
                        defered.reject(false);
                    }

                }
            } else {
                // el script aun no esta cargado, se crea el script
                loadingScript.id = 1; // 1:cargando
                putDomScript(src, id).then(function() {
                    //cargo conforme
                    //defered.resolve('termino de cargar el script');
                    defered.resolve(true);
                }, function() {
                    // cargo con error
                    defered.reject(false);
                });
            }
            return defered.promise;

        };
    }
    angular
        .module('jgTools.core.services.scrip-async')
        .service('jgsScriptAsyncServices', [
            '$q', 'jgsHashServices',
            jgsScriptAsyncServices
        ]);
})();


(function() {
    'use strict';

    function jgsLinkAsyncServices($q, jgsHashServices, jgsCacheLinkServices) {

        //var _waitList = [];
        var _idList = {}; // lista de ids que se van a cargar o ya fueron cargados

        function issetElemtById(id) {
            if (_idList[id]) {
                return true;
            } else {
                var domElement = document.getElementById(id);
                if (domElement === null) {
                    return false;
                } else {
                    _idList[id] = true;
                    return true;
                }
            }

        }


        function putDomLink(href, id, media, callBackSuccess, callBackError) {
            var s = document.createElement('link');
            s.type = 'text/css';
            s.rel = 'stylesheet';
            s.href = href;
            s.media = "none";
            s.setAttribute("id", id);
            document.head.appendChild(s);
            s.addEventListener('load', function(e) {
                setTimeout(function() {
                    s.media = media || "all";
                });
                if (typeof callBackSuccess === "function") {
                    callBackSuccess();
                }
            }, false);

            s.addEventListener('error', function() {

                if (typeof callBackError === "function") {
                    callBackError();
                }

            }, false);
        }

        function printLink(cacheCss, id, media) {
            var s = document.createElement('style');
            s.type = 'text/css';
            s.setAttribute("id", id);
            s.innerHTML = cacheCss;
            document.head.appendChild(s);
        }

        function cacheDomLink(href, id, media, callBackSuccess, callBackError) {


            if (localStorage[id]) {
                printLink(localStorage[id], id, media);
                if (typeof callBackSuccess === "function") {
                    callBackSuccess();
                }
            } else {
                jgsCacheLinkServices
                    .saveLink(href, id)
                    .then(function(css) {
                        printLink(localStorage[id], id, media);
                        if (typeof callBackSuccess === "function") {
                            callBackSuccess();
                        }
                    }, function() {
                        if (typeof callBackError === "function") {
                            callBackError();
                        }
                    });
            }
        }

        //function addList(defered, href, id, media) {
        //    _waitList.push([defered, href, id, media]);
        //}

        /*jshint validthis: true */
        this.putLink = function(href, version, cache, media) {

            version = version || '1';
            cache = cache || false; // guarda y obtiene el css y escribe directamnete el css
            media = media || "all";

            var defered = $q.defer();
            var id =  'jgt'+version+'-'+jgsHashServices.md5(href); //"id-contenedor1";

            if (issetElemtById(id)) {
                defered.resolve(true);
            } else {
                _idList[id] = true;
                if (cache === true) {

                    cacheDomLink(href, id, media, function() {
                        defered.resolve(true);
                    }, function() {
                        defered.reject(false);
                    });

                } else {
                    putDomLink(href, id, media, function() {
                        defered.resolve(true);
                    }, function() {
                        defered.reject(false);
                    });
                }

            }
            return defered.promise;
        };
    }
    angular
        .module('jgTools.core.services.scrip-async')
        .service('jgsLinkAsyncServices', [
            '$q', 'jgsHashServices', 'jgsCacheLinkServices',
            jgsLinkAsyncServices
        ]);
})();