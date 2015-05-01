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
        .when('/document/:DID', {
            controller: "document",
            templateUrl: "html/doc.html"
        })
        .when('/rankings', {
            controller: "stats",
            templateUrl: "html/stats.html"
        })
        .otherwise({redirectTo: '/'});
    $locationProvider.html5Mode(!1);
}]);

app.factory('$fetch', ['$http', '$rootScope', '$location', function($http, $root, $loc){
    var self = this;
    var base = 'http://localhost:3000/api';
    //var base = 'http://10.106.23.224:3000/api';

    var URLify = function(params){
        var str = "";
        for(var prop in params)
            str += prop + "=" + encodeURIComponent(params[prop]) + "&";
        return str.substr(0, str.length - 1);
    };

    self.classes = {};
    self.teachers = {};

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
        $loc.path('/');
    };

    self.delUser = function(){
        $http.delete(base + '/students/' + self.user.username).success(self.signOut);
    };
    
    self.getUser = function(username, callback){
        $http.get(base + '/students/' + username).success(function(data){
            callback(data.result[0]);
        });
    };

    self.getUploads = function(username, callback){
        $http.get(base + '/students/' + username + '/documents').success(function(data){
            callback(data.result);
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

    self.getTeachers = function(name, callback){
        if(self.teachers[name]){
            callback(self.teachers[name]);
        }else{
            $http.get(base + '/classes/' + name + '/teachers').success(function(data){
                self.teachers[name] = data.result;
                callback(data.result);
            });
        }
    };

    self.query = function(params, callback){
        $http.get(base + '/documents?' + URLify(params)).success(function(data){
            callback(data.result);
        });
    };

    self.upload = function(form, callback){
        $http.post(base + '/documents', new FormData(form), {
            headers: {'Content-Type': undefined},
            transformRequest: angular.identity
        }).success(function(data){
            if(data == "success"){
                $http.put(base + '/students/' + localStorage.username, {updates:{tokens: self.user.tokens += 3}});
            }
            callback(data);
        });
    };

    self.download = function(did){
        if(self.user.tokens){
            window.open(base + '/documents/' + did + '/download');
            $http.put(base + '/students/' + localStorage.username, {updates:{tokens: self.user.tokens -= 1}});
        }
    };

    self.getDoc = function(did, callback){
        $http.get(base + '/documents/' + did).success(function(data){
            callback(data.result[0]);
        });
    };

    self.getComments = function(did, callback){
        $http.get(base + '/documents/' + did + '/comments').success(function(data){
            callback(data.result);
        });
    };

    self.updateDoc = function(did, updates){
        $http.put(base + '/documents/' + did, {updates: updates});
    };

    self.delDoc = function(did, callback){
        $http.delete(base + '/documents/' + did).success(callback);
    };
    
    self.postComment = function(did, comment, callback){
        console.log(comment);
        $http.post(base + '/documents/'+ did + '/comments', comment).success(callback);
    };

    self.getStats = function(callback){
        $http.get(base + '/stats/votes').success(function(data){
            callback(data.result);
        });
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