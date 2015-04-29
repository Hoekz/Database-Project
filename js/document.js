app.controller('document', ['$scope', '$fetch', '$routeParams', function($scope, $fetch, $params){
    $scope.doc = {};

    $scope.username = localStorage.username;

    $fetch.getDoc($params.DID, function(data){
        $scope.doc = data;
        $scope.doc.anon = false;
        console.log($scope.doc);
        $scope.doc.postComment = function(){
            $fetch.postComment($params.DID, {
                comment: {
                    content: $scope.doc.comment,
                    anonymous: $scope.doc.anon
                },
                username: $scope.username
            }, function(){
                $scope.doc.comment = "";
                $fetch.getComments($params.DID, function(data){
                    $scope.doc.comments = data.reverse();
                });
            });
        };
        $scope.doc.vote = function(delta){
            $fetch.updateDoc($params.DID, {votes: $scope.doc.votes += delta});
        };
        $fetch.getComments($params.DID, function(data){
            $scope.doc.comments = data.reverse();
        });
    });
}]);