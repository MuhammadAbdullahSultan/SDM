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
    
    //Canvas to PDF
    

    
    $scope.downloadHour = function () {
        var d_canvas = document.getElementById('hour');

            $('#download').click(function() {       
                html2canvas($("#hour"), {
                    onrendered: function(canvas) {         
                        var imgData = canvas.toDataURL(
                            'image/png');              
                        var doc = new jsPDF('p', 'mm', [419.53,  595.28]);
                        doc.addImage(imgData, 'PNG', 10, 10);
                        doc.save('sample-file.pdf');
                    }
                });
            });
    }
    
    $scope.downloadPercentage = function () {
        var d_canvas = document.getElementById('percent');

            $('#downloadper').click(function() {       
                html2canvas($("#percent"), {
                    onrendered: function(canvas) {         
                        var imgData = canvas.toDataURL(
                            'image/png');              
                        var doc = new jsPDF('p', 'mm', [419.53,  595.28]);
                        doc.addImage(imgData, 'PNG', 10, 10);
                        doc.save('sample-file.pdf');
                    }
                });
            });
    }
    
    $scope.downloadHourDash = function () {
        var d_canvas = document.getElementById('hourdash');

            $('#downloaddash').click(function() {       
                html2canvas($("#hourdash"), {
                    onrendered: function(canvas) {         
                        var imgData = canvas.toDataURL(
                            'image/png');              
                        var doc = new jsPDF('p', 'mm', [419.53,  595.28]);
                        doc.addImage(imgData, 'PNG', 10, 10);
                        doc.save('sample-file.pdf');
                    }
                });
            });
    }
    
    // Hour Chart
    
    $scope.allEquipments = [];
    $scope.allSystems = [];
    $scope.allDT = [];
    
    // -------------------------------------------------------------------------------------------------------
    // LABELS
    // -------------------------------------------------------------------------------------------------------    
    
    $scope.equipmentLabels = [];
    
    // -------------------------------------------------------------------------------------------------------
    // Chart Data
    // -------------------------------------------------------------------------------------------------------
    
    $scope.chartData = [];
    
    $('.form_datetime').datetimepicker({
        todayBtn:  1,
		autoclose: 1,
		todayHighlight: 1,
        format: 'yyyy.mm.dd hh:ii'
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
    
    // Sorting table on click 
    $scope.sortType     = 'name'; // set the default sort type
    $scope.sortReverse  = false;  // set the default sort order
    
    $scope.notEmptyOrNull = function(item){
  return !(item.name_fr === null || item.name_fr.trim().length === 0)
}
     
    // -------------------------------------------------------------------------------------------------------
    // download to jpg
    // -------------------------------------------------------------------------------------------------------
        
    $scope.downloadImgHr = function () {
        $("#saveImgHr").click(function() {
 	    $("#hour").get(0).toBlob(function(blob) {
            saveAs(blob, "hour_chart.jpeg");
                });
        });
    }
    
    $scope.downloadImgPer = function () {
        $("#saveImgPer").click(function() {
 	    $("#percent").get(0).toBlob(function(blob) {
            saveAs(blob, "percentage_chart.jpeg");
                });
        });
    }
        
    
    
    
    // -------------------------------------------------------------------------------------------------------
    // CHART
    // -------------------------------------------------------------------------------------------------------    

        $scope.chartOptions = {
            data: {
            datasets: [{
                fillColor: "rgba(14,72,100,1)",
                strokeColor: "brown",
                borderWidth: 1
            }]
        },
            title: {
                display: false,
                text: "",
                fontSize: 20,
            },
            
            legend: {
                text: "Hello"
            },
            
            tooltips: {
                enabled: true
            },
            
            onClick: function(event, elem) {
                 var chartele = elem[0];
                 if (!chartele) {return;} // check and return if not clicked on bar/data
                 // else...
                else {
                    
                    $(document).ready(function(){
                    $("#canvas").click(function(){
                        $("#viewGraph").modal(); 
                        
                        });
                    });
                    
                }
        
              },
            
            
            scales: {
                yAxes: [{id: 'y-axis-1', type: 'linear', position: 'left', ticks: {min: 0, max: 100}}],
                xAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: ''
                    },
                gridLines: {
                    color: "rgba(0, 0, 0, 0)",
                }
                }],
                yAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: ''
                    },
                gridLines: {
                    color: "rgba(0, 0, 0, 0)",
                }   
            }]
            }
            }
        
        
    $scope.hourCalculation = function () {
        
        
        
        angular.forEach ($scope.allDT , function (date) {
            
            
        });
    }
    
    // -------------------------------------------------------------------------------------------------------
    // For adding downtime
    // -------------------------------------------------------------------------------------------------------
    $scope.manageDowntime = function () {
        
        // VAlIDATION
        if($scope.addEquipment === null) {
            toaster.pop({type: 'warning', title: "Equipment Field Empty", body: "Please select an equipment from the dropdown"});
        } else if ($scope.type === null) {
            toaster.pop({type: 'warning', title: "Type not selected", body: "Please select the type of maintenance"});
        } else if ($scope.startDT === undefined) {
            toaster.pop({type: 'warning', title: "Start Time Empty", body: "Please enter a start time"});
        } else if ($scope.endDT === undefined) {
            toaster.pop({type: 'warning', title: "End Time Empty", body: "Please enter an end time"});
        } else {
            
            console.log($scope.startDT);
            console.log($scope.endDT);
            var start = $scope.startDT;
            var startDTunix = new Date(start).getTime();
            
            var end = $scope.endDT;
            var endDTunix = new Date(end).getTime();
            
            console.log(startDTunix);
            console.log(endDTunix);
            $scope.startDT = startDTunix;
            $scope.endDT = endDTunix;
            
            
            // parsedUnixTime==819898200
            firebase.database().ref('downtime/' + $scope.addEquipment).push({
            equipment: $scope.addEquipment,
            type : $scope.type,
            start: $scope.startDT,
            end: $scope.endDT
            });
            toaster.pop({type: 'Success', title: "Downtime Added", body: "A new downtime was added"});
            $scope.addEquipment = undefined;
            $scope.type = undefined;
            $scope.startDT = undefined;
            $scope.endDT = undefined;
        }
    };
    
    
        
        var ref = firebase.database().ref();
        var data = ref.child("AllEquipments");
        var list = $firebaseArray(data);
        
        // for adding
        list.$loaded().then(function(data) {
                $scope.add = data;
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
    
    $scope.showDT = function () {        
        var newref = firebase.database().ref();
        var dtdata = newref.child("downtime");
        var dtlist = $firebaseArray(dtdata);
        var push = false;
        var startDate = new Date();
        dtlist.$loaded().then(function(dtlist) {
        $scope.dtdata = dtlist; // Getting Downtime node
        angular.forEach ($scope.dtdata , function (d) { // looping through the dtdata
            var newref1 = firebase.database().ref().child("downtime"); // creating new reference
            var newdtdata = newref1.child(d.$id); // using the $id of the downtime node
            var newdtlist = $firebaseArray(newdtdata); // storing the values in a new firebasearray

            newdtlist.$loaded().then(function(newdtlist) {
                angular.forEach (newdtlist, function (n) {
                                    
                    
                });
            });
                });
            
                
            }).catch(function(error) {
                $scope.error = error;
            });
        
    }
    $scope.percentageData = [];
    $scope.percentageLables = ['SHIT'];
    
    window.onload = function () {
        
                console.log($scope.percentageData);

    }
    
    $scope.calculateTotalOperation = function () {
        
    
    console.log($scope.totalDownTime);
        
        
        console.log($scope.percentage);
                        console.log($scope.percentageData);

    }
    
    
    // -------------------------------------------------------------------------------------------------------
    //RETRIEVING ALL DOWNTIMES
    // -------------------------------------------------------------------------------------------------------
        var newref = firebase.database().ref();
        var dtdata = newref.child("downtime");
        var dtlist = $firebaseArray(dtdata);
        var push = false;
        var startDate = new Date();
        dtlist.$loaded().then(function(dtlist) {
        $scope.dtdata = dtlist; // Getting Downtime node
        angular.forEach ($scope.dtdata , function (d) { // looping through the dtdata
            var newref1 = firebase.database().ref().child("downtime"); // creating new reference
            var newdtdata = newref1.child(d.$id); // using the $id of the downtime node
            var newdtlist = $firebaseArray(newdtdata); // storing the values in a new firebasearray

            newdtlist.$loaded().then(function(newdtlist) {
                angular.forEach (newdtlist, function (n) {
                    $scope.allDT.push(n);
                    $scope.equipmentLabels.push(n.equipment);
                    
                    var start = new Date (n.start);
                    var end = new Date (n.end);
                    
                    var hours = Math.abs(end - start) / 36e5;
                    
                    
                    $scope.chartData.push(hours);
                    
                    var date = new Date();
                    var getYear = date.getFullYear();
                    
                    
                    $scope.totalDaysInYear = days_of_a_year(getYear);
                    $scope.totalOperationTime = $scope.totalDaysInYear * 24;      
                    $scope.totalDownTime = 0;
                    for(var x = 0 ; x < $scope.chartData.length ; x++) {
                        $scope.totalDownTime = $scope.chartData[x];
                    }
                    $scope.percentage = ($scope.totalDownTime/$scope.totalOperationTime) * 100;
                    $scope.percentageData.push($scope.percentage);
                    console.log($scope.percentageData);                    
                    
                    
                    
                    
                    
                    
                    
                    
//                    console.log(days_of_a_year(totalOperationTime));
                    
                    
//                    console.log($scope.equipmentLabels);
//                    console.log($scope.chartData);
                    
                });
            });
                });
            
            
            }).catch(function(error) {
                $scope.error = error;
            });
    
    $scope.load = function () {
        
        
        
    }
    
    
    
    
    // -------------------------------------------------------------------------------------------------------
    // Check for days in year
    // -------------------------------------------------------------------------------------------------------   
    
    function days_of_a_year(year) 
        {
          return isLeapYear(year) ? 366 : 365;
        }
    function isLeapYear(year) {
         return year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0);
    }
    
    // -------------------------------------------------------------------------------------------------------
    // TESTING HOUR CONVERSION
    // -------------------------------------------------------------------------------------------------------
    $scope.execute = function () {
        var end = new Date($scope.allDT[1].end);
        var start = new Date($scope.allDT[1].start);
        console.log(start);
        console.log(end);
        var hours = Math.abs(end - start) / 36e5;
        console.log(hours);
    }
    
    function timeConverter(UNIX_timestamp){
  var a = new Date(UNIX_timestamp * 1000);
  var months = ['1','2','3','4','5','6','7','8','9','10','11','12'];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var date = a.getDate();
  var hour = a.getHours();
  var min = a.getMinutes();
  var sec = a.getSeconds();
  var time = date + '/' + month + '/' + year + ' ' + hour + ':' + min;
  return time;
}
    

    
    //PAGINATION//
    
//    $(function () {
//        
//        var obj = $('#pagination').twbsPagination({
//            totalPages: $scope.allDT.length,
//            visiblePages: 5,
//            currentPage: 1,
//            itemsOnPage: 4,
//
//            onPageClick: function (event, page) {
//                console.info(page);
//            }
//        });
//        console.info(obj.data());
//    });
    

}]);

app.filter('cmdate', [
    '$filter', function($filter) {
        return function(input, format) {
            var s = new Date (0);
            format = s.setUTCSeconds(input);
            return $filter('date')(new Date(input), format);
        };
    }
]);

