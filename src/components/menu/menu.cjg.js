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