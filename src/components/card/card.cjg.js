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