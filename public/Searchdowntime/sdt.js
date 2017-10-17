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
    
    $scope.updata = [];
    $scope.listUptime = function()
    {
        angular.forEach($scope.updata, function(u)
        {
            var newref1 = firebase.database().ref().child("downtime"); 
            var newdtdata = newref1.child(u.$id); 
            var newdtlist = $firebaseArray(newdtdata); 
            if($scope.equipment && $scope.equipment != "" && $scope.equipment && $scope.equipment != u.$id) return;
            
            newdtlist.$loaded().then(function() {
                angular.forEach (newdtlist, function (n) {
                    
                    
                    var upTime = n;
                                        
                    console.log(upTime);
                    var start = new Date (upTime.start);
                    var end = new Date (upTime.end);
                    
                    var hours = Math.abs(end - start) / 36e5;
                    hours = parseFloat(Math.round(hours * 100) / 100).toFixed(2);
                                        
                    var date = new Date();
                    var getYear = date.getFullYear();
                    
                    var firstDay = new Date(getYear,0,1);
                    var today = new Date (date.getTime());
                    
                    var difference = (Math.abs(firstDay - today) / 36e5) / 24;

                    $scope.totalOperationTime = difference * 24;
                    $scope.totalDownTime = 0;
                    
                    for(var x = 0 ; x < $scope.chartData.length ; x++) {
                        $scope.totalDownTime = $scope.chartData[x];
                    }
                    
                    upTime.type = ($scope.totalOperationTime - $scope.totalDownTime);
                    console.log($scope.uptime);
                    upTime.type = parseFloat(Math.round(upTime.type * 100) / 100).toFixed(2);
                    
                    $scope.updata.push(upTime);
                    
                });
            });
        });
    }
    
    
    
     var newref = firebase.database().ref();
        var updata = newref.child("downtime");
        var dtlist = $firebaseArray(updata);
        var push = false;
        var startDate = new Date();
        
            $scope.filterChange = function () {
                $scope.updata = [];
                $scope.listUptime();
            }
        
        dtlist.$loaded().then(function(dtlist) {
        $scope.updata = dtlist; // Getting Downtime node
            
            $scope.listUptime();
            
            dtlist.$watch(function(event) {
                $scope.updata = [];
                $scope.updata = dtlist; // Getting Downtime node
                $scope.listUptime();
            });
            
            
            
            
            }).catch(function(error) {
                $scope.error = error;
            });
    
    $scope.showData = function () {
        console.log($scope.updata);
    }

}]);