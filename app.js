var app = angular.module('app', ['ngRoute']);

app.config(['$routeProvider','$locationProvider',function($routeProvider, $locationProvider){
    $routeProvider
        .when('/',{//home address, normal home page
            controller: 'home',
            templateUrl: 'html/home.html'
        })
        .when('/search/:dept',{//searching by department, returns just classes in department
            controller: 'search',
            templateUrl: 'html/search.html'
        })
        .when('/search/:dept/:class', {//searching by class, returns documents in class + any other filters
            controller: 'search',
            templateUrl: 'html/search.html'
        })
        .when('/newUser', {//user creation page
            controller: 'newUser',
            templateUrl: 'html/newuser.html'
        })
        .when('/sign-in', {//pseudo sign-in page (not true sign-in)
            controller: 'login',
            templateUrl: 'html/sign-in.html'
        })
        .when('/user/:user', {//generic user page, displays name, username, email, age, documents, etc.
            controller: 'display.user',
            templateUrl: 'html/user.html'
        })
        .when('/upload', {//uploading a document form
            controller: 'upload',
            templateUrl: 'html/upload.html'
        })
        .when('/document/:DID', {//generic document page, displays name, votes, comments, etc.
            controller: "document",
            templateUrl: "html/doc.html"
        })
        .when('/rankings', {//rankings page, shows users total votes compared to others
            controller: "stats",
            templateUrl: "html/stats.html"
        })
        .otherwise({redirectTo: '/'});
    $locationProvider.html5Mode(!1);
}]);

app.factory('$fetch', ['$http', '$rootScope', '$location', function($http, $root, $loc){
    var self = this;
    var base = 'http://localhost:3000/api';//local server
    //function for converting JSON object to URL parameters
    var URLify = function(params){
        var str = "";
        for(var prop in params)
            str += prop + "=" + encodeURIComponent(params[prop]) + "&";
        return str.substr(0, str.length - 1);
    };

    self.classes = {};
    self.teachers = {};
    //gets the current user info if one exists (GET - students/:username)
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
    //sets the current user info (GET - students/:username)
    self.login = function(username){
        $http.get(base +  '/students/' + username).success(function(data){
            localStorage.username = username;
            self.user = data.result[0];
            $root.$broadcast('loggedIn');
        });
    };
    //'logs out' a user (no endpoint)
    self.signOut = function(){
        localStorage.username = "";
        self.user = {username: ""};
        $root.$broadcast('loggedIn');
        $loc.path('/');
    };
    //deletes a user account (DELETE - students/:username)
    self.delUser = function(){
        $http.delete(base + '/students/' + self.user.username).success(self.signOut);
    };
    //gets a user's data to show on their page (GET - students/:username)
    self.getUser = function(username, callback){
        $http.get(base + '/students/' + username).success(function(data){
            callback(data.result[0]);
        });
    };
    //gets the uploads by a specified user (GET - students/:username/documents)
    self.getUploads = function(username, callback){
        $http.get(base + '/students/' + username + '/documents').success(function(data){
            callback(data.result);
        });
    };
    //creates a new user based off the data entered in the sign up page (POST - students)
    self.createUser = function(student, majors, minors, callback){
        $http.post(base + '/students', {
            student: student,
            majors: majors,
            minors: minors
        }).success(callback);
    };
    //gets a list of all departments in the database (GET - departments)
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
    //gets a list of the classes from a specified department (GET - departments/:dept/courses)
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
    //gets a list of the teachers of a specified class (GET - classes/:class/teachers)
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
    //queries the documents stored in the database (GET - documents?class=CS%202300&teacher_name=Dan%20Lin&season=Spring&year=2015)
    self.query = function(params, callback){
        $http.get(base + '/documents?' + URLify(params)).success(function(data){
            callback(data.result);
        });
    };
    //uploads a document and its information (POST (form) - documents)
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
    //downloads a document from the database (OPEN - documents/:DID/download) + (PUT - students/:username)
    self.download = function(did){
        if(self.user.tokens){
            window.open(base + '/documents/' + did + '/download');
            $http.put(base + '/students/' + localStorage.username, {updates:{tokens: self.user.tokens -= 1}});
        }
    };
    //gets more information about a document (GET - documents/:DID)
    self.getDoc = function(did, callback){
        $http.get(base + '/documents/' + did).success(function(data){
            callback(data.result[0]);
        });
    };
    //gets the comments posted on a document (GET - documents/:DID/comments)
    self.getComments = function(did, callback){
        $http.get(base + '/documents/' + did + '/comments').success(function(data){
            callback(data.result);
        });
    };
    //updates information about a document, usually just voting information (PUT - documents/:DID)
    self.updateDoc = function(did, updates){
        $http.put(base + '/documents/' + did, {updates: updates});
    };
    //delete a document from the database (DELETE - documents/:DID)
    self.delDoc = function(did, callback){
        $http.delete(base + '/documents/' + did).success(callback);
    };
    //posts a comment on a document (POST - documents/:DID/comments)
    self.postComment = function(did, comment, callback){
        console.log(comment);
        $http.post(base + '/documents/'+ did + '/comments', comment).success(callback);
    };
    //gets the rankings of every user in terms of total votes on their documents (GET - stats/votes)
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