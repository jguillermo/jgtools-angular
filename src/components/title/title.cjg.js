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