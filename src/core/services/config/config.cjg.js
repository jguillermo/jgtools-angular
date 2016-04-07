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