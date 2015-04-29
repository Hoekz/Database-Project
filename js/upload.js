app.controller('upload', ['$scope', '$fetch', function($scope, $fetch){
    $scope.file = {
        upload: function(e){
            $fetch.upload(e.target, function(){})
        },
        username: localStorage.username,
        seasons: ["Spring", "Summer", "Fall", "Winter"],
        classes: [],
        teachers: [],
        getClasses: function(){
            $fetch.getClasses($scope.file.dept.abbreviation, function(data){
                $scope.file.classes = data;
            });
        },
        getTeachers: function(){
            $fetch.getTeachers($scope.file.class.id, function(data){
                $scope.file.teachers = data;
            });
        },
        departments: [],
        dept: null,
        class: null,
        teacher: null
    };

    $fetch.departments(function(data){
        $scope.file.departments = data;
    });
}]);