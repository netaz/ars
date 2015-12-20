var app = angular.module('ActionRequiredApp', ['smart-table']);

app.controller('ArCtrl', function ($scope, $http) {
  $http.get('list_ars').success(function(data) {
    $scope.displayed=[];
    $scope.meetings = data;
  });

  $scope.initAR = function() {
    var today = new Date();
    $scope.newAR = {
        ArID:0, Description : "",
        Status : "Open",
        //OpenDate : today.toISOString(),
        OpenDate : today,
        DueDate : today,
        CloseDate : today,
      };
      $scope.editMode = null;
  }

  $scope.copyToNewAR = function(ArID) {
    var arrayIdx = $scope.findArrayIdx(ArID);
    var meeting = $scope.meetings[arrayIdx];
    $scope.newAR.ArID = ArID;
    $scope.newAR.Description = meeting.Description;
    $scope.newAR.Status = meeting.Status;
    $scope.newAR.OpenDate = meeting.OpenDate;
    $scope.newAR.DueDate = meeting.DueDate;
    $scope.newAR.CloseDate = meeting.CloseDate;
  }

  $scope.copyFromNewAR = function(ArID) {
    var arrayIdx = $scope.findArrayIdx(ArID);
    var meeting = $scope.meetings[arrayIdx];
    $scope.newAR.ArID = ArID;
    meeting.Description = $scope.newAR.Description;
    meeting.Status = $scope.newAR.Status;
    meeting.OpenDate = $scope.newAR.OpenDate;
    meeting.DueDate = $scope.newAR.DueDate;
    meeting.CloseDate = $scope.newAR.CloseDate;
  }

  $scope.findArrayIdx = function(id) {
    var arrayIdx = 0;
    for (; arrayIdx < $scope.meetings.length && $scope.meetings[arrayIdx].ArID !== id; arrayIdx++) {
      // No internal logic is necessary.
    }
    return arrayIdx;
  }

  $scope.commitAR = function() {
      if ($scope.editMode == 'edit') {
        $scope.editMode = null;
        var ar = $scope.newAR;

        var ArID = ar.ArID;
        var data = { ArID,
            Status: ar.Status,
            OpenDate: ar.OpenDate,
            DueDate: ar.DueDate,
            CloseDate: ar.CloseDate,
            Description: ar.Description
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

      var data = { MeetingID:8,
                   Status:$scope.newAR.Status,
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
      return $scope.meetings;
  };

  $scope.createAR = function(ArID) {
    console.log("createAR (new)");
    $scope.initAR();
    $scope.editMode = 'new';
  }

  $scope.editAR = function(ArID) {
    console.log("editAR " + ArID);
    $scope.editMode = 'edit';
    $scope.copyToNewAR(ArID);
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

app.controller('DatepickerDemoCtrl', function ($scope) {
  $scope.today = function() {
    $scope.dt = new Date();
  };
  $scope.today();

  $scope.clear = function () {
    $scope.dt = null;
  };

  // Disable weekend selection
  $scope.disabled = function(date, mode) {
    return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
  };

  $scope.toggleMin = function() {
    $scope.minDate = $scope.minDate ? null : new Date();
  };
  $scope.toggleMin();
  $scope.maxDate = new Date(2020, 5, 22);

  $scope.open = function($event) {
    $scope.status.opened = true;
  };

  $scope.setDate = function(year, month, day) {
    $scope.dt = new Date(year, month, day);
  };

  $scope.dateOptions = {
    formatYear: 'yy',
    startingDay: 1
  };

  $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
  $scope.format = $scope.formats[0];

  $scope.status = {
    opened: false
  };

  var tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  var afterTomorrow = new Date();
  afterTomorrow.setDate(tomorrow.getDate() + 2);
  $scope.events =
    [
      {
        date: tomorrow,
        status: 'full'
      },
      {
        date: afterTomorrow,
        status: 'partially'
      }
    ];

  $scope.getDayClass = function(date, mode) {
    if (mode === 'day') {
      var dayToCheck = new Date(date).setHours(0,0,0,0);

      for (var i=0;i<$scope.events.length;i++){
        var currentDay = new Date($scope.events[i].date).setHours(0,0,0,0);

        if (dayToCheck === currentDay) {
          return $scope.events[i].status;
        }
      }
    }

    return '';
  };
});
