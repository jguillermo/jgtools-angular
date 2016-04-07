(function() {
    'use strict';
    angular
        .module('jgTools.components.high-chart', ['jgTools.core.services.scrip-async']);
})();

(function() {
    'use strict';

    function jgcHighChart($q, $window, jgsScriptAsyncServices) {

        return {
            restrict: 'E',
            replace: true,
            scope: {
                items: '='
            },
            controller: function($scope, $element, $attrs) {
                console.log(2);

            },
            template: 'not working',
            link: function(scope, element, attrs) {
                console.log(3);
                var chart = new Highcharts.Chart(options);
                scope.$watch("items", function(newValue) {
                    chart.series[0].setData(newValue, true);
                }, true);

            }
        }



    }
    angular
        .module('jgTools.components.high-chart')
        .directive('jgcHighChart', [
            '$q', '$window', 'jgsScriptAsyncServices',
            jgcHighChart
        ]);
})();


/*
return {
    restrict: "E",
    replace: true,
    template: "<div class='jose'></div>",
    scope: {
        lat: "=",
        lng: "=",
        name: "@"
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
                mapType: 'normal',
                zoomLevel: 15,
                useMapTypeControl: true,
                showTip: ($scope.name == '') ? false : true
            };


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
                    loadingPackage = false;
                    return initGoogle();
                }, function() {
                    console.log('error al cargar el script ');
                });
        }


        initChart();

        $scope.$watch('lat', function() {
            draw();
        }, true);
        $scope.$watch('lng', function() {
            draw();
        }, true);

        if (typeof attributes.responsive === "string") {
            angular.element($window).on('resize', function() {
                draw();
            });
        }



    }
};





angular.module('myApp', [])
  .directive('hcPie', function () {
  return {
    restrict: 'C',
    replace: true,
    scope: {
      items: '='
    },
    controller: function ($scope, $element, $attrs) {
      console.log(2);

    },
    template: '<div id="container" style="margin: 0 auto">not working</div>',
    link: function (scope, element, attrs) {
      console.log(3);

      var options={
        chart: {
          renderTo: 'container',
          plotBackgroundColor: null,
          plotBorderWidth: null,
          plotShadow: false
        },
        title: {
          text: 'Browser market shares at a specific website, 2010'
        },
        tooltip: {
          pointFormat: '{series.name}: <b>{point.percentage}%</b>',
          percentageDecimals: 1
        },
        plotOptions: {
          pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
              enabled: true,
              color: '#000000',
              connectorColor: '#000000',
              formatter: function () {
                return '<b>' + this.point.name + '</b>: ' + this.percentage + ' %';
              }
            }
          }
        },
        series: [{
          type: 'pie',
          name: 'Browser share',
          data: scope.items
        }]
      };

      var chart = new Highcharts.Chart(options);
      scope.$watch("items", function (newValue) {
        chart.series[0].setData(newValue, true);
      }, true);
      
    }
  }
});

*/
