app.controller('newUser', ['$scope', '$fetch', '$location', function($scope, $fetch, $loc){
    $scope.user = {
        first_name: '',
        last_name: '',
        email: '',
        username: '',
        password: '',
        DOB: '',
        tokens: 0

    };
    $scope.submit = {
        passCheck: '',
        create: function(){
            if($scope.user.password == $scope.submit.passCheck)
                $fetch.createUser($scope.user, [], [], function(){
                    $fetch.login($scope.user.username);
                    $loc.path('/');
                });
            else
                alert('Passwords do not match.');
        }
    };
}]);