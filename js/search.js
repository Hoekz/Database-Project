app.controller('search', ['$scope', '$fetch', '$routeParams', '$location', function($scope, $fetch, $params, $loc){
    $scope.search = {
        dept: $params.dept,
        class: $params.class,
        results: [],
        hasResults: false,
        classes: [],
        goTo: function(c){
            $loc.path('/search/' + $scope.search.dept + '/' + c);
        }
    };

    $fetch.getClasses($scope.search.dept, function(data){
        $scope.search.classes = data;
    });

    if($scope.search.class){
        $fetch.query($scope.search.class, function(data){
            $scope.results = data;
        });
    }

}]);