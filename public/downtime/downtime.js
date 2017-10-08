/*global angular*/
var app = angular.module('downtime', ['ngRoute', 'firebase', 'ngAnimate', 'ngSanitize']);

app.config(['$routeProvider', function ($routeProvider) {
    'use strict';
    $routeProvider.when('/downtime', {
        templateUrl: 'downtime/downtime.html',
        controller: 'downtimeCtrl',
        resolve: {
          // controller will not be loaded until $waitForSignIn resolves
          // Auth refers to our $firebaseAuth wrapper in the factory below
          "currentAuth": ["Auth", function(Auth) {
            // $waitForSignIn returns a promise so the resolve waits for it to complete
            return Auth.$requireSignIn();
          }]
        }
    })
}]);

app.controller('downtimeCtrl', ['$scope', '$firebaseObject', '$firebaseArray', 'toaster', function ($scope, $firebaseObject, $firebaseArray, toaster) {
    'use strict';
    
    //Canvas to PDF
    
    $('#start').datetimepicker({
        //language:  'fr',
		autoclose: 1,
		todayHighlight: 1,
		startView: 2,
		forceParse: 0,
        showMeridian: 1,
    });
    
    $('#end').datetimepicker({
        //language:  'fr',
		autoclose: 1,
		todayHighlight: 1,
		startView: 2,
		forceParse: 0,
        showMeridian: 1,
    });
    
    $('#filter').datetimepicker({
        //language:  'fr',
		autoclose: 1,
		todayHighlight: 1,
		startView: 2,
		forceParse: 0,
        showMeridian: 1,
        startView: 4,
        format: "dd/mm/yyyy"
    });
    
    
    $scope.$watch("equipment", function () {
        $scope.percentageData = [];
        $scope.allDT = [];
        $scope.equipmentLabels = [];
        $scope.chartData = [];
        $scope.dtdata = dtlist; // Getting Downtime node
        $scope.refreshList();
    })

    $scope.$watch("type", function () {
        $scope.percentageData = [];
        $scope.allDT = [];
        $scope.equipmentLabels = [];
        $scope.chartData = [];
        $scope.dtdata = dtlist; // Getting Downtime node
        $scope.refreshList();
    })
    //////////////////DOWNLOAD DATA INTO PDF
    
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
    
    
    $('#remove').datetimepicker('remove');
    
    $('#dtFilter').datetimepicker({
        //language:  'fr',
		autoclose: 1,
		todayHighlight: 1,
		startView: 2,
		forceParse: 0,
        showMeridian: 1,
        format: 'dd/mm/yyyy',
        startView: 2,
        minView: 4
    });
    
    $('#remove').datetimepicker('remove');
//    $('#start').datetimepicker('setStartDate');
//    $('#end').datetimepicker('setEndDate', '.form_endtime');

        
    $('.form_starttime').datetimepicker({
        todayBtn:  1,
		autoclose: 1,
		todayHighlight: 1,
        format: 'yyyy.mm.dd hh:ii P',
        showMeridian: true,
        pickerPosition: "bottom-left",
        startDate : new Date('2012-08-08'),
        endDate: '+0d',
        })
        .on('changeDate', function (selected) {
        var minDate = new Date(selected.date.valueOf());
        $('.form_endtime').datetimepicker('setStartDate', minDate);
            });
        
    $('.form_endtime').datetimepicker({
        todayBtn:  1,
		autoclose: 1,
		todayHighlight: 1,
        format: 'yyyy.mm.dd hh:ii P',
        showMeridian: true,
        pickerPosition: "bottom-left",
        endDate: '+0d',
        })
        .on('changeDate', function (selected) {
        var maxDate = new Date(selected.date.valueOf());
        $('.form_starttime').datetimepicker('setEndDate', maxDate);
            });
  
//    $("#form_starttime").datetimepicker({
//        todayBtn:  1,
//		autoclose: 1,
//		todayHighlight: 1,
//        format: 'yyyy.mm.dd hh:ii P',
//        showMeridian: true,
//        pickerPosition: "bottom-left",
//        startDate : new Date('2012-08-08'),
//        endDate: '+0d',
//    }).on('changeDate', function (selected) {
//        var minDate = new Date(selected.date.valueOf());
//
//    $('#form_endtime').datetimepicker('  setStartDate', minDate);
//    });
//        
//    $("#form_endtime").datetimepicker({
//        todayBtn:  1,
//		autoclose: 1,
//		todayHighlight: 1,
//        format: 'yyyy.mm.dd hh:ii P',
//        showMeridian: true,
//        pickerPosition: "bottom-left",
//        endDate: '+0d'
//
//    });
    
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
        
        $scope.getFilteredData = function () {
            var equipment = lowercase(document.getElementById("").value);
        }
        
        
    $scope.hourCalculation = function () {
        
        
        
        angular.forEach ($scope.allDT , function (date) {
            
            
        });
    }
    
    // -------------------------------------------------------------------------------------------------------
    // For adding downtime
    // -------------------------------------------------------------------------------------------------------
    $scope.reload = function () {
        window.location.href
    }
    $scope.manageDowntime = function () {
        
        // VAlIDATION
        if($scope.addEquipment === null) {
            toaster.pop({type: 'warning', title: "Equipment Field Empty", body: "Please select an equipment from the dropdown"});
            return;
        } else if ($scope.type === null) {
            toaster.pop({type: 'warning', title: "Type not selected", body: "Please select the type of maintenance"});
            return;
        } else if ($scope.startDT === undefined) {
            toaster.pop({type: 'warning', title: "Start Time Empty", body: "Please enter a start time"});
            return;
        } else if ($scope.endDT === undefined) {
            toaster.pop({type: 'warning', title: "End Time Empty", body: "Please enter an end time"});
            return;
        } else if ($scope.dtDescription === undefined) {
            toaster.pop({type: 'warning', title: "Description Empty", body: "Please enter a description for the downtime"});
            return;
        } else {
            

            var start = $scope.startDT;
            var startDTunix = new Date(start).getTime();
            
            var end = $scope.endDT;
            var endDTunix = new Date(end).getTime();
            
            $scope.startDT = startDTunix;
            $scope.endDT = endDTunix;
            
            
            // parsedUnixTime==819898200
            firebase.database().ref('downtime/' + $scope.addEquipment).push({
            equipment: $scope.addEquipment,
            type : $scope.type,
            description: $scope.dtDescription,
            start: $scope.startDT,
            end: $scope.endDT
            });
            toaster.pop({type: 'Success', title: "Downtime Added", body: "A new downtime was added"});
            $scope.addEquipment = undefined;
            $scope.type = undefined;
            $scope.startDT = undefined;
            $scope.endDT = undefined;
            $scope.dtDescription = undefined;
            
        }
    };
    
    //////////////////PAGINATION STARTS
    
    $scope.currentPage = 1, $scope.numPerPage = 5, $scope.orderByField = 'equipment', $scope.reverseSort = false;
    $scope.$watch("filterWord", function (newVal, oldVal) {
        for (var i = 0; i < $scope.allDT.length; i++)
            $scope.allDT[i].filtered = $scope.allDT[i].equipment.toUpperCase().indexOf(newVal.toUpperCase()) === -1;
        paginationFunc();
    });
    $scope.$watch("allDT.length", paginationFunc);
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
        var allDT = $scope.allDT.filter(function (item) { return !item.filtered });
        $scope.numbers = Math.ceil(allDT.length / $scope.numPerPage);
        if ($scope.currentPage < 1) $scope.currentPage = 1;
        if ($scope.currentPage > $scope.numbers) $scope.currentPage = $scope.numbers;
        var begin = (($scope.currentPage - 1) * $scope.numPerPage), end = begin + $scope.numPerPage;
        $scope.filteredDowntime = allDT.slice(begin, end);
    }
    
    /////////////////PAGINATION ENDS
    
        
        var ref = firebase.database().ref();
        var data = ref.child("AllEquipments");
        var list = $firebaseArray(data);
        
        // for adding
        list.$loaded().then(function(data) {
                $scope.add = data;
                console.log($scope.add);
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
    
    
    //////////EDIT & DELETE DOWNTIME
    $scope.update = function (indexDT) {
        $scope.indexDTValue = $scope.allDT.findIndex(downtime => downtime.$id === indexDT);
    };
    $scope.saveDowntime = function () {

        var isEmpty = false;

        if ($scope.allDT[$scope.indexDTValue].type === "") {
            toaster.pop({ type: 'warning', title: "Type Field Empty", body: "Please enter a type" });
        } else if ($scope.allDT[$scope.indexDTValue].description === "") {
            toaster.pop({ type: 'warning', title: "Description Empty", body: "Please fill in the description" });
        } else {
            $scope.toEditDT = firebase.database().ref('downtime/' + $scope.allDT[$scope.indexDTValue].equipment + "/" + $scope.allDT[$scope.indexDTValue].$id);
            $scope.toEditDT.set({
                description: $scope.allDT[$scope.indexDTValue].description,
                end: $scope.allDT[$scope.indexDTValue].end,
                equipment: $scope.allDT[$scope.indexDTValue].equipment,
                start: $scope.allDT[$scope.indexDTValue].start,
                type: $scope.allDT[$scope.indexDTValue].type
            }
                
            ).then(function () {
                
                
                console.log($scope.indexDTValue);
                toaster.pop({ type: 'Success', title: "Success", body: "Downtime for Equipment " + $scope.allDT[$scope.indexDTValue].equipment + " was edited" });
                paginationFunc();
            });
        }

        $("#editDowntime .close").click();

    };
    
    
    $scope.deleteDowntime = function () {
        $scope.toDeleteDT = firebase.database().ref('downtime/' + $scope.allDT[$scope.indexDTValue].equipment + "/" + $scope.allDT[$scope.indexDTValue].$id);
        $scope.toDeleteDT.remove(function (event) {
            console.log(event);
        });
    };
    
    /////////////////////////////
    
$scope.percentageData = [];
           

$scope.refreshList = function () {
    angular.forEach ($scope.dtdata , function (d) { // looping through the dtdata
            var newref1 = firebase.database().ref().child("downtime"); // creating new reference
            var newdtdata = newref1.child(d.$id); // using the $id of the downtime node
            var newdtlist = $firebaseArray(newdtdata); // storing the values in a new firebasearray
            if($scope.equipment && $scope.equipment != "" && $scope.equipment && $scope.equipment != d.$id) return;
            
            newdtlist.$loaded().then(function() {
                angular.forEach (newdtlist, function (n) {
                    if($scope.type && $scope.type != "" && $scope.type != n.type) return;
                    $scope.allDT.push(n);
                    
                    $scope.equipmentLabels.push(n.equipment);
                    
//                    console.log(n);
                    
                    
                    
                    var start = new Date (n.start);
                    var end = new Date (n.end);
                    
                    var hours = Math.abs(end - start) / 36e5;
                    
                    
                    $scope.chartData.push(hours);
                    
                    var date = new Date();
                    var getYear = date.getFullYear();
                    
                    var firstDay = new Date(getYear,0,1);
                    var today = new Date (date.getTime());
                    
                    var difference = (Math.abs(firstDay - today) / 36e5) / 24;

                    $scope.totalDaysInYear = days_of_a_year(getYear);
                    $scope.totalOperationTime = difference * 24;
                    $scope.totalDownTime = 0;
                    
                    for(var x = 0 ; x < $scope.chartData.length ; x++) {
                        $scope.totalDownTime = $scope.chartData[x];
                    }
                    $scope.percentage = ($scope.totalDownTime/$scope.totalOperationTime) * 100;
                    $scope.percentageData.push($scope.percentage);
                    
                    
                    
                });
            });
                });
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
            
            $scope.refreshList();
            
            dtlist.$watch(function(event) {
                $scope.percentageData = [];
                $scope.allDT = [];
                $scope.equipmentLabels = [];
                $scope.chartData = [];
                $scope.dtdata = dtlist; // Getting Downtime node
                $scope.refreshList();
            });
            
            
            }).catch(function(error) {
                $scope.error = error;
            });

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

