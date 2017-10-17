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
    
    $scope.allUP = [];
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
                    
                        
                    
                    console.log($scope.allUP);
                    
                    
                    console.log(n.start);
                    var start = new Date (n.start);
                    var end = new Date (n.end);
                    
                    var hours = Math.abs(end - start) / 36e5;
                    hours = parseFloat(Math.round(hours * 100) / 100).toFixed(2);
                    
                    $scope.chartData.push(hours);
                    
                    var date = new Date();
                    var getYear = date.getFullYear();
                    
                    var firstDay = new Date(getYear,0,1);
                    var today = new Date (date.getTime());
                    
                    var difference = (Math.abs(firstDay - today) / 36e5) / 24;

//                    $scope.totalDaysInYear = days_of_a_year(getYear);
                    $scope.totalOperationTime = difference * 24;
                    $scope.totalDownTime = 0;
                    
                    for(var x = 0 ; x < $scope.chartData.length ; x++) {
                        $scope.totalDownTime = $scope.chartData[x];
                    }
                    $scope.percentage = ($scope.totalDownTime/$scope.totalOperationTime) * 100;
                    $scope.percentage = parseFloat(Math.round($scope.percentage * 100) / 100).toFixed(2);
                    
//                    $scope.uptime = ($scope.totalOperationTime - $scope.totalDownTime);
                    console.log($scope.uptime);
                    $scope.uptime = parseFloat(Math.round($scope.uptime * 100) / 100).toFixed(2);
                    
//                    $scope.upTimeData.push($scope.uptime);
//                    $scope.percentageData.push($scope.percentage);
                    
                    console.log($scope.chartData);
                    
                    var copy = n;
                    console.log(copy);
                    
                    var startConverstion = moment(copy.start).format("DD.MM.YYYY HH:mm");
                    var endConverstion = moment(copy.end).format("DD.MM.YYYY HH:mm");

                    // Will display time in 10:30:23 format
                    
                    copy.start = startConverstion;
                    copy.end= endConverstion;
                    
                    copy.type = $scope.totalOperationTime - $scope.totalDownTime;
                    copy.type = parseFloat(Math.round(copy.type * 100) / 100).toFixed(2);
                    
                    $scope.allUP.push(copy);
                    
//                    $scope.equipmentLabels.push(n.equipment);
                    
                });
            });
                });
}
    
    
    
     var newref = firebase.database().ref();
        var dtdata = newref.child("downtime");
        var dtlist = $firebaseArray(dtdata);
        var push = false;
        var startDate = new Date();
        
        
        dtlist.$loaded().then(function(dtlist) {
        $scope.dtdata = dtlist; // Getting Downtime node
            
            $scope.refreshList();
            
            dtlist.$watch(function(event) {
                $scope.dtdata = dtlist; // Getting Downtime node
                $scope.refreshList();
            });
            
            }).catch(function(error) {
                $scope.error = error;
            });
    
    $scope.showData = function () {
        console.log($scope.allUP);
    }
    
    //------------------------------------------------------------------------------------------------
    // PAGINATION
    //------------------------------------------------------------------------------------------------
    
    
    $scope.currentPage = 1, $scope.numPerPage = 5, $scope.orderByField = 'equipment', $scope.reverseSort = false;
//    $scope.$watch("filterWord", function (newVal, oldVal) {
//        for (var i = 0; i < $scope.allUP.length; i++)
//            $scope.allUP[i].filtered = $scope.allUP[i].equipment.toUpperCase().indexOf(newVal.toUpperCase()) === -1;
//        paginationFunc();
//    });
//    
//    $scope.$watch("dateFilter", function (newVal, oldVal) {
//        for (var i = 0; i < $scope.allUP.length; i++)
//            $scope.allUP[i].filtered = $scope.allUP[i].start.indexOf(newVal) === -1;
//            paginationFunc();
//    });
    
    $scope.$watch("allUP.length", paginationFunc);
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
        var allUP = $scope.allUP.filter(function (item) { return !item.filtered });
        $scope.numbers = Math.ceil(allUP.length / $scope.numPerPage);
        if ($scope.currentPage < 1) $scope.currentPage = 1;
        if ($scope.currentPage > $scope.numbers) $scope.currentPage = $scope.numbers;
        var begin = (($scope.currentPage - 1) * $scope.numPerPage), end = begin + $scope.numPerPage;
        $scope.filteredUPTime = allUP.slice(begin, end);
    }

}]);