(function(){
  'use strict';
  angular
    .module('jgTools.core',['jgTools.core.services']);
})();
(function(){
  'use strict';
  angular
    .module('jgTools',['ui.bootstrap','jgTools.core','jgTools.components']);
})();
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
(function() {
    'use strict';
    angular
        .module('jgTools.core.services.cache-link', []);
})();
(function() {
    'use strict';

    function jgsCacheLinkServices($http, $q) {

        /**
         * se van a borrar todos los recursos que no esten en lalista, 
         * esto se hace para borrar archivos antiguos 
         * @param  {array} resourcesCache lista de md5 que son los nombre de los archivos de este
         * @return {bool}                true
         */
        this.deleteOldVersion = function(currentVersion) {


            //var id =  'jgt'+version+'-'+jgsHashServices.md5(href); //"id-contenedor1";

            var t = localStorage.length,
                i;
            var lsclear = [];
            for (i = 0; i < t; i++) {
                var key = localStorage.key(i);
                //console.log('key.substring(0, 3)')
                //console.log(key.substring(0, 3));
                if (key.substring(0, 3) === 'jgt') {
                    var guion = key.indexOf('-');
                    //console.log('guion');
                    //console.log(guion);
                    if (guion !== -1) {
                        
                        //console.log('key.substring(3, guion)')
                        //console.log(key.substring(3, guion));
                        if (key.substring(3, guion) !== currentVersion) {
                            lsclear.push(key);
                        }
                    }
                    
                }
            }

            //console.log('lsclear');
            //console.log(lsclear);
            t = lsclear.length;

            for (i = 0; i < t; i++) {
                localStorage.removeItem(lsclear[i]);
            }
            return true;
        };

        this.saveLink = function(href, name) {

            var defered = $q.defer();


            //console.log('guardando : ' + href);

            var rutaAbs = href.substring(0, href.lastIndexOf("/"));

            //console.log('ruta absoluta : ' + rutaAbs);

            $http.post(href).then(
                function(rpta) {

                    // en esta primer alfa solo se va a remplazar el ../ por rutaAbs/../
                    // se debe mejorar esta funcion ya que no todos cumplen esta condicion
                    //console.log(rpta.data);
                    var newcss = rpta.data.replace(/\.\.\//g, rutaAbs + '/../');
                    //console.log(newcss);



                    localStorage.setItem(name, newcss);
                    defered.resolve({
                        css: newcss
                    });
                    //console.log('saving : ' + href + ' as ' + name);

                    //"../fonts"

                    // trabajr mas en este script lo dejo por ahora
                    //console.log(rpta.data);
                    // mejorar la url (
                    //var css = rpta.data.replace(/url \(/g, "url(");
                    //console.log(css);
                    //var i = 0;
                    //do {
                    //    i = css.indexOf("url(", i);
                    //    if (i !== -1) {
                    //        var iend=css.indexOf(")", i);
                    //        if(iend!==-1) {
                    //            var urlstr = css.substring((i+4), iend);
                    //            console.log(urlstr);
                    //        }
                    //       i+=4; 
                    //    }
                    //    
                    //}
                    //while (i !== -1);
                    // se debe preguntar si el contenido de la url es de tipo url 
                    // si lo que esta dentro de un url() es una ruta :
                    // absoluta
                    // relativa
                    // es una cadena de texto base64
                    // se debe obtener la ruta exacta del script, si es local, se debe tomar la ruta del servidor
                    // remplazar todos los campos con la ruta absoluta del servidor 
                    //console.log(rpta);
                    //var newcss = css.replace(/\.\.\//g, jj.url("f_web/"));
                },
                function() {
                    defered.reject(false);
                });

            return defered.promise;

        };
    }
    angular
        .module('jgTools.core.services.cache-link')
        .service('jgsCacheLinkServices', [
            '$http', '$q',
            jgsCacheLinkServices
        ]);
})();
(function() {
    'use strict';
    angular
        .module('jgTools.core.services.config', []);
})();
(function() {
    'use strict';

    function jgConfigService(jgsUtf8Services) {
        var _baseFile = "", // ruta donde esta almacenado los scripts
            _skin = "skin-1", // tema por defecto
            _loadModule = true, // carga dinamica de recursos css
            _skinSufix = ".min.css", // el prefijo que se debe poner a cada elemto, .min.css o .css
            _cache = true, // se va a guaradar en locastorage todos los recursos css
            _version = '1'; // version actual del script, esto es para borra storages de versionas antiguas
        this.setBaseFile = function(baseFile) {
            _baseFile = baseFile;
        };
        this.setSkin = function(skin) {
            _skin = skin;
        };
        this.setLoadModule = function(loadModule) {
            _loadModule = loadModule;
        };
        this.setSkinSufix = function(skinSufix) {
            _skinSufix = skinSufix;
        };
        this.setCache = function(cache) {
            _cache = cache;
        };
        this.setVersion = function(version) {
            _version = version;
        };

        this.$get = function() {
            return {
                "baseFile": _baseFile,
                "skin": _skin,
                "skinSufix": _skinSufix,
                "loadModule": _loadModule,
                "cache": _cache,
                "version": _version
            };
        }
    }
    angular
        .module('jgTools.core.services.config')
        .provider('$jgConfig', [
            jgConfigService
        ]);
})();
(function() {
    'use strict';
    angular
        .module('jgTools.core.services.hash', ['jgTools.core.services.utf8']);
})();
(function() {
    'use strict';

    function jgsHashServices(jgsUtf8Services) {
        this.md5 = function(str) {
            //  discuss at: http://phpjs.org/functions/md5/
            // original by: Webtoolkit.info (http://www.webtoolkit.info/)
            // improved by: Michael White (http://getsprink.com)
            // improved by: Jack
            // improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
            //    input by: Brett Zamir (http://brett-zamir.me)
            // bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
            //  depends on: utf8_encode
            //   example 1: md5('Kevin van Zonneveld');
            //   returns 1: '6e658d4bfcb59cc13f96c14450ac40b9'

            var xl;

            var rotateLeft = function(lValue, iShiftBits) {
                return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
            };

            var addUnsigned = function(lX, lY) {
                var lX4, lY4, lX8, lY8, lResult;
                lX8 = (lX & 0x80000000);
                lY8 = (lY & 0x80000000);
                lX4 = (lX & 0x40000000);
                lY4 = (lY & 0x40000000);
                lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF);
                if (lX4 & lY4) {
                    return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
                }
                if (lX4 | lY4) {
                    if (lResult & 0x40000000) {
                        return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
                    } else {
                        return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
                    }
                } else {
                    return (lResult ^ lX8 ^ lY8);
                }
            };

            var _F = function(x, y, z) {
                return (x & y) | ((~x) & z);
            };
            var _G = function(x, y, z) {
                return (x & z) | (y & (~z));
            };
            var _H = function(x, y, z) {
                return (x ^ y ^ z);
            };
            var _I = function(x, y, z) {
                return (y ^ (x | (~z)));
            };

            var _FF = function(a, b, c, d, x, s, ac) {
                a = addUnsigned(a, addUnsigned(addUnsigned(_F(b, c, d), x), ac));
                return addUnsigned(rotateLeft(a, s), b);
            };

            var _GG = function(a, b, c, d, x, s, ac) {
                a = addUnsigned(a, addUnsigned(addUnsigned(_G(b, c, d), x), ac));
                return addUnsigned(rotateLeft(a, s), b);
            };

            var _HH = function(a, b, c, d, x, s, ac) {
                a = addUnsigned(a, addUnsigned(addUnsigned(_H(b, c, d), x), ac));
                return addUnsigned(rotateLeft(a, s), b);
            };

            var _II = function(a, b, c, d, x, s, ac) {
                a = addUnsigned(a, addUnsigned(addUnsigned(_I(b, c, d), x), ac));
                return addUnsigned(rotateLeft(a, s), b);
            };

            var convertToWordArray = function(str) {
                var lWordCount;
                var lMessageLength = str.length;
                var lNumberOfWords_temp1 = lMessageLength + 8;
                var lNumberOfWords_temp2 = (lNumberOfWords_temp1 - (lNumberOfWords_temp1 % 64)) / 64;
                var lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16;
                var lWordArray = new Array(lNumberOfWords - 1);
                var lBytePosition = 0;
                var lByteCount = 0;
                while (lByteCount < lMessageLength) {
                    lWordCount = (lByteCount - (lByteCount % 4)) / 4;
                    lBytePosition = (lByteCount % 4) * 8;
                    lWordArray[lWordCount] = (lWordArray[lWordCount] | (str.charCodeAt(lByteCount) << lBytePosition));
                    lByteCount++;
                }
                lWordCount = (lByteCount - (lByteCount % 4)) / 4;
                lBytePosition = (lByteCount % 4) * 8;
                lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
                lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
                lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
                return lWordArray;
            };

            var wordToHex = function(lValue) {
                var wordToHexValue = '',
                    wordToHexValue_temp = '',
                    lByte, lCount;
                for (lCount = 0; lCount <= 3; lCount++) {
                    lByte = (lValue >>> (lCount * 8)) & 255;
                    wordToHexValue_temp = '0' + lByte.toString(16);
                    wordToHexValue = wordToHexValue + wordToHexValue_temp.substr(wordToHexValue_temp.length - 2, 2);
                }
                return wordToHexValue;
            };

            var x = [],
                k, AA, BB, CC, DD, a, b, c, d, S11 = 7,
                S12 = 12,
                S13 = 17,
                S14 = 22,
                S21 = 5,
                S22 = 9,
                S23 = 14,
                S24 = 20,
                S31 = 4,
                S32 = 11,
                S33 = 16,
                S34 = 23,
                S41 = 6,
                S42 = 10,
                S43 = 15,
                S44 = 21;

            str = jgsUtf8Services.encode(str); //this.utf8_encode(str);
            x = convertToWordArray(str);
            a = 0x67452301;
            b = 0xEFCDAB89;
            c = 0x98BADCFE;
            d = 0x10325476;

            xl = x.length;
            for (k = 0; k < xl; k += 16) {
                AA = a;
                BB = b;
                CC = c;
                DD = d;
                a = _FF(a, b, c, d, x[k + 0], S11, 0xD76AA478);
                d = _FF(d, a, b, c, x[k + 1], S12, 0xE8C7B756);
                c = _FF(c, d, a, b, x[k + 2], S13, 0x242070DB);
                b = _FF(b, c, d, a, x[k + 3], S14, 0xC1BDCEEE);
                a = _FF(a, b, c, d, x[k + 4], S11, 0xF57C0FAF);
                d = _FF(d, a, b, c, x[k + 5], S12, 0x4787C62A);
                c = _FF(c, d, a, b, x[k + 6], S13, 0xA8304613);
                b = _FF(b, c, d, a, x[k + 7], S14, 0xFD469501);
                a = _FF(a, b, c, d, x[k + 8], S11, 0x698098D8);
                d = _FF(d, a, b, c, x[k + 9], S12, 0x8B44F7AF);
                c = _FF(c, d, a, b, x[k + 10], S13, 0xFFFF5BB1);
                b = _FF(b, c, d, a, x[k + 11], S14, 0x895CD7BE);
                a = _FF(a, b, c, d, x[k + 12], S11, 0x6B901122);
                d = _FF(d, a, b, c, x[k + 13], S12, 0xFD987193);
                c = _FF(c, d, a, b, x[k + 14], S13, 0xA679438E);
                b = _FF(b, c, d, a, x[k + 15], S14, 0x49B40821);
                a = _GG(a, b, c, d, x[k + 1], S21, 0xF61E2562);
                d = _GG(d, a, b, c, x[k + 6], S22, 0xC040B340);
                c = _GG(c, d, a, b, x[k + 11], S23, 0x265E5A51);
                b = _GG(b, c, d, a, x[k + 0], S24, 0xE9B6C7AA);
                a = _GG(a, b, c, d, x[k + 5], S21, 0xD62F105D);
                d = _GG(d, a, b, c, x[k + 10], S22, 0x2441453);
                c = _GG(c, d, a, b, x[k + 15], S23, 0xD8A1E681);
                b = _GG(b, c, d, a, x[k + 4], S24, 0xE7D3FBC8);
                a = _GG(a, b, c, d, x[k + 9], S21, 0x21E1CDE6);
                d = _GG(d, a, b, c, x[k + 14], S22, 0xC33707D6);
                c = _GG(c, d, a, b, x[k + 3], S23, 0xF4D50D87);
                b = _GG(b, c, d, a, x[k + 8], S24, 0x455A14ED);
                a = _GG(a, b, c, d, x[k + 13], S21, 0xA9E3E905);
                d = _GG(d, a, b, c, x[k + 2], S22, 0xFCEFA3F8);
                c = _GG(c, d, a, b, x[k + 7], S23, 0x676F02D9);
                b = _GG(b, c, d, a, x[k + 12], S24, 0x8D2A4C8A);
                a = _HH(a, b, c, d, x[k + 5], S31, 0xFFFA3942);
                d = _HH(d, a, b, c, x[k + 8], S32, 0x8771F681);
                c = _HH(c, d, a, b, x[k + 11], S33, 0x6D9D6122);
                b = _HH(b, c, d, a, x[k + 14], S34, 0xFDE5380C);
                a = _HH(a, b, c, d, x[k + 1], S31, 0xA4BEEA44);
                d = _HH(d, a, b, c, x[k + 4], S32, 0x4BDECFA9);
                c = _HH(c, d, a, b, x[k + 7], S33, 0xF6BB4B60);
                b = _HH(b, c, d, a, x[k + 10], S34, 0xBEBFBC70);
                a = _HH(a, b, c, d, x[k + 13], S31, 0x289B7EC6);
                d = _HH(d, a, b, c, x[k + 0], S32, 0xEAA127FA);
                c = _HH(c, d, a, b, x[k + 3], S33, 0xD4EF3085);
                b = _HH(b, c, d, a, x[k + 6], S34, 0x4881D05);
                a = _HH(a, b, c, d, x[k + 9], S31, 0xD9D4D039);
                d = _HH(d, a, b, c, x[k + 12], S32, 0xE6DB99E5);
                c = _HH(c, d, a, b, x[k + 15], S33, 0x1FA27CF8);
                b = _HH(b, c, d, a, x[k + 2], S34, 0xC4AC5665);
                a = _II(a, b, c, d, x[k + 0], S41, 0xF4292244);
                d = _II(d, a, b, c, x[k + 7], S42, 0x432AFF97);
                c = _II(c, d, a, b, x[k + 14], S43, 0xAB9423A7);
                b = _II(b, c, d, a, x[k + 5], S44, 0xFC93A039);
                a = _II(a, b, c, d, x[k + 12], S41, 0x655B59C3);
                d = _II(d, a, b, c, x[k + 3], S42, 0x8F0CCC92);
                c = _II(c, d, a, b, x[k + 10], S43, 0xFFEFF47D);
                b = _II(b, c, d, a, x[k + 1], S44, 0x85845DD1);
                a = _II(a, b, c, d, x[k + 8], S41, 0x6FA87E4F);
                d = _II(d, a, b, c, x[k + 15], S42, 0xFE2CE6E0);
                c = _II(c, d, a, b, x[k + 6], S43, 0xA3014314);
                b = _II(b, c, d, a, x[k + 13], S44, 0x4E0811A1);
                a = _II(a, b, c, d, x[k + 4], S41, 0xF7537E82);
                d = _II(d, a, b, c, x[k + 11], S42, 0xBD3AF235);
                c = _II(c, d, a, b, x[k + 2], S43, 0x2AD7D2BB);
                b = _II(b, c, d, a, x[k + 9], S44, 0xEB86D391);
                a = addUnsigned(a, AA);
                b = addUnsigned(b, BB);
                c = addUnsigned(c, CC);
                d = addUnsigned(d, DD);
            }

            var temp = wordToHex(a) + wordToHex(b) + wordToHex(c) + wordToHex(d);

            return temp.toLowerCase();
        };
    }
    angular
        .module('jgTools.core.services.hash')
        .service('jgsHashServices', [
            'jgsUtf8Services',
            jgsHashServices
        ]);
})();
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
(function() {
    'use strict';
    angular
        .module('jgTools.core.services.utf8', []);
})();
(function() {
    'use strict';

    function jgsUtf8Services() {

        this.encode = function(argString) {
            //  discuss at: http://phpjs.org/functions/utf8_encode/
            // original by: Webtoolkit.info (http://www.webtoolkit.info/)
            // improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
            // improved by: sowberry
            // improved by: Jack
            // improved by: Yves Sucaet
            // improved by: kirilloid
            // bugfixed by: Onno Marsman
            // bugfixed by: Onno Marsman
            // bugfixed by: Ulrich
            // bugfixed by: Rafal Kukawski
            // bugfixed by: kirilloid
            //   example 1: utf8_encode('Kevin van Zonneveld');
            //   returns 1: 'Kevin van Zonneveld'

            if (argString === null || typeof argString === 'undefined') {
                return '';
            }

            var string = (argString + ''); // .replace(/\r\n/g, "\n").replace(/\r/g, "\n");
            var utftext = '',
                start, end, stringl = 0;

            start = end = 0;
            stringl = string.length;
            for (var n = 0; n < stringl; n++) {
                var c1 = string.charCodeAt(n);
                var enc = null;

                if (c1 < 128) {
                    end++;
                } else if (c1 > 127 && c1 < 2048) {
                    enc = String.fromCharCode(
                        (c1 >> 6) | 192, (c1 & 63) | 128
                    );
                } else if ((c1 & 0xF800) != 0xD800) {
                    enc = String.fromCharCode(
                        (c1 >> 12) | 224, ((c1 >> 6) & 63) | 128, (c1 & 63) | 128
                    );
                } else { // surrogate pairs
                    if ((c1 & 0xFC00) != 0xD800) {
                        throw new RangeError('Unmatched trail surrogate at ' + n);
                    }
                    var c2 = string.charCodeAt(++n);
                    if ((c2 & 0xFC00) != 0xDC00) {
                        throw new RangeError('Unmatched lead surrogate at ' + (n - 1));
                    }
                    c1 = ((c1 & 0x3FF) << 10) + (c2 & 0x3FF) + 0x10000;
                    enc = String.fromCharCode(
                        (c1 >> 18) | 240, ((c1 >> 12) & 63) | 128, ((c1 >> 6) & 63) | 128, (c1 & 63) | 128
                    );
                }
                if (enc !== null) {
                    if (end > start) {
                        utftext += string.slice(start, end);
                    }
                    utftext += enc;
                    start = end = n + 1;
                }
            }

            if (end > start) {
                utftext += string.slice(start, stringl);
            }

            return utftext;
        };
    }
    angular
        .module('jgTools.core.services.utf8')
        .service('jgsUtf8Services', [
            jgsUtf8Services
        ]);
})();
(function() {
    'use strict';
    angular
        .module('jgTools.components.block', ['jgTools.components.block.template']);
})();


