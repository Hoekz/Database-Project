app.controller('newUser', ['$scope', '$fetch', '$location', function($scope, $fetch, $loc){
    $scope.user = {
        first_name: '',
        last_name: '',
        email: '',
        username: '',
        password: '',
        DOB: ''
    };
    $scope.submit = {
        passCheck: '',
        create: function(){
            if($scope.user.password == $scope.submit.passCheck){
                var majors = document.getElementById('majors').value.split(',');
                var minors = document.getElementById('minors').value.split(',');
                $fetch.createUser($scope.user, majors, minors, function(){
                    $fetch.login($scope.user.username);
                    $loc.path('/');
                });
        }else
                alert('Passwords do not match.');
        }
    };
}]);