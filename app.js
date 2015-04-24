var app = angular.module('app', ['ngRoute']);

app.config(['$routeProvider','$locationProvider',function($routeProvider, $locationProvider){
    $routeProvider
        .when('/',{
            controller: 'home',
            templateUrl: 'html/home.html'
        })
        .when('/search/:dept',{
            controller: 'search',
            templateUrl: 'html/search.html'
        })
        .when('/search/:dept/:class', {
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
        .when('/user/:user', {
            controller: 'display.user',
            templateUrl: 'html/user.html'
        })
        .when('/upload', {
            controller: 'upload',
            templateUrl: 'html/upload.html'
        })
        .otherwise({redirectTo: '/'});
    $locationProvider.html5Mode(!1);
}]);

app.factory('$fetch', ['$http', '$rootScope', function($http, $root){
    var self = this;
    var base = 'http://localhost:3000/api';

    self.classes = {};

    self.userInfo = function(callback){
        if(!localStorage.username){
            callback({username: ''});
            return null;
        }
        if(self.user)
            callback(self.user);
        else
            $http.get(base + '/students/' + localStorage.username).success(function(data){
                self.user = data.result[0];
                callback(data.result[0]);
            });
        return null;
    };

    self.login = function(username){
        $http.get(base +  '/students/' + username).success(function(data){
            localStorage.username = username;
            self.user = data.result[0];
            $root.$broadcast('loggedIn');
        });
    };

    self.signOut = function(){
        localStorage.username = "";
        self.user = {username: ""};
        $root.$broadcast('loggedIn');
    };

    self.getUser = function(username, callback){
        $http.get(base + '/students/' + username).success(function(data){
            callback(data.result[0]);
        });
    };

    self.createUser = function(student, majors, minors, callback){
        $http.post(base + '/students', {
            student: student,
            majors: majors,
            minors: minors
        }).success(callback);
    };

    self.departments = function(callback){
        if(!self.depts){
            $http.get(base + '/departments').success(function(data){
                self.depts = data.result;
                callback(data.result);
            });
        }else{
            callback(self.depts);
        }
    };

    self.getClasses = function(name, callback){
        if(self.classes[name]){
            callback(self.classes[name]);
        }else{
            $http.get(base + '/departments/' + name + '/courses').success(function(data){
                self.classes[name] = data.result;
                callback(data.result);
            });
        }
    };

    self.query = function(str, callback){
        callback([]);
    };

    self.upload = function(form, callback){
        $http.post(base + '/document', new FormData(form), {
            headers: {'Content-Type': undefined},
            transformRequest: angular.identity
        }).success(callback);
    };

    self.download = function(did, callback){

    };

    return self;
}]);

app.controller('home', ['$scope', '$fetch', function($scope, $fetch){
    $scope.user = {
        username: ''
    };

    $fetch.userInfo(function(data){
        $scope.user = data;
    });

    $scope.$on('loggedIn', function(){
        $scope.user = $fetch.user;
    });
}]);