(function() {
    'use strict';
    
    function jgcBlock() {
        return {
            restrict: "A",
            replace: false,
            transclude: true,
            templateUrl: 'jg-tools/components/block/views/block.html',
            scope:{
                enable:"@jgBlockEnable",
                type:"@jgBlockType"
            },
            link: function($scope, element) {

                element.css('position','relative');

                // trabajr en la posicio absoluta o flex

                $scope.enableBlock=true;
                $scope.jgcBlockStyle={'background-color': 'rgba(186, 181, 181, 0.39)'};

                if($scope.type=='2'){
                    $scope.jgcBlockStyle={};
                }

                

                $scope.$watch('enable', function(newValue) {
                    
                    if(typeof newValue === "string"){
                        $scope.enableBlock=(newValue==='true')? true:false;
                    }
                    
                });
                
            }
        };
    }


    angular
        .module('jgTools.components.block')
        .directive('jgcBlock', [
            jgcBlock
        ]);
})();


(function() {
    'use strict';
    angular
        .module('jgTools.components.block.template', [])
        .run(['$templateCache', function($templateCache) {

            $templateCache.put("jg-tools/components/block/views/block.html", '<div ng-transclude></div><div ng-if="enableBlock" style="position: absolute;top: 0;right: 0;bottom: 0;left: 0;z-index: 5;" ng-style="jgcBlockStyle"></div>');

        }]);
})();
(function() {
    'use strict';
    angular
        .module('jgTools.components.card', [
            'jgTools.core.services.config',
            'jgTools.core.services.scrip-async',
            'jgTools.components.card.template'

        ]);
})();

