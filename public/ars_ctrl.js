var app = angular.module('ActionRequiredApp', ['smart-table']);

app.controller('ArCtrl', function ($scope, $http) {
  $http.get('list_ars').success(function(data) {
    $scope.displayed=[];
    $scope.meetings = data;
  });

  $scope.initAR = function() {
      $scope.newAR = {ArID:0,Description:"", Status:""};
      $scope.editMode = null;
  }

  $scope.findArrayIdx = function(id) {
    var arrayIdx = 0;
    for (; arrayIdx < $scope.meetings.length && $scope.meetings[arrayIdx].ArID !== id; arrayIdx++) {
      // No internal logic is necessary.
    }
    return arrayIdx;
  }

  $scope.addAR2 = function() {
      if ($scope.editMode == 'edit') {
        $scope.editMode = null;
        var ArID = $scope.newAR.ArID;
        var data = {ArID, Status:$scope.newAR.Status, Description:$scope.newAR.Description};

        var arrayIdx = $scope.findArrayIdx(ArID);
        $scope.meetings[arrayIdx].Description = $scope.newAR.Description;
        $scope.meetings[arrayIdx].Status = $scope.newAR.Status;

        $http.post('/update_ar', data).then(
          function successCallback(response) {
          },
          function errorCallback(response) {
          console.log("error");
        });
        $scope.initAR();
        return;
      }

      var today = new Date();
      $scope.newAR.OpenDate = today.toISOString();
      $scope.newAR.DueDate = today.toISOString();
      var data = { MeetingID:8, Status:$scope.newAR.Status,
                   OpenDate:$scope.newAR.OpenDate,
                   DueDate:$scope.newAR.DueDate,
                   Description:$scope.newAR.Description};

      $scope.meetings.push(data);
      $http.post('/create_ar', data).then(
        function successCallback(response) {

      }, function errorCallback(response) {
        console.log("error");
      });
      $scope.initAR();
      //$scope.isNew = false;
      return $scope.meetings;
  };

  $scope.editAR = function(ArID) {
    console.log("been here " + ArID);
    //$scope.$parent.frame_url = "ars_edit.html";
    //$scope.$parent.$apply(function () {$scope.frame_url = "ars_edit.html"; });

    if (ArID == 'new') {
      $scope.newAR = {Description:"", Status:"Open"};
      $scope.editMode = 'new';
    } else {
      $scope.editMode = 'edit';
      $scope.newAR.ArID = ArID;
      var arrayIdx = $scope.findArrayIdx(ArID);
      $scope.newAR.Description = $scope.meetings[arrayIdx].Description;
      $scope.newAR.Status = $scope.meetings[arrayIdx].Status;
    }
  }

  $scope.deleteAR = function(ArID) {
    console.log("deleteAR " + ArID);
    var data = {id:ArID};
    var arrayIdx = $scope.findArrayIdx(ArID);
    $scope.meetings.splice(arrayIdx, 1);

    $http.post('/delete_ar', data).then(function successCallback(response) {
      // this callback will be called asynchronously when the response is available
    }, function errorCallback(response) {
      // called asynchronously if an error occurs or server returns response with an error status.
      console.log("error");
    });
  }

  $scope.cancelEdit = function() {
    $scope.initAR();
    //$scope.frame_url = "ars_list.html";
  }

  $scope.error = false;
  $scope.incomplete = false;
  $scope.initAR();
  //copy the references (you could clone ie angular.copy but then have to go through a dirty checking for the matches)
  $scope.displayedCollection = [].concat($scope.meetings);
});

app.filter('lineFilter', function () {
  return function(input) {
    if(!input) return input;
    var firstLine = input.split('\n')[0];
    return firstLine;
  };
});

app.directive('contenteditable', function() {
return {
    require: 'ngModel',
    link: function(scope, elm, attrs, ctrl) {
        // view -> model
        elm.bind('blur', function() {
            scope.$apply(function() {
                ctrl.$setViewValue(elm.html());
            });
        });

        // model -> view
        ctrl.render = function(value) {
            elm.html(value);
        };

        elm.bind('keydown', function(event) {
            console.log("keydown " + event.which);
            var esc = event.which == 27,
                el = event.target;

            if (esc) {
                console.log("esc");
                ctrl.$setViewValue(elm.html());
                el.blur();
                event.preventDefault();
            }
        });
    }
};
});
