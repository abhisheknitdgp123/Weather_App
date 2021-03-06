
(function(){


    var app = angular.module("App", []);

    
    app.run(["$templateCache", function ($templateCache) {
        $templateCache.put('Views/Tabs.html', '<div class="TabContainer"><span class="Tab" ng-class="{ActiveButton: selectedTab == tab}" ng-repeat="tab in tabsData" ng-click="getWeatherReport($event, tab)">{{::tab}}</span></div>')
        $templateCache.put('Views/Weather.html','<section><h3>{{::Info.title}}</h3><div ng-bind-html="Info.item.description"></div><img ng-src="{{::Info.image.url}}" ng-style="imgCss" /></section>');
    }]);

    app.config(["$scope", function ($scope) {
        $scope.enabled(false);
    }]);

    app.service("WeatherService", ["$http", function ($http) {
        this.getWeatherOfGivenCity = function (url) {
            var expectatio= $http({
                url: url,
                method: 'GET'
            }).success(function (data, status, header, config) {
                return data;
            }).error(function (data, status, header, config) {
                return data;
            });
            return expectation;
        };
    }]);

    
    app.factory("Factory", [function () {
        var factory = {};
        factory.getUrlForWeather = function (city) {
             return 'https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22' + city + '%2C%20india%22)&format=json&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=';
        };
        return factory;
    }])

    //Responsible for model updation
    app.controller("Controller", ['$scope', 'Factory', 'WeatherService', function ($scope, UrlFactory, WeatherService) {
        $scope.tabsData = ['Mumbai', 'Pune', 'Chennai', 'Bangalore'];

        $scope.textMessage = "";
        $scope.selectedTab = "";
        $scope.channelInfo = {};
        $scope.toggleVisibility = false;
        $scope.getWeatherReport = function (eventInfo, tab) {
            $scope.textMessage = "Fetching info...";
            $scope.selectedTab = tab;
            var url = UrlFactory.getUrlForWeather($scope.selectedTab);
            $scope.channelInfo = {};
            $scope.toggleVisibility = false;
            WeatherService.getWeatherOfGivenCity(url).then(function (data) {
                $scope.textMessage = "";
                $scope.channelInfo = data.data.query.results.channel;
                $scope.toggleVisibility = true;
            }, function (data) {
                $scope.toggleVisibility = false;
                $scope.textMessage = "Something went wrong...";
            });
        }
    }]);

    app.directive('tabArea', [function () {
        var dirInfo = {
            restrict: 'E',
            replace: true,
            scope: "=",
            templateUrl: 'Views/Tabs.html'
        };
        return dirInfo;
    }]);

    app.directive('Weather', [function () {
        var dirInfo = {
            restrict: 'E',
            replace: true,
            templateUrl: 'Views/Weather.html',
        }
        return dirInfo;
    }]);

})()