(function() {
    'use strict';

    function jgcCard($jgConfig, jgsLinkAsyncServices) {

        return {
            restrict: "E",
            replace: true,
            transclude: true,
            templateUrl: 'jg-tools/components/card/views/card.html',
            //scope: {},
            link: function($scope, element, attributes) {
                if ($jgConfig.loadModule) {
                    jgsLinkAsyncServices.putLink($jgConfig.baseFile +'css/'+ $jgConfig.skin + '/card' + $jgConfig.skinSufix,$jgConfig.version,$jgConfig.cache);
                }
            }
        };
    }
    angular
        .module('jgTools.components.card')
        .directive('jgcCard', [
            '$jgConfig', 'jgsLinkAsyncServices',
            jgcCard
        ]);
})();


(function() {
    'use strict';
    angular
        .module('jgTools.components.card.template', [])
        .run(['$templateCache', function($templateCache) {
            $templateCache.put("jg-tools/components/card/views/card.html", '<div class="jgc-card" ng-transclude ></div>');
        }]);
})();
(function(){
  'use strict';
  angular
    .module('jgTools.components',[
        'jgTools.components.block',
    	'jgTools.components.layout',
    	'jgTools.components.menu',
        'jgTools.components.menu-horizontal',
    	'jgTools.components.tool-bar',
    	'jgTools.components.title',
    	'jgTools.components.google-chart',
    	'jgTools.components.card'
    ]);
})();
(function() {
    'use strict';
    angular
        .module('jgTools.components.google-chart', ['jgTools.core.services.scrip-async']);
})();

