app.controller('search', ['$scope', '$user', '$routeParams', '$timeout', function($scope, $user, $params, $timeout){
    $scope.search = {
        text: $params.search,
        results: [],
        hasResults: false
    };
    var fNames = ['John','Emily','Fred','Sarah','Vicki','Andrew','Matthew'];
    var lNames = ['Smith','Johnson','Brown','Goodall','Wilson','Dickens'];
    $timeout(function(){
        for(var i = 0; i < Math.random() * 100; i++)
            $scope.search.results.push({
                title: 'Search result ' + i,
                author: fNames[Math.floor(Math.random() * 7)] + ' ' + lNames[Math.floor(Math.random() * 6)],
                score: Math.round(Math.random() * 100)
            });
        $scope.search.hasResults = true;
    }, Math.random() * 5000);
}]);