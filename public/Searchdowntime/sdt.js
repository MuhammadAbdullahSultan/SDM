/*global angular*/
var app = angular.module('sdt', ['ngRoute', 'firebase']);

app.config(['$routeProvider', function ($routeProvider) {
    'use strict';
    $routeProvider.when('/sdt', {
        templateUrl: 'searchdowntime/sdt.html',
        controller: 'sdtCtrl',
        resolve: {
      // controller will not be loaded until $waitForSignIn resolves
      // Auth refers to our $firebaseAuth wrapper in the factory below
      "currentAuth": ["Auth", function(Auth) {
        // $waitForSignIn returns a promise so the resolve waits for it to complete
        return Auth.$requireSignIn();
      }]
    }
    });
}]);

app.controller('sdtCtrl', ['$scope', '$firebaseObject', '$firebaseArray', '$filter', function ($scope, $firebaseObject, $firebaseArray, $filter) {
    'use strict';
    
    
    
    $('#remove').datetimepicker('remove');
        
    //export Canvas to PDF
    $('#month').datetimepicker({
        //language:  'fr',
		autoclose: 1,
		todayHighlight: 1,
		startView: 2,
		forceParse: 0,
        showMeridian: 1,
        format: 'MM yyyy',
        startView: 4,
        minView: 3,
        endDate: '+0d'
    });
    
    $('#year').datetimepicker({
        //language:  'fr',
		autoclose: 1,
		todayHighlight: 1,
		startView: 2,
		forceParse: 0,
        showMeridian: 1,
        format: 'yyyy',
        startView: 4,
        minView: 4,
        endDate: '+0d'
    });
    
    $('#day').datetimepicker({
//        language:  'fr',
        weekStart: 1,
        todayBtn:  1,
		autoclose: 1,
		todayHighlight: 1,
		startView: 2,
		minView: 2,
		forceParse: 0,
        endDate: '+0d'
    });
    
    
    
    $('.form_datetime').datetimepicker({
        //language:  'fr',
        weekStart: 1,
        todayBtn:  1,
		autoclose: 1,
		todayHighlight: 1,
		startView: 2,
		forceParse: 0,
        showMeridian: 1,
        orientation: "top left"
    });
	$('.form_date').datetimepicker({
//        language:  'fr',
        weekStart: 1,
        todayBtn:  1,
		autoclose: 1,
		todayHighlight: 1,
		startView: 2,
		minView: 2,
		forceParse: 0
    });
	$('.form_time').datetimepicker({
//        language:  'fr',
        weekStart: 1,
        todayBtn:  1,
		autoclose: 1,
		todayHighlight: 1,
		startView: 1,
		minView: 0,
		maxView: 1,
		forceParse: 0
    });
     
    
    $scope.upTimeCalculation = [];
    $scope.chartData = [];
    
    $scope.refreshList = function () {
    
    angular.forEach ($scope.dtdata , function (d) {
        // looping through the dtdata
            var newref1 = firebase.database().ref().child("downtime"); // creating new reference
            var newdtdata = newref1.child(d.$id); // using the $id of the downtime node
            var newdtlist = $firebaseArray(newdtdata); // storing the values in a new firebasearray
            if($scope.equipment && $scope.equipment != "" && $scope.equipment && $scope.equipment != d.$id) return;
            
            newdtlist.$loaded().then(function() {
                angular.forEach (newdtlist, function (n) {
                    
                    if($scope.type && $scope.type != "" && $scope.type != n.type) return;
                    
                        
                    
//                    console.log($scope.allUP);
//                    
//                    
//                    console.log(n.start);
                    
                    if(moment(n.start).format("YYYY") === new Date().getFullYear().toString()) {
                        var start = new Date (n.start);
                        var end = new Date (n.end);
                        
                    }
                    
                    
                    
                    
                    var hours = Math.abs(end - start) / 36e5;
                    hours = parseFloat(Math.round(hours * 100) / 100).toFixed(2);
                    
                    $scope.chartData.push(hours);
                    
                    var date = new Date();
                    var getYear = date.getFullYear();

                    var firstDay = new Date(getYear,0,1);
                    var today = new Date (date.getTime());

                    var difference = (Math.abs(firstDay - today) / 36e5);

                    angular.forEach($scope.upTimeCalculation , function (l) {
                        if(l.equipment === n.equipment && moment(n.start).format("YYYY") === new Date().getFullYear().toString()) 
                        {
                            l.uptime -= parseFloat(hours);
                            if(l.uptime <= 0) {
                                l.uptime = 0;
                            }
                            
                            
                            var uptime = l.uptime;
                            l.uppercent = (uptime / difference) * 100;
                            
                            if(l.uppercent <= 0) {
                                l.uppercent = 0;
                            }
                            
                            l.year = n.end;
                        }
                    })
                    
                    
                    
                    
                    
                    
                    
                });
            });
                });
}
    
    
    
    
   

     var newref = firebase.database().ref();
    
    var eqData = newref.child("AllEquipments");
    $scope.eqList = $firebaseArray(eqData);
    
    
    
//    $scope.eqData.push(eqList);
//    $scope.eqData.push(eqList);
//    eqList.$loaded().then(function (eqList) {
//    });
        var dtdata = newref.child("downtime");
        var dtlist = $firebaseArray(dtdata);
        var push = false;
        var date = new Date();
        var getYear = date.getFullYear();

        var firstDay = new Date(getYear,0,1);
        var today = new Date (date.getTime());

        var difference = (Math.abs(firstDay - today) / 36e5);
        var totalOperationTime = difference * 24;

        
        dtlist.$loaded().then(function(dtlist) {
            
            
            $scope.dtdata = dtlist; // Getting Downtime node
            
            angular.forEach ($scope.dtdata, function (so) {
                
                
                
                var excelref = firebase.database().ref().child("downtime"); // creating new reference
                var exceldtdata = excelref.child(so.$id); // using the $id of the downtime node
                var excelList = $firebaseArray(exceldtdata); // storing the values in a new firebasearray
                
                excelList.$loaded().then(function() {
                    angular.forEach (excelList, function (downt) {
                        
                        for(var i = 0 ; i < $scope.eqList.length ; i++) {
                            if($scope.eqList[i].equipment === downt.equipment) {
                                $scope.toPushSystem = $scope.eqList[i].system;
                            }
                        }
                        var toPush = { "equipment": so.$id, "uptime": difference, "system": $scope.toPushSystem, "uppercent": 0, "year": ""};
                        if(moment(downt.start).format("YYYY") === new Date().getFullYear().toString()) {
                            $scope.upTimeCalculation.push(toPush);
                        }
                    })
                });
                
//                console.log(toPush);
                    
                
                
                
            });
            
            $scope.refreshList();
            
//            dtlist.$watch(function(event) {
//                $scope.dtdata = dtlist; // Getting Downtime node
//                $scope.refreshList();
//            });
            
            }).catch(function(error) {
                $scope.error = error;
            });
    
    $scope.showData = function () {
        console.log($scope.upTimeCalculation);
    }
    
    //------------------------------------------------------------------------------------------------
    // PAGINATION
    //------------------------------------------------------------------------------------------------
    
    
    $scope.currentPage = 1, $scope.numPerPage = 5, $scope.orderByField = 'equipment', $scope.reverseSort = false;
    $scope.$watch("filterUptime", function (newVal, oldVal) {
        for (var i = 0; i < $scope.upTimeCalculation.length; i++) {
            $scope.upTimeCalculation[i].filtered = $scope.upTimeCalculation[i].equipment.toUpperCase().indexOf(newVal.toUpperCase()) === -1;
            paginationFunc();
        }
            
    });
//    
//    $scope.$watch("dateFilter", function (newVal, oldVal) {
//        for (var i = 0; i < $scope.allUP.length; i++)
//            $scope.allUP[i].filtered = $scope.allUP[i].start.indexOf(newVal) === -1;
//            paginationFunc();
//    });
    
    $scope.$watch("upTimeCalculation.length", paginationFunc);
    $scope.$watch("currentPage + numPerPage", paginationFunc);
    $scope.selectedPage = function (index) {
        $scope.currentPage = index;
    }
    $scope.changeNumPerPage = function (index) {
        $scope.numPerPage = index * 5;
    }
    $scope.changePage = function (sign) {
        var currentPageValue = eval($scope.currentPage + sign + 1);
        if (currentPageValue < 1) currentPageValue = 1;
        if (currentPageValue > $scope.numbers) currentPageValue = $scope.numbers;
        $scope.currentPage = currentPageValue;
    }
    function paginationFunc() {
        var upTimeCalculation = $scope.upTimeCalculation.filter(function (item) { return !item.filtered });
        $scope.numbers = Math.ceil(upTimeCalculation.length / $scope.numPerPage);
        if ($scope.currentPage < 1) $scope.currentPage = 1;
        if ($scope.currentPage > $scope.numbers) $scope.currentPage = $scope.numbers;
        var begin = (($scope.currentPage - 1) * $scope.numPerPage), end = begin + $scope.numPerPage;
        $scope.filteredUPTime = upTimeCalculation.slice(begin, end);
    }

}]);