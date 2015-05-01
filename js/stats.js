app.controller('stats', ['$scope', '$fetch', function($scope, $fetch){
    $scope.stats = [];
    $fetch.getStats(function(data){
        $scope.stats = data;
    });
}]);