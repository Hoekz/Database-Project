app.controller('navbar', ['$scope', '$fetch', '$location', function($scope, $fetch, $loc){
    $scope.user = {username: ""};

    $scope.action = {
        signOut: $fetch.signOut,
        me: function(){
            if($scope.user.username)
                $loc.path('/user/' + $scope.user.username);
            else
                $loc.path('/sign-in');
        },
        upload: function(){
            $loc.path('/upload');
        }
    };

    $fetch.userInfo(function(data){
        $scope.user = data;
    });

    $scope.$on('loggedIn', function(){
        $scope.user = $fetch.user;
    });

    $scope.search = {
        submit: function(){
            $loc.path('/search/' + $scope.search.text.abbreviation);
            $scope.search.text = '';
        },
        text: {},
        opts: []
    };

    $fetch.departments(function(data){
        $scope.search.opts = data;
    });
}]);