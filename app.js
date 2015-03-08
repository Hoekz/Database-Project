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
        .when('/newUser', {
            controller: 'newUser',
            templateUrl: 'html/newuser.html'
        })
        .when('/sign-in', {
            controller: 'login',
            templateUrl: 'html/sign-in.html'
        })
        .otherwise({redirectTo: '/'});
    $locationProvider.html5Mode(!0);
}]);

app.factory('$user', ['$http', '$rootScope', function($http, $root){
    var self = this;
    self.hasInfo = false;
    self.userInfo = function(){
        if(self.hasInfo)
            return self.info;
        $http.get('json/user.json').success(function(data){
            self.info = data;
            self.hasInfo = true;
            $root.$broadcast('userInfo');
        });
        return {
            signedIn: false,
            name: null
        };
    };
    self.login = function(){
        $http.get('json/user.json').success(function(data){
            self.info = data;
            self.info.signedIn = true;
            self.hasInfo = true;
            $root.$broadcast('userInfo');
        });
        $root.$broadcast('loggedIn');
    };
    return self;
}]);

app.controller('home', ['$scope', '$user', function($scope, $user){
    $scope.user = $user.userInfo();
    $scope.$on('userInfo', function(){
        $scope.user = $user.userInfo();
    });
}]);