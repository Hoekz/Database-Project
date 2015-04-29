app.controller('search', ['$scope', '$fetch', '$routeParams', '$location', function($scope, $fetch, $params, $loc){
    $scope.search = {
        dept: $params.dept,
        class: $params.class,
        results: [],
        hasResults: false,
        classes: [],
        download: function(did){
            $fetch.download(did, function(){});
        },
        goTo: function(c){
            $loc.path('/search/' + $scope.search.dept + '/' + c);
        },
        teachers: [],
        seasons: ["Spring", "Summer", "Fall", "Winter"],
        query: function(){
            var query = {CID: $scope.search.class};
            if($scope.search.teacher) query.teacher_name = $scope.search.teacher.teacher_name;
            if($scope.search.season) query.season = $scope.search.season;
            if($scope.search.year) query.year = $scope.search.year;
            $fetch.query(query, function(data){
                $scope.search.results = data;
            });
        }
    };

    $fetch.getClasses($scope.search.dept, function(data){
        $scope.search.classes = data;
        if($scope.search.class){
            var id = 0;
            for(var i = 0; i < data.length; i++)
                if(data[i].CID == $scope.search.class)
                    id = data[i].id;
            $fetch.getTeachers(id, function(data){
                $scope.search.teachers = data;
            });
        }
    });

    if($scope.search.class){
        $scope.search.hasResults = false;
        $fetch.query({CID: $scope.search.class}, function(data){
            $scope.search.results = data;
            $scope.search.hasResults = true;
        });
    }

}]);