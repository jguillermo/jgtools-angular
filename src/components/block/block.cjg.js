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