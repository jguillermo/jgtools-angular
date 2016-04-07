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