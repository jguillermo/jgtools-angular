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