(function() {
    'use strict';

    function jgcGoogleChart($q, $window, jgsScriptAsyncServices) {
        return {
            restrict: "E",
            replace: true,
            template: "<div></div>",
            scope: {
                options: "=",
                data: "=",
                type: "@"
            },
            link: function($scope, element, attributes) {

                //var google;
                var relationSize = 2; // 400/200  width/height
                var typePackage = {
                    LineChart: ['corechart'],
                    PieChart: ['corechart'],
                    BarChart: ['corechart'],
                    Table: ['table'],
                    Map: ['map']
                };

                var chart;
                var loadingPackage;

                function typeValidation() {
                    if (!$scope.type) {
                        //alert('Define el tipo');
                        console.log('Define el Tipo');
                        return false;
                    }

                    if (!typePackage[$scope.type]) {
                        //alert('error :  no existe el tipo ' + $scope.type);
                        console.log('error :  no existe el tipo ' + $scope.type);
                        return false;
                    }

                    return true;
                }

                function draw() {
                    if (loadingPackage) {
                        return false;
                    }
                    if (typeof $scope.options === "undefined" || typeof $scope.data === "undefined") {
                        return;
                    }
                    var data = google.visualization.arrayToDataTable($scope.data);
                    chart.draw(data, $scope.options);
                }

                function initChart() {

                    loadingPackage = true;
                    if (!typeValidation()) {
                        loadingPackage = false;
                        return false;
                    }


                    jgsScriptAsyncServices.putScript("https://www.google.com/jsapi")
                        .then(function() {
                            return initGoogle();
                        }, function() {
                            console.log('error al cargar el script jsapi');
                        })
                        .then(function() {

                            chart = new google.visualization[$scope.type](element[0]);
                            //google.visualization.events.addListener(chart, 'select', function(e) {
                            //    //table.setSelection(orgchart.getSelection());
                            //    console.log(e);
                            //    console.log('evento selct');
                            //});
                            google.visualization.events.addListener(chart, 'error', function() {
                                //console.log(e);
                                google.visualization.errors.removeAll(element[0]);
                                google.visualization.errors.addError(element[0], 'ha ocurrido un error');
                            });
                            loadingPackage = false;
                            draw();
                        });



                }

                function initGoogle() {

                    var defered = $q.defer();
                    google.load("visualization", "1", {
                        packages: typePackage[$scope.type],
                        "callback": function() {
                            defered.resolve(true);
                        }
                    });
                    return defered.promise;
                }

                function resize() {
                    //console.log('cambiando');
                    $scope.options.height = element[0].offsetWidth / relationSize;
                    $scope.options.width = element[0].offsetWidth;

                    draw();
                }


                initChart();
                $scope.$watch('type', function() {
                    initChart();
                });
                $scope.$watch('options', function() {
                    //console.log('cambio options');
                    draw();
                }, true);
                $scope.$watch('data', function() {
                    draw();
                }, true);



                if (typeof attributes.responsive === "string") {
                    //console.log(element[0].offsetWidth);
                    //console.log(angular.element(element).width());
                    //var $e=element

                    $scope.options.chartArea = {
                        left: 0,
                        top: 25,
                        width: "100%",
                        height: "90%"
                    };


                    resize();
                    angular.element($window).on('resize', function() {
                        resize();
                    });
                }



            }
        };
    }
    angular
        .module('jgTools.components.google-chart')
        .directive('jgcGoogleChart', [
            '$q', '$window', 'jgsScriptAsyncServices',
            jgcGoogleChart
        ]);
})();


