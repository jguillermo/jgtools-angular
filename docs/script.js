(function() {
    'use strict';
    angular
        .module('AppDoc', [
            'ui.router',
            'jgTools',
            'AppDoc.config'
        ])
        .config(['$jgConfigProvider', 'APPCONFIG', '$urlRouterProvider', '$stateProvider', function($jgConfigProvider, APPCONFIG, $urlRouterProvider, $stateProvider) {


            $jgConfigProvider.setBaseFile(APPCONFIG.base_url);
            $jgConfigProvider.setSkin(APPCONFIG.skin);
            $jgConfigProvider.setSkinSufix(APPCONFIG.skinSufix);
            $jgConfigProvider.setLoadModule(APPCONFIG.loadModule);

            $jgConfigProvider.setCache(APPCONFIG.cache);
            $jgConfigProvider.setVersion(APPCONFIG.version);



            $urlRouterProvider.otherwise("/sis/dashboard");
            $stateProvider
                .state('sis', {
                    abstract: true,
                    url: "/sis",
                    templateUrl: 'views/layout.html',
                })
                .state('sis.dashboard', {
                    url: "/dashboard",
                    templateProvider: ['$http', function($http) {
                        return $http
                            .post('views/dashboard.html')
                            .then(function(response) {
                                return response.data;
                            });
                    }],
                    data: {
                        pageTitle: 'Dashboard'
                    },
                    controller: 'DashboardCtrl'
                })
                .state('sis.layout', {
                    url: "/components-layout",
                    templateUrl: 'views/components/layout.html',
                    data: {
                        pageTitle: 'Layout Component'
                    },
                    controller: 'LayoutComponentCtrl'
                })
                .state('sis.menu', {
                    url: "/components-menu",
                    templateUrl: 'views/components/menu.html',
                    data: {
                        pageTitle: 'Menu Component'
                    },
                    controller: 'MenuComponentCtrl'
                })
                .state('sis.menuhorizontal', {
                    url: "/components-menu-horizontal",
                    templateUrl: 'views/components/menu-horizontal.html',
                    data: {
                        pageTitle: 'Menu horizontal Component'
                    },
                    controller: 'DashboardCtrl'
                })
                .state('sis.toolbar', {
                    url: "/components-tool-bar",
                    templateUrl: 'views/components/tool-bar.html',
                    data: {
                        pageTitle: 'Tool Bar Component'
                    },
                    controller: 'DashboardCtrl'
                })
                .state('sis.card', {
                    url: "/components-card",
                    templateUrl: 'views/components/card.html',
                    data: {
                        pageTitle: 'Card Component'
                    },
                    controller: 'DashboardCtrl'
                })
                .state('sis.title', {
                    url: "/components-title",
                    templateUrl: 'views/components/title.html',
                    data: {
                        pageTitle: 'Title Component'
                    },
                    controller: 'DashboardCtrl'
                })
                .state('sis.block', {
                    url: "/components-block",
                    templateUrl: 'views/components/block.html',
                    data: {
                        pageTitle: 'Title Component'
                    },
                    controller: 'BlockCtrl'
                })
                .state('sis.googlechart', {
                    url: "/components-google-chart",
                    templateUrl: 'views/components/google-chart.html',
                    data: {
                        pageTitle: 'Google Chart Component'
                    },
                    controller: 'GoogleChartComponentCtrl'
                })


            .state('sis.uibmodal', {
                url: "/uib-modal",
                templateUrl: 'views/uib/modal.html',
                data: {
                    pageTitle: 'UIb Modal'
                },
                controller: 'UibModalCtrl'
            })



            .state('sis.hash', {
                    url: "/services-hash",
                    templateUrl: 'views/services/hash.html',
                    data: {
                        pageTitle: 'Hash Services'
                    },
                    controller: 'HashServicesCtrl'
                })
                .state('sis.utf8', {
                    url: "/services-utf8",
                    templateUrl: 'views/services/utf8.html',
                    data: {
                        pageTitle: 'Utf8 Services'
                    },
                    controller: 'Utf8ServicesCtrl'
                })
                .state('sis.cachelink', {
                    url: "/services-cache-link",
                    templateUrl: 'views/services/cache-link.html',
                    data: {
                        pageTitle: 'Cache Link Services'
                    },
                    controller: 'CacheLinkServicesCtrl'
                })
                .state('sis.scriptasync', {
                    url: "/services-script-async",
                    templateUrl: 'views/services/script-async.html',
                    data: {
                        pageTitle: 'Script Async Services'
                    },
                    controller: 'ScriptAsyncServicesCtrl'
                })
                .state('sis.registry', {
                    url: "/services-registry",
                    templateUrl: 'views/services/registry.html',
                    data: {
                        pageTitle: 'Registry Services'
                    },
                    controller: 'RegistryServicesCtrl'
                })
                .state('sis.cachehttp', {
                    url: "/services-cache-http",
                    templateUrl: 'views/services/cache-http.html',
                    data: {
                        pageTitle: 'Cache Http Services'
                    },
                    controller: 'CacheHttpServicesCtrl'
                })
                .state('sis.jsapi', {
                    url: "/plugin-jsapi",
                    templateUrl: 'views/plugins/jsapi.html',
                    data: {
                        pageTitle: 'jsApi Plugin'
                    },
                    controller: 'DashboardCtrl'
                })
                .state('sis.grid', {
                    url: "/grid",
                    templateUrl: 'views/grid.html',
                    data: {
                        pageTitle: 'grid'
                    },
                    controller: 'DashboardCtrl'
                });
        }]).run(['$jgConfig', 'jgsLinkAsyncServices', 'jgsCacheLinkServices', function($jgConfig, jgsLinkAsyncServices, jgsCacheLinkServices) {

            jgsCacheLinkServices.deleteOldVersion($jgConfig.version);

            if ($jgConfig.loadModule) {
                jgsLinkAsyncServices.putLink($jgConfig.baseFile + $jgConfig.skin + '/core' + $jgConfig.skinSufix, $jgConfig.version, $jgConfig.cache);
            } else {
                jgsLinkAsyncServices.putLink($jgConfig.baseFile + $jgConfig.skin + '/all' + $jgConfig.skinSufix, $jgConfig.version, $jgConfig.cache);
            }
            if ($jgConfig.cache) {
                // carga los archivos que aun no estan guardadso en memoria storage
                for (var i = 0; i < jsApiModule.link.length; i++) {
                    jgsLinkAsyncServices.putLink(jsApiModule.link[i].href, $jgConfig.version, true);
                };
            }

            
        }]);
})();


