var app = angular.module('ActionRequiredApp', ['smart-table']);

// Copy constructor
function ActionItem (other) {
  if(undefined == other) {
    var today = new Date();
    this.ArID = 0;
    this.Description = "",
    this.Status = "Open",
    //this.OpenDate = today.toISOString(),
    this.OpenDate = today;
    this.DueDate = today;
    this.CloseDate = today;
    this.OwnerID = null;
  } else {
    this.ArID = other.ArID;
    this.Description = other.Description,
    this.Status = other.Status,
    this.OpenDate = other.OpenDate;
    this.DueDate = other.DueDate;
    this.CloseDate = other.CloseDate;
    this.OwnerID = other.OwnerID;

  }
}

ActionItem.prototype.assign = function(other) {
  this.ArID = other.ArID;
  this.Description = other.Description,
  this.Status = other.Status,
  this.OpenDate = other.OpenDate;
  this.DueDate = other.DueDate;
  this.CloseDate = other.CloseDate;
  this.OwnerID = other.OwnerID;
};


//------------------------------------------------------------

app.controller('ArCtrl', function ($scope, $http) {
  $http.get('list_ars').success(function(data) {
    $scope.displayed=[];
    $scope.action_items = data;
  });

  $http.get('list_users').success(function(data) {
    $scope.users = data;
  });

  $scope.getUserName = function(userid) {
    var i = 0;
    for (; i < $scope.users.length && $scope.users[i].UserID !== userid; i++) {
      // No internal logic is necessary.
    }
    if ($scope.users.length == i)
      return "";
    return $scope.users[i].FirstName + " " + $scope.users[i].LastName;
  }

  $scope.initAR = function() {
    //var today = new Date();
/*    $scope.newAR = {
        ArID:0, Description : "",
        Status : "Open",
        //OpenDate : today.toISOString(),
        OpenDate : today,
        DueDate : today,
        CloseDate : today,
        OwnerID: null
      };
*/    $scope.newAR = new ActionItem();
      $scope.editMode = null;
  }

  $scope.copyToNewAR = function(ArID) {
    var arrayIdx = $scope.findArrayIdx(ArID);
    var action_item = $scope.action_items[arrayIdx];
//    action_item..ArID = ArID;
/*    $scope.newAR.ArID = ArID;
    $scope.newAR.Description = action_item.Description;
    $scope.newAR.Status = action_item.Status;
    $scope.newAR.OpenDate = action_item.OpenDate;
    $scope.newAR.DueDate = action_item.DueDate;
    $scope.newAR.CloseDate = action_item.CloseDate;
    $scope.newAR.OwnerID = action_item.OwnerID;
*/
    $scope.newAR = new ActionItem(action_item);
    if ($scope.newAR.OwnerID != null)
      $scope.newAR.OwnerID = $scope.newAR.OwnerID.toString();
  }

  $scope.copyFromNewAR = function(ArID) {
    var arrayIdx = $scope.findArrayIdx(ArID);
    var action_item = $scope.action_items[arrayIdx];

    action_item.assign = ActionItem.prototype.assign;
/*
    action_item.Description = $scope.newAR.Description;
    action_item.Status = $scope.newAR.Status;
    action_item.OpenDate = $scope.newAR.OpenDate;
    action_item.DueDate = $scope.newAR.DueDate;
    action_item.CloseDate = $scope.newAR.CloseDate;
    action_item.OwnerID = $scope.newAR.OwnerID;
*/
if ($scope.newAR.OwnerID != null)
  $scope.newAR.OwnerID = parseInt($scope.newAR.OwnerID);

    action_item.assign($scope.newAR);
  }

  $scope.findArrayIdx = function(id) {
    var arrayIdx = 0;
    for (; arrayIdx < $scope.action_items.length && $scope.action_items[arrayIdx].ArID !== id; arrayIdx++) {
      // No internal logic is necessary.
    }
    if ($scope.action_items.length == arrayIdx)
      return -1;
    return arrayIdx;
  }

  $scope.findActionItem = function(id) {
    var arrayIdx = $scope.findArrayIdx(id);
    if (arrayIdx == -1)
      return null;
    var action_item = $scope.action_items[arrayIdx];
    return action_item;
  }

  $scope.commitAR = function() {
      if ($scope.editMode == 'edit') {
        $scope.editMode = null;
        var ar = $scope.newAR;
        var ArID = ar.ArID;
        var action_item = $scope.findActionItem(ArID);
        if (action_item.Status=="Open" && ar.Status == "Closed") {
          // status changed: Open ==> Closed
          ar.CloseDate = new Date(); // today
        }
        else if (action_item.Status=="Closed" && ar.Status == "Open")  {
          // status changed: Closed ==> Open
          ar.CloseDate = null;
        }

        var data = { ArID,
            Status: ar.Status,
            OpenDate: ar.OpenDate,
            DueDate: ar.DueDate,
            CloseDate: ar.CloseDate,
            Description: ar.Description,
            OwnerID: ar.OwnerID
          };

        $scope.copyFromNewAR(ArID);

        $http.post('/update_ar', data).then(
          function successCallback(response) {
          },
          function errorCallback(response) {
          console.log("error");
        });
        $scope.initAR();
        return;
      }

      /// New AR
      var data = { MeetingID: 8,
                   Status: $scope.newAR.Status,
                   OpenDate: $scope.newAR.OpenDate,
                   DueDate: $scope.newAR.DueDate,
                   Description: $scope.newAR.Description,
                   OwnerID: $scope.newAR.OwnerID
                 };

      $scope.action_items.push(data);
      $http.post('/create_ar', data).then(
        function successCallback(response) {
      }, function errorCallback(response) {
        console.log("error");
      });
      $scope.initAR();
      return $scope.action_items;
  };

  $scope.createAR = function(ArID) {
    //console.log("createAR (new)");
    $scope.initAR();
    $scope.editMode = 'new';
  }

  $scope.editAR = function(ArID) {
    //console.log("editAR " + ArID);
    $scope.editMode = 'edit';
    $scope.copyToNewAR(ArID);
  }

  $scope.deleteAR = function(ArID) {
    //console.log("deleteAR " + ArID);
    var data = {id:ArID};
    var arrayIdx = $scope.findArrayIdx(ArID);
    $scope.action_items.splice(arrayIdx, 1);

    $http.post('/delete_ar', data).then(function successCallback(response) {
      // this callback will be called asynchronously when the response is available
    }, function errorCallback(response) {
      // called asynchronously if an error occurs or server returns response with an error status.
      console.log("error");
    });
  }

  $scope.cancelEdit = function() {
    $scope.initAR();
  }

  $scope.error = false;
  $scope.incomplete = false;
  $scope.initAR();
  //copy the references (you could clone ie angular.copy but then have to go through a dirty checking for the matches)
  $scope.displayedCollection = [].concat($scope.action_items);
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
