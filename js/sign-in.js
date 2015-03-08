app.controller('login', ['$scope', '$user', '$location', function($scope, $user, $location){
    $scope.user = $user;
    $scope.$on('loggedIn', function(){
        $location.path('/');
    });
}]);