(function() {
    'use strict';

    function layoutController($scope, $jgcLayout) {

        $scope.changeWest = function() {
            $jgcLayout.getInstance('layout_principal').changeToogleWest();
        }

        $scope.itemenu = [{
            title: 'Dashboard',
            sref: 'sis.dashboard'
        }, {
            title: 'Components',
            submenu: [{
                title: 'Layout',
                sref: 'sis.layout'
            }, {
                title: 'Menu',
                sref: 'sis.menu'
            }, {
                title: 'Menu horizontal',
                sref: 'sis.menuhorizontal'
            }, {
                title: 'Card',
                sref: 'sis.card'
            }, {
                title: 'Tool Bar',
                sref: 'sis.toolbar'
            }, {
                title: 'Title',
                sref: 'sis.title'
            }, {
                title: 'Block',
                sref: 'sis.block'
            }, {
                title: 'Google Chart',
                sref: 'sis.googlechart'
            }]
        }, {
            title: 'uibootstrap',
            submenu: [{
                title: 'Modal',
                sref: 'sis.uibmodal'
            }, {
                title: 'Menu',
                sref: 'sis.menu'
            }]
        }, {
            title: 'Core',
            submenu: [{
                title: 'Hash',
                sref: 'sis.hash'
            }, {
                title: 'Utf8',
                sref: 'sis.utf8'
            }, {
                title: 'Cache Link',
                sref: 'sis.cachelink'
            }, {
                title: 'Cache',
                sref: 'sis.cachehttp'
            }, {
                title: 'Script Async',
                sref: 'sis.scriptasync'
            }, {
                title: 'Registry',
                sref: 'sis.registry'
            }]
        }, {
            title: 'Plugins',
            submenu: [{
                title: 'jsApi',
                sref: 'sis.jsapi'
            }]
        }, {
            title: 'Grid',
            sref: 'sis.grid'
        }];

    }
    angular
        .module('AppDoc').controller('layoutController', ['$scope', '$jgcLayout', layoutController]);
})();

(function() {
    'use strict';

    function cleanHtml(s) {
        return s.replace(/jgc-p-/g, 'jgc-').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }


    angular
        .module('AppDoc')
        .directive('prettyprint', function() {
            return {
                restrict: 'C',
                scope: {
                    type: "@"
                },
                link: function postLink(scope, element, attrs) {
                    var type = scope.type || "";
                    element.html(prettyPrintOne(cleanHtml(element.html()), type, true));
                }
            };
        });
})();


