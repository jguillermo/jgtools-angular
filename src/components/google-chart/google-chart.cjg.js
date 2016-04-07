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