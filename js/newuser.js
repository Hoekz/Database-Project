app.controller('newUser', ['$scope', function($scope){
    $scope.user = {
        fname: '',
        lname: '',
        email: '',
        username: '',
        pass: '',
        passCheck: '',
        create: function(){
            console.log($scope.user);
        }
    };
}]);