(function() {
    'use strict';

    function DashboardCtrl($scope) {



    }
    angular
        .module('AppDoc')
        .controller('DashboardCtrl', ['$scope', DashboardCtrl]);
})();

(function() {
    'use strict';

    function BlockCtrl($scope) {

        $scope.bloqueo = true;



    }
    angular
        .module('AppDoc')
        .controller('BlockCtrl', ['$scope', BlockCtrl]);
})();


/*

(function() {
  'use strict';

  function DashboardCtrl($scope) {}
  angular
    .module('AppDoc').controller('DashboardCtrl', ['$scope', DashboardCtrl]);
})();

*/
(function() {
    'use strict';

    function LayoutComponentCtrl($scope, $jgcLayout) {

        $scope.changeWest = function() {
            $jgcLayout.getInstance('menu_principal_2').changeToogleWest();
        }

        $scope.changeWest_anidado_1 = function() {
            $jgcLayout.getInstance('layout_anidado_1').changeToogleWest();
        }

        $scope.changeWest_anidado_2 = function() {
            $jgcLayout.getInstance('layout_anidado_1_1').changeToogleWest();
        }



    }
    angular
        .module('AppDoc')
        .controller('LayoutComponentCtrl', ['$scope', '$jgcLayout', LayoutComponentCtrl]);
})();

(function() {
    'use strict';

    function MenuComponentCtrl($scope) {
        $scope.itemenu = [{
            title: 'menu1',
            sref: 'sis.dashboard'
        }, {
            title: 'menu2',
            submenu: [{
                title: 'submenu 1',
                sref: 'sis.dashboard12'
            }, {
                title: 'submenu 2',
                sref: 'sis.dashboard12b'
            }, {
                title: 'submenu 3',
                sref: 'sis.dashboard12c'
            }, ]
        }, {
            title: 'menu3',
            sref: 'sis.dashboard3'
        }];

    }
    angular
        .module('AppDoc')
        .controller('MenuComponentCtrl', ['$scope', MenuComponentCtrl]);
})();


(function() {
    'use strict';

    function GoogleChartComponentCtrl($scope) {
        $scope.typeChart = "PieChart";

        $scope.googleChart = {
            options: {
                title: 'line chart 1',

                //backgroundColor:'red'
                //width: '290',
                //height: '200'
            },
            data: [
                ['Year', 'Sales', 'Expenses'],
                ['2004', 1000, 100],
                ['2005', 1170, 460],
                ['2006', 660, 1120],
                ['2007', 1030, 540]
            ]
        }

        $scope.pieChart = {
            options: {
                title: 'Indian Language Use',
                legend: 'none',
                pieSliceText: 'label',
                width: '100%',
                height: '100%',
                slices: {
                    4: {
                        offset: 0.2
                    },
                    12: {
                        offset: 0.3
                    },
                    14: {
                        offset: 0.4
                    },
                    15: {
                        offset: 0.5
                    },
                },
            },
            data: [
                ['Language', 'Speakers (in millions)'],
                ['Assamese', 13],
                ['Bengali', 83],
                ['Bodo', 1.4],
                ['Dogri', 2.3],
                ['Gujarati', 46],
                ['Hindi', 300],
                ['Kannada', 38],
                ['Kashmiri', 5.5],
                ['Konkani', 5],
                ['Maithili', 20],
                ['Malayalam', 33],
                ['Manipuri', 1.5],
                ['Marathi', 72],
                ['Nepali', 2.9],
                ['Oriya', 33],
                ['Punjabi', 29],
                ['Sanskrit', 0.01],
                ['Santhali', 6.5],
                ['Sindhi', 2.5],
                ['Tamil', 61],
                ['Telugu', 74],
                ['Urdu', 52]
            ]

        }



        $scope.table = {
            options: {
                showRowNumber: true,
                width: '100%',
                height: '100%'
            },
            data: [
                ['Name', 'Salary'],
                ['Work', 11],
                ['Eat', 2],
                ['Commute', 2],
                ['Watch TV', 2],
                ['Sleep', 7]
            ]
        }


        $scope.map = {
            options: {
                mapType: 'normal',
                //zoomLevel: 15,
                //useMapTypeControl: true,
                showTip: true
            },
            data: [
                ['Lat', 'Long', 'Name'],
                [37.4232, -122.0853, 'Work'],
                [37.4289, -122.1697, 'University'],
                [37.6153, -122.3900, 'Airport'],
                [37.4422, -122.1731, 'Shopping']
            ]
        }



    }
    angular
        .module('AppDoc')
        .controller('GoogleChartComponentCtrl', ['$scope', GoogleChartComponentCtrl]);
})();



