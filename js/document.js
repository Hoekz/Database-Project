app.controller('document', ['$scope', '$fetch', '$routeParams', '$location', function($scope, $fetch, $params, $loc){
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
        $scope.doc.delDoc = function(){
            $fetch.delDoc($params.DID, function(){$loc.path('/')});
        };
        $fetch.getComments($params.DID, function(data){
            $scope.doc.comments = data.reverse();
        });
    });
}]);