(function() {
    'use strict';

    function jgcGoogleChartMap($q, $window, jgsScriptAsyncServices) {
        return {
            restrict: "E",
            replace: true,
            template: "<div class='jose'></div>",
            scope: {
                lat: "=",
                lng: "=",
                name:"@"
            },
            link: function($scope, element, attributes) {

                //var google;
                var relationSize = 2; // 400/200  width/height


                var chart;
                var loadingPackage;



                function draw() {
                    if (loadingPackage) {
                        return false;
                    }
                    if (typeof $scope.lat === "undefined" || typeof $scope.lng === "undefined") {
                        return;
                    }

                    

                    if (typeof $scope.name === "undefined") {
                        $scope.name = '';
                    }
                    

                    var options = {
                        mapType:'normal',
                        zoomLevel:15,
                        useMapTypeControl:true,
                        showTip: ($scope.name == '') ? false : true
                    };


                    console.log(typeof $scope.lat);
                    console.log($scope.lat);
                    console.log('------------------------');
                    console.log(typeof $scope.lng);
                    console.log($scope.lng);

                    console.log('------------------------');
                    console.log(options);

                    


                    var dataTable = [
                        ['Lat', 'Long', 'Name'],
                        [$scope.lat, $scope.lng, $scope.name]
                    ];

                    var data = google.visualization.arrayToDataTable(dataTable);
                    chart.draw(data, options);
                }

                function initChart() {

                    loadingPackage = true;



                    jgsScriptAsyncServices.putScript("https://www.google.com/jsapi")
                        .then(function() {
                            return initGoogle();
                        }, function() {
                            console.log('error al cargar el script jsapi');
                        })
                        .then(function() {

                            chart = new google.visualization.Map(element[0]);
                            //google.visualization.events.addListener(chart, 'select', function(e) {
                            //    //table.setSelection(orgchart.getSelection());
                            //    console.log(e);
                            //    console.log('evento selct');
                            //});
                            google.visualization.events.addListener(chart, 'error', function() {
                                //console.log(e);
                                google.visualization.errors.removeAll(element[0]);
                                google.visualization.errors.addError(element[0], 'ha ocurrido un error');
                            });
                            loadingPackage = false;
                            draw();
                        });



                }

                function initGoogle() {

                    var defered = $q.defer();
                    google.load("visualization", "1", {
                        packages: ["map"],
                        "callback": function() {
                            defered.resolve(true);
                        }
                    });
                    return defered.promise;
                }

                


                initChart();

                $scope.$watch('lat', function() {
                    //console.log('cambio options');
                    draw();
                }, true);
                $scope.$watch('lng', function() {
                    draw();
                }, true);



                if (typeof attributes.responsive === "string") {
                    //console.log(element[0].offsetWidth);
                    //console.log(angular.element(element).width());
                    //var $e=element

                    angular.element($window).on('resize', function() {
                        draw();
                    });
                }



            }
        };
    }
    angular
        .module('jgTools.components.google-chart')
        .directive('jgcGoogleChartMap', [
            '$q', '$window', 'jgsScriptAsyncServices',
            jgcGoogleChartMap
        ]);
})();
(function() {
    'use strict';
    angular
        .module('jgTools.components.high-chart', ['jgTools.core.services.scrip-async']);
})();