// services
(function() {
    'use strict';

    function HashServicesCtrl($scope, jgsHashServices) {
        $scope.md5 = function(t) {
            return jgsHashServices.md5(t);
        }
    }
    angular
        .module('AppDoc').controller('HashServicesCtrl', ['$scope', 'jgsHashServices', HashServicesCtrl]);
})();


(function() {
    'use strict';

    function Utf8ServicesCtrl($scope, jgsUtf8Services) {
        $scope.txt = "áeiou";
        $scope.utf8_encode = function(t) {
            return jgsUtf8Services.encode(t);
        }
    }
    angular
        .module('AppDoc').controller('Utf8ServicesCtrl', ['$scope', 'jgsUtf8Services', Utf8ServicesCtrl]);
})();


(function() {
    'use strict';

    function CacheLinkServicesCtrl($scope, jgsCacheLinkServices) {

        $scope.linkHref = 'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css';

        $scope.loading = '';

        $scope.saveLink = function() {
            $scope.loading = '';
            jgsCacheLinkServices.saveLink($scope.linkHref).then(function(rpta) {
                $scope.loading = ' Se Guardo conforme con el nombre ' + rpta.name;
            });

        };

    }
    angular
        .module('AppDoc').controller('CacheLinkServicesCtrl', ['$scope', 'jgsCacheLinkServices', CacheLinkServicesCtrl]);
})();


(function() {
    'use strict';

    function ScriptAsyncServicesCtrl($scope, jgsScriptAsyncServices) {

        $scope.scriptSrc = 'https://www.google.com/jsapi';

        $scope.loading = '';

        $scope.loadScript = function() {
            $scope.loading = '';


            jgsScriptAsyncServices.putScript($scope.scriptSrc).then(function() {
                $scope.loading = 'Se cargó corectamente el script';
            }, function() {
                $scope.loading = 'Error al cargar el script';
            });

        };



    }
    angular
        .module('AppDoc').controller('ScriptAsyncServicesCtrl', ['$scope', 'jgsScriptAsyncServices', ScriptAsyncServicesCtrl]);
})();


(function() {
    'use strict';

    function RegistryServicesCtrl($scope) {}
    angular
        .module('AppDoc').controller('RegistryServicesCtrl', ['$scope', RegistryServicesCtrl]);
})();


(function() {
    'use strict';

    function CacheHttpServicesCtrl($scope, jgsCacheHttpServices) {



        $scope.loading = '';
        $scope.data = {};

        $scope.saveHttp = function(link) {
            $scope.link = link;
            $scope.loading = 'Guardando ...';
            jgsCacheHttpServices.http(link).then(function(rpta) {
                $scope.loading = '';
                $scope.data = rpta;
            });

        };

    }
    angular
        .module('AppDoc').controller('CacheHttpServicesCtrl', ['$scope', 'jgsCacheHttpServices', CacheHttpServicesCtrl]);
})();



(function() {
    'use strict';
    function UibModalCtrl($scope, $uibModal, $log) {
        $scope.items = ['item1', 'item2', 'item3'];
        $scope.animationsEnabled = true;
        $scope.open = function(size) {
            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'views/uib/modal-instance.html',
                controller: 'UibModalInstanceCtrl',
                size: size,
                resolve: {
                    items: function() {
                        return $scope.items;
                    }
                }
            });
            modalInstance.result.then(function(selectedItem) {
                $scope.selected = selectedItem;
            }, function() {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };
        $scope.toggleAnimation = function() {
            $scope.animationsEnabled = !$scope.animationsEnabled;
        };
    }
    function UibModalInstanceCtrl($scope, $uibModalInstance, items) {
        $scope.items = items;
        $scope.selected = {
            item: $scope.items[0]
        };
        $scope.ok = function() {
            $uibModalInstance.close($scope.selected.item);
        };
        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };
    }
    angular
        .module('AppDoc')
        .controller('UibModalCtrl', ['$scope', '$uibModal', '$log', UibModalCtrl])
        .controller('UibModalInstanceCtrl', ['$scope', '$uibModalInstance', 'items', UibModalInstanceCtrl]);
})();