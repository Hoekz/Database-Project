app.controller('display.user', ['$scope', '$fetch', '$routeParams', function($scope, $fetch, $params){
    $scope.display = {user: {}};

    $scope.username = localStorage.username;
    
    $fetch.getUser($params.user, function(data){
        $scope.display.user = data;
        var birth = new Date($scope.display.user.DOB);
        var today = new Date();
        var age = today.getFullYear() - birth.getFullYear();
        var m = today.getMonth() - birth.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        $scope.display.user.age = age;
        $scope.display.user.delUser = $fetch.delUser;
        $fetch.getUploads($params.user, function(data){
            $scope.display.user.uploads = data;
        });
    });
}]);