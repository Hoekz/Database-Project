var app = angular.module('app', ['ngRoute']);

app.config(['$routeProvider','$locationProvider',function($routeProvider, $locationProvider){
    $routeProvider
        .when('/',{
            controller: 'home',
            templateUrl: 'html/home.html'
        })
        .when('/search/:search', {
            controller: 'search',
            templateUrl: 'html/search.html'
        })
        .otherwise({redirectTo: '/'});
    $locationProvider.html5Mode(!1);
}]);