(function() {
    'use strict';

    function jgcHighChart($q, $window, jgsScriptAsyncServices) {

        return {
            restrict: 'E',
            replace: true,
            scope: {
                items: '='
            },
            controller: function($scope, $element, $attrs) {
                console.log(2);

            },
            template: 'not working',
            link: function(scope, element, attrs) {
                console.log(3);
                var chart = new Highcharts.Chart(options);
                scope.$watch("items", function(newValue) {
                    chart.series[0].setData(newValue, true);
                }, true);

            }
        }



    }
    angular
        .module('jgTools.components.high-chart')
        .directive('jgcHighChart', [
            '$q', '$window', 'jgsScriptAsyncServices',
            jgcHighChart
        ]);
})();


/*
return {
    restrict: "E",
    replace: true,
    template: "<div class='jose'></div>",
    scope: {
        lat: "=",
        lng: "=",
        name: "@"
    },
    link: function($scope, element, attributes) {

        //var google;
        var relationSize = 2; // 400/200  width/height


        var chart;
        var loadingPackage;



        function draw() {
            if (loadingPackage) {
                return false;
            }
            if (typeof $scope.lat === "undefined" || typeof $scope.lng === "undefined") {
                return;
            }



            if (typeof $scope.name === "undefined") {
                $scope.name = '';
            }


            var options = {
                mapType: 'normal',
                zoomLevel: 15,
                useMapTypeControl: true,
                showTip: ($scope.name == '') ? false : true
            };


            var dataTable = [
                ['Lat', 'Long', 'Name'],
                [$scope.lat, $scope.lng, $scope.name]
            ];

            var data = google.visualization.arrayToDataTable(dataTable);
            chart.draw(data, options);
        }

        function initChart() {

            loadingPackage = true;

            jgsScriptAsyncServices.putScript("https://www.google.com/jsapi")
                .then(function() {
                    loadingPackage = false;
                    return initGoogle();
                }, function() {
                    console.log('error al cargar el script ');
                });
        }


        initChart();

        $scope.$watch('lat', function() {
            draw();
        }, true);
        $scope.$watch('lng', function() {
            draw();
        }, true);

        if (typeof attributes.responsive === "string") {
            angular.element($window).on('resize', function() {
                draw();
            });
        }



    }
};





angular.module('myApp', [])
  .directive('hcPie', function () {
  return {
    restrict: 'C',
    replace: true,
    scope: {
      items: '='
    },
    controller: function ($scope, $element, $attrs) {
      console.log(2);

    },
    template: '<div id="container" style="margin: 0 auto">not working</div>',
    link: function (scope, element, attrs) {
      console.log(3);

      var options={
        chart: {
          renderTo: 'container',
          plotBackgroundColor: null,
          plotBorderWidth: null,
          plotShadow: false
        },
        title: {
          text: 'Browser market shares at a specific website, 2010'
        },
        tooltip: {
          pointFormat: '{series.name}: <b>{point.percentage}%</b>',
          percentageDecimals: 1
        },
        plotOptions: {
          pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
              enabled: true,
              color: '#000000',
              connectorColor: '#000000',
              formatter: function () {
                return '<b>' + this.point.name + '</b>: ' + this.percentage + ' %';
              }
            }
          }
        },
        series: [{
          type: 'pie',
          name: 'Browser share',
          data: scope.items
        }]
      };

      var chart = new Highcharts.Chart(options);
      scope.$watch("items", function (newValue) {
        chart.series[0].setData(newValue, true);
      }, true);
      
    }
  }
});

*/

