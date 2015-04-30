app.controller('upload', ['$scope', '$fetch', '$location', function($scope, $fetch, $loc){
    $scope.file = {
        upload: function(e){
            if($scope.file.teacher && e.target.file.files.length && e.target.year.value &&
                e.target.name.value && $scope.file.season && e.target.grade.value)
                $fetch.upload(e.target, function(){$loc.path('/user/' + localStorage.username)});
            else
                alert('You must fill out all fields and attach a pdf.');
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