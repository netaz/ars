var app = angular.module('ActionRequiredApp', [])
app.controller('ArCtrl', function ($scope, $http) {
  $http.get('ars.json').success(function(data) {
    $scope.meetings = data;
  });

  $scope.initAR = function() {
      $scope.newAR = {ArID:0,Summary:"", Status:""};
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
        var data = {ArID, Status:$scope.newAR.Status, Summary:$scope.newAR.Summary};

        var arrayIdx = $scope.findArrayIdx(ArID);
        $scope.meetings[arrayIdx].Summary = $scope.newAR.Summary;
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

      var data = {MeetingID:8, Status:$scope.newAR.Status, Summary:$scope.newAR.Summary};

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

  $scope.frame_url = "ars_list.html";
  $scope.error = false;
  $scope.incomplete = false;
  $scope.initAR();

  $scope.editAR = function(ArID) {
    console.log("been here " + ArID);
    $scope.$parent.frame_url = "ars_edit.html";
    //$scope.$parent.$apply(function () {$scope.frame_url = "ars_edit.html"; });

    if (ArID == 'new') {
      $scope.newAR = {Summary:"", Status:""};
      $scope.editMode = 'new';
    } else {
      $scope.editMode = 'edit';
      $scope.newAR.ArID = ArID;
      var arrayIdx = $scope.findArrayIdx(ArID);
      $scope.newAR.Summary = $scope.meetings[arrayIdx].Summary;
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
    $scope.frame_url = "ars_list.html";
  }
});
