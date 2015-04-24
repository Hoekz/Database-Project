app.controller('login', ['$scope', '$fetch', '$location', function($scope, $fetch, $loc){
    $scope.user = {
        login: function(){
            $fetch.login($scope.user.name);
        },
        name: ''
    };
    $scope.$on('loggedIn', function(){
        $loc.path('/');
    });
}]);