(function() {
    'use strict';
    /*
    -------------------
          north
    west center east
          south
    ------------------
    */
    angular
        .module('jgTools.components.layout', [
            'jgTools.core.services.config',
            'jgTools.core.services.scrip-async',
            'jgTools.components.layout.template'
            
        ]);
})();


(function() {
    'use strict';

    function jgcLayoutController($scope, $attrs, $jgComponentRegistry) {

        var self = this;

        //console.log($attrs.jgtComponentId);

        $scope.toogleWest = false;

        self.changeToogleWest = function() {
            $scope.toogleWest = !$scope.toogleWest;
        };

        $jgComponentRegistry.register(self, $attrs.jgtComponentId);

    }
    angular
        .module('jgTools.components.layout')
        .controller('$jgcLayoutController', [
            '$scope', '$attrs', '$jgComponentRegistry',
            jgcLayoutController
        ]);
})();


(function() {
    'use strict';

    function jgcLayout($jgConfig,jgsLinkAsyncServices) {
        
        return {
            restrict: "E",
            replace: true,
            transclude: true,
            //template: '',
            templateUrl: 'jg-tools/components/layout/views/layout.html',
            scope: {},
            controller: '$jgcLayoutController',
            link: function($scope, element, attributes) {
                if($jgConfig.loadModule){
                    jgsLinkAsyncServices.putLink($jgConfig.baseFile+'css/'+$jgConfig.skin+'/layout'+$jgConfig.skinSufix,$jgConfig.version,$jgConfig.cache);
                }
            }
        };
    }
    angular
        .module('jgTools.components.layout')
        .directive('jgcLayout', [
            '$jgConfig','jgsLinkAsyncServices',
            jgcLayout
        ]);
})();



(function() {
    'use strict';

    function jgcLayoutWest() {
        return {
            //require: '^jgcLayout',
            restrict: "E",
            replace: true,
            transclude: true,
            templateUrl: 'jg-tools/components/layout/views/west.html',
            //link: function(scope, element, attrs, controller) {
            //    scope.toogle = function() {
            //        controller.changeToogleWest();
            //    }
            //}
        };
    }
    angular
        .module('jgTools.components.layout')
        .directive('jgcLayoutWest', [
            jgcLayoutWest
        ]);
})();

(function() {
    'use strict';

    function jgcLayoutCenter() {
        return {
            //require: '^jgcLayout',
            restrict: "E",
            replace: true,
            transclude: true,
            templateUrl: 'jg-tools/components/layout/views/center.html',
            //link: function(scope, element, attrs, controller) {
            //    
            //}
        };
    }
    angular
        .module('jgTools.components.layout')
        .directive('jgcLayoutCenter', [
            jgcLayoutCenter
        ]);
})();


(function() {
    'use strict';

    function jgcLayout($jgComponentRegistry) {

        this.getInstance = function( handle ) {
            return $jgComponentRegistry.get(handle);
        };

    }
    angular
        .module('jgTools.components.layout')
        .service('$jgcLayout', [
            '$jgComponentRegistry',
            jgcLayout
        ]);
})();

(function() {
    'use strict';


    angular
        .module('jgTools.components.layout.template', [])
        .run(['$templateCache', function($templateCache) {

            $templateCache.put("jg-tools/components/layout/views/layout.html",
                '<div class="jgc-layout" ng-class="{\'toggled-west\':toogleWest}"><div ng-transclude></div><div class="jgc-layout-block" ng-click="toogleWest=!toogleWest"></div></div>');

            $templateCache.put("jg-tools/components/layout/views/west.html",
                '<div class="jgc-layout-west" ng-transclude></div>');

            $templateCache.put("jg-tools/components/layout/views/center.html",
                '<div class="jgc-layout-center" ng-transclude></div>');


        }]);
})();
(function() {
    'use strict';
    angular
        .module('jgTools.components.menu-horizontal', [
            'jgTools.core.services.config',
            'jgTools.core.services.scrip-async',
            'jgTools.components.menu-horizontal.template'
        ]);
})();

(function() {
    'use strict';

    function jgcLayout($jgConfig,jgsLinkAsyncServices) {
        return {
            restrict: "E",
            replace: true,
            transclude: true,
            templateUrl: 'jg-tools/components/menu-horizontal/views/menu-horizontal.html',
            scope: {},
            link: function($scope, element, attributes) {
                if($jgConfig.loadModule){
                    jgsLinkAsyncServices.putLink($jgConfig.baseFile+'css/'+$jgConfig.skin+'/menu-horizontal'+$jgConfig.skinSufix,$jgConfig.version,$jgConfig.cache);
                }
            }
        };
    }
    angular
        .module('jgTools.components.menu-horizontal')
        .directive('jgcMenuHorizontal', [
            '$jgConfig','jgsLinkAsyncServices',
            jgcLayout
        ]);
})();

