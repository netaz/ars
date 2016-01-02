app.controller('UsersCtrl', function ($scope, $http) {
  $scope.users_list = "user1 user2";

  $scope.deleteUser = function(UserID) {
    console.log("deleteUser " + UserID);
  }

  $scope.editUser = function(UserID) {
    console.log("editUser " + UserID);
  }

});
