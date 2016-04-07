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