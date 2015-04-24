app.controller('upload', ['$scope', '$fetch', function($scope, $fetch){
    $scope.file = {
        upload: function(e){$fetch.upload(e.target, function(){})}
    };
}]);