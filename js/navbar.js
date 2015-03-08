app.controller('navbar', ['$scope', '$user', '$location', function($scope, $user, $loc){
    $scope.user = $user.userInfo();
    $scope.$on('userInfo', function(){
        $scope.user = $user.userInfo();
    });
    $scope.search = {
        submit: function(){
            $loc.path('/search/' + $scope.search.text);
            $scope.search.text = '';
        },
        text: ''
    }
}]);