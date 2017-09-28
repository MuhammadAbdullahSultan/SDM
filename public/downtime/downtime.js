/*global angular*/
var app = angular.module('downtime', ['ngRoute', 'firebase', 'ngAnimate', 'ngSanitize']);

app.config(['$routeProvider', function ($routeProvider) {
    'use strict';
    $routeProvider.when('/downtime', {
        templateUrl: 'downtime/downtime.html',
        controller: 'downtimeCtrl'
    })
}]);

app.controller('downtimeCtrl', ['$scope', '$firebaseObject', '$firebaseArray', 'toaster', function ($scope, $firebaseObject, $firebaseArray, toaster) {
    'use strict';
    
    $('.form_datetime').datetimepicker({
        weekStart: 1,
        todayBtn:  1,
		autoclose: 1,
		todayHighlight: 1,
		startView: 2,
		forceParse: 0,
        showMeridian: 1
    });
	$('.form_date').datetimepicker({
        weekStart: 1,
        todayBtn:  1,
		autoclose: 1,
		todayHighlight: 1,
		startView: 2,
		minView: 2,
		forceParse: 0
    });
	$('.form_time').datetimepicker({
        weekStart: 1,
        todayBtn:  1,
		autoclose: 1,
		todayHighlight: 1,
		startView: 1,
		minView: 0,
		maxView: 1,
		forceParse: 0
    });
    
    $scope.notEmptyOrNull = function(item){
  return !(item.name_fr === null || item.name_fr.trim().length === 0)
}
    
    $scope.onEquipmentChange = function(item){
   // once user is selected equipment, we take 1st key from second list
    var key =  Object.keys($scope.add[$scope.currentEquipment].$id)[0]

    $scope.currentSystem = $scope.add[$scope.currentEquipment].system;   
  }
     $scope.allEquipments = [];
     $scope.allSystems = [];
     $scope.allDT = [];
    
    
    
    $scope.manageDowntime = function () {
        
        var doesExist = false;
        angular.forEach ($scope.data , function (d) {
        angular.forEach (d.equipments, function (e) {
        })
    });
        
        if($scope.addEquipment === null) {
            toaster.pop({type: 'warning', title: "Equipment Field Empty", body: "Please select an equipment from the dropdown"});
        } else if ($scope.type === null) {
            toaster.pop({type: 'warning', title: "Type not selected", body: "Please select the type of maintenance"});
        } else if ($scope.startDT === undefined) {
            toaster.pop({type: 'warning', title: "Start Time Empty", body: "Please enter a start time"});
        } else if ($scope.endDT === undefined) {
            toaster.pop({type: 'warning', title: "End Time Empty", body: "Please enter an end time"});
        } else {
            firebase.database().ref('downtime/' + $scope.addEquipment).push({
            equipment: $scope.addEquipment,
            type : $scope.type,
            start: $scope.startDT,
            end: $scope.endDT
            });
            toaster.pop({type: 'Success', title: "Downtime Added", body: "A new downtime was added"});
        }
        
        
    };
    
        var ref = firebase.database().ref();
        var data = ref.child("AllEquipments");
        var list = $firebaseArray(data);
        
        // for adding
        list.$loaded().then(function(data) {
                $scope.add = data;
                
//                angular.forEach ($scope.add , function (d) {
//
//                  $scope.allSystems.push(d.$id);  
//                    console.log(d.equipments);
//                    angular.forEach (d.equipments, function (e) {
//                        $scope.allEquipments.push(e.equipment);
//                        console.log(e.system);
//                    })
//                });
            }).catch(function(error) {
                $scope.error = error;
            });
         // for searching
        list.$loaded().then(function(data) {
            $scope.data = data;
            angular.forEach ($scope.data , function (d) {
                
              $scope.allSystems.push(d.$id);  
                
                angular.forEach (d.equipments, function (e) {
                    $scope.allEquipments.push(e.equipment);
                })
            });
        }).catch(function(error) {
            $scope.error = error;
        });
    
    //FOR DOWN TIME RETRIEVE
    
        var newref = firebase.database().ref();
        var dtdata = newref.child("downtime");
        var dtlist = $firebaseArray(dtdata);
    
        dtlist.$loaded().then(function(dtdata) {
                $scope.dtdata = dtdata;
                angular.forEach ($scope.dtdata , function (d) {
                    angular.forEach (d , function (e) {
                    $scope.allDT.push(e);
                    
                })
                });
                
            }).catch(function(error) {
                $scope.error = error;
            });
            

    
//    $(document).ready(function () {
//    
//
//        $('#datetimepicker1').datetimepicker({
//            viewMode: 'years',
//            format: 'DD/MM/YYYY hh:mm'
            
            
//            if ($scope.startDT > $.now()) 
//            {
//            toaster.pop({type: 'warning', title: "Start Time Empty", body: "Please enter a start time"});
//            }
//        }
//        }); 
        
//        $('#datetimepicker3').datetimepicker({
//            viewMode: 'years',
//            format: 'DD/MM/YYYY hh:mm'
//
//        });
//        
//        $('#datetimepickerSearch').datetimepicker({
//            viewMode: 'years',
//            format: 'DD/MM/YYYY'
//
//        });
//        
//        
//        $("#datetimepicker1").on("dp.change", function() {
//
//        $scope.startDT = $("#datetimepicker1").val();
//
//    });
//        
//        $("#datetimepicker3").on("dp.change", function() {
//
//        $scope.endDT = $("#datetimepicker3").val();
//
//    });
//        
//        $("#datetimepickerSearch").on("dp.change", function() {
//
//        $scope.start = $("#datetimepickerSearch").val();
//
//    });
//        
//});
    
    //PAGINATION//
    
        $scope.totalItems = $scope.data.length;
      $scope.currentPage = 1;

      $scope.setPage = function (pageNo) {
        $scope.currentPage = pageNo;
      };

      $scope.pageChanged = function() {
        $log.log('Page changed to: ' + $scope.currentPage);
      };

      $scope.maxSize = 5;
      $scope.bigTotalItems = 175;
      $scope.bigCurrentPage = 1; 
    
    // DATE TIME PICKER
    // ----------------------------------------------------------------------
    
    
    
    ///////////////////////////////////////////////////
    
//$scope.startDT = 'dd/MM/yyyy HH:mm';
//    $scope.endDT = 'dd/MM/yyyy HH:mm';
//    $scope.yearFilter = 'yyyy';
//    $scope.monthFilter = 'MM/yyyy';
//    $scope.dateFilter = 'dd/MM/yyyy';
//
//    $scope.date = new Date();
//    
//  $scope.today = function() {
//    $scope.startDT = new Date();
//    $scope.endDT = new Date();
//    $scope.yearFilter = new Date();
//    $scope.monthFilter = new Date();
//    $scope.dateFilter = new Date();
//  };
//    
//  $scope.today();
//
//  $scope.clear = function() {
//    $scope.startDT = null;
//    $scope.endDT = null;
//    $scope.yearFilter = null;
//    $scope.monthFilter = null;
//    $scope.dateFilter = null;
//
//  };
//
//  $scope.inlineOptions = {
//    customClass: getDayClass,
//    minDate: new Date(),
//    showWeeks: true
//  };
//
//  $scope.dateOptions = {
//    formatYear: 'yyyy',
//    maxDate: new Date(2020, 5, 22),
//    minDate: new Date(),
//    startingDay: 1
//  };
//
//  // Disable weekend selection
//  function disabled(data) {
//    var date = data.date,
//    mode = data.mode;
//    return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
//  }
//
//  $scope.toggleMin = function() {
//    $scope.inlineOptions.minDate = $scope.inlineOptions.minDate ? null : new Date();
//    $scope.dateOptions.minDate = $scope.inlineOptions.minDate;
//  };
//
//  $scope.toggleMin();
//
//  $scope.open1 = function() {
//    $scope.popup1.opened = true;
//  };
//
//  $scope.open2 = function() {
//    $scope.popup2.opened = true;
//  };
//    
//    $scope.open3 = function() {
//    $scope.popup3.opened = true;
//  };
//    
//    $scope.open4 = function() {
//    $scope.popup4.opened = true;
//  };
//    
//    $scope.open5 = function() {
//    $scope.popup5.opened = true;
//  };
//
//  $scope.setDate = function(year, month, day) {
//    $scope.startDT = new Date(year, month, day);
//    $scope.endDT = new Date(year, month, day);
//    $scope.yearFilter = new Date(year);
//    $scope.monthFilter = new Date(year, month);
//    $scope.dateFilter = new Date(year, month, day);
//
//  };
//
//  $scope.formats = ['dd/MM/yyyy HH:mm', 'yyyy', 'MM/yyyy', 'dd/MM/yyyy' ];
//  $scope.format = $scope.formats[0];
//  $scope.altInputFormats = ['d!/M!/yyyy'];
//
//  $scope.popup1 = {
//    opened: false
//  };
//
//  $scope.popup2 = {
//    opened: false
//  };
//    
//  $scope.popup3 = {
//    opened: false
//  };
//    
//    $scope.popup4 = {
//    opened: false
//  };
//    
//    $scope.popup5 = {
//    opened: false
//  };
//
//  var tomorrow = new Date();
//  tomorrow.setDate(tomorrow.getDate() + 1);
//  var afterTomorrow = new Date();
//  afterTomorrow.setDate(tomorrow.getDate() + 1);
//  $scope.events = [
//    {
//      date: tomorrow,
//      status: 'full'
//    },
//    {
//      date: afterTomorrow,
//      status: 'partially'
//    }
//  ];
//
//  function getDayClass(data) {
//    var date = data.date,
//      mode = data.mode;
//    if (mode === 'day') {
//      var dayToCheck = new Date(date).setHours(0,0,0,0);
//
//      for (var i = 0; i < $scope.events.length; i++) {
//        var currentDay = new Date($scope.events[i].date).setHours(0,0,0,0);
//
//        if (dayToCheck === currentDay) {
//          return $scope.events[i].status;
//        }
//      }
//    }
//
//    return '';
//  }
    
    // CHECK FOR EMPTY DATA IN TABLE
    
    var tbody = $("#downtimeData tbody");

if (tbody.children().length == 0) {
    tbody.html("<tr>message foo</tr>");
}
    

}]);

app.directive('customzdatetime', function () {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, element, attrs, ngModelCtrl) {
            element.datetimepicker({
                debug: false,
                format: 'DD-MM-YYYY hh:mm'
            }).on('dp.change', function (e) {
                ngModelCtrl.$setViewValue(e.date);
                scope.$apply();
            });
        }
    };
});