(function() {
    'use strict';


    angular
        .module('jgTools.components.menu-horizontal.template', [])
        .run(['$templateCache', function($templateCache) {
            $templateCache.put("jg-tools/components/menu-horizontal/views/menu-horizontal.html",'<div class="jgc-menu-horizontal"><div class="jgc-mh-contenedor" ng-transclude ></div></div>');
        }]);
})();
(function() {
    'use strict';
    angular
        .module('jgTools.components.menu', [
            'jgTools.core.services.config',
            'jgTools.core.services.scrip-async',
            'jgTools.components.menu.template'
        ]);
})();


(function() {
    'use strict';

    function jgcMenuController($scope) {

        //console.log($attrs.itemenu);

        //$scope.items = [];

        angular.forEach($scope.items, function(item) {
            item.open = false;
        });

    }
    angular
        .module('jgTools.components.menu')
        .controller('$jgcMenuController', [
            '$scope',
            jgcMenuController
        ]);
})();


(function() {
    'use strict';

    function jgcLayout($jgConfig,jgsLinkAsyncServices) {
        return {
            restrict: "E",
            //replace: true,
            //transclude: true,
            //template: '',
            templateUrl: 'jg-tools/components/menu/views/menu.html',
            scope: {
                items: '='
            },
            controller: '$jgcMenuController',
            link: function($scope, element, attributes) {
                if($jgConfig.loadModule){
                    jgsLinkAsyncServices.putLink($jgConfig.baseFile+'css/'+$jgConfig.skin+'/menu'+$jgConfig.skinSufix,$jgConfig.version,$jgConfig.cache);
                }
            }
        };
    }
    angular
        .module('jgTools.components.menu')
        .directive('jgcMenu', [
            '$jgConfig','jgsLinkAsyncServices',
            jgcLayout
        ]);
})();

(function() {
    'use strict';


    angular
        .module('jgTools.components.menu.template', [])
        .run(['$templateCache', function($templateCache) {
            $templateCache.put("jg-tools/components/menu/views/menu.html",
                '<nav class="jgc-menu"><ul><li ng-repeat="item in items"><a ng-if="item.sref" data-ui-sref-active="active" data-ui-sref="{{item.sref}}" title="{{item.title}}" class="item"  href="">{{item.title}}</a><a ng-if="item.submenu" ng-class="{open: item.open}" title="{{item.title}}" class="item parent" ng-click="item.open=!item.open"  href="">{{item.title}}</a><ul ng-if="item.submenu" ><li ng-repeat="itemSubMenu in item.submenu" ng-if="itemSubMenu.sref" ><a data-ui-sref-active="active" data-ui-sref="{{itemSubMenu.sref}}" title="{{itemSubMenu.title}}" class="item" >{{itemSubMenu.title}}</a></li></ul></li></ul></nav>');
        }]);
})();
(function() {
    'use strict';
    angular
        .module('jgTools.components.title', []);
})();


(function() {
    'use strict';
    /**
     * pageTitle - Directive for set Page title - mata title
     */
    function jgcTitle($rootScope, $timeout) {
        return {
            restrict: 'A',
            scope:{
                title:"@"
            },
            link: function(scope, element) {
                //console.log('hola title');

                //console.log($rootScope);
                //console.log($rootScope.pageTitle);
                var listener = function(event, toState) { //event, toState, toParams, fromState, fromParams

                    //console.log(toState);

                    var title = scope.title || '';
                    // Create your own title pattern
                    if (toState.data && toState.data.pageTitle) {
                        //console.log('entre');
                        //console.log(title);
                        title = title +' '+ toState.data.pageTitle;
                    }
                    $timeout(function() {
                        element.text(title);
                    });
                };
                $rootScope.$on('$stateChangeStart', listener);
            }
        };
    }


    angular
        .module('jgTools.components.title')
        .directive('jgcTitle', [
            '$rootScope', '$timeout',
            jgcTitle
        ]);
})();
(function() {
    'use strict';
    angular
        .module('jgTools.components.tool-bar', [
            'jgTools.core.services.config',
            'jgTools.core.services.scrip-async',
            'jgTools.components.tool-bar.template'
        ]);
})();



(function() {
    'use strict';

    function jgcLayout($jgConfig,jgsLinkAsyncServices) {

        return {
            restrict: "E",
            replace: true,
            transclude: true,
            templateUrl: 'jg-tools/components/tool-bar/views/tool-bar.html',
            scope: {},
            link: function($scope, element, attributes) {
                if($jgConfig.loadModule){
                    jgsLinkAsyncServices.putLink($jgConfig.baseFile+'css/'+$jgConfig.skin+'/tool-bar'+$jgConfig.skinSufix,$jgConfig.version,$jgConfig.cache);
                }
            }
        };
    }
    angular
        .module('jgTools.components.tool-bar')
        .directive('jgcToolBar', [
            '$jgConfig','jgsLinkAsyncServices',
            jgcLayout
        ]);
})();


(function() {
    'use strict';


    angular
        .module('jgTools.components.tool-bar.template', [])
        .run(['$templateCache', function($templateCache) {

            $templateCache.put("jg-tools/components/tool-bar/views/tool-bar.html",'<header class="jgc-tool-bar"><div ng-transclude></div><div class="clearfix"></div></header>');

            

        }]);
})();