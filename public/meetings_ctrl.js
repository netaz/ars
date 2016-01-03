app.controller('MeetingsCtrl', function ($scope, $http) {
  $scope.users_list = "user1 user2";

  $http.get('list_meetings').success(function(data) {
    //$scope.displayed=[];
    $scope.meetings = data;
  });


  $scope.deleteMeeting = function(MeetingID) {
    console.log("deleteMeeting " + MeetingID);
  }

  $scope.editMeeting = function(UserID) {
    console.log("editMeeting " + MeetingID);
  }

});
