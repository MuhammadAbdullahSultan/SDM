/*global angular*/
var app = angular.module('archives', ['ngRoute', 'firebase', 'ngAnimate', 'ngSanitize']);

app.config(['$routeProvider', function ($routeProvider) {
    'use strict';
    $routeProvider.when('/archives', {
        templateUrl: 'archives/archives.html',
        controller: 'archivesCtrl'
    })
}]);

app.controller('archivesCtrl', ['$scope', '$firebaseObject', '$firebaseArray' , function ($scope, $firebaseObject, $firebaseArray) {
    
    // CALENDARS
    
    $('.dtFilter').datetimepicker({
        //language:  'fr',
		autoclose: 1,
		todayHighlight: 1,
		startView: 2,
		forceParse: 0,
        showMeridian: 1,
        format: "yyyy.mm.dd",
        startView: 2,
        minView: 4,
        endDate: '+1d'
    });
    
    $('.monthFilter').datetimepicker({
        //language:  'fr',
		autoclose: 1,
		todayHighlight: 1,
		startView: 2,
		forceParse: 0,
        showMeridian: 1,
        format: "yyyy.mm",
        startView: 4,
        minView: 3,
        endDate: '+1d'
    });
    
    $('.yearFilter').datetimepicker({
        //language:  'fr',
		autoclose: 1,
		todayHighlight: 1,
		startView: 2,
		forceParse: 0,
        showMeridian: 1,
        format: "yyyy",
        startView: 4,
        minView: 4,
    });
    
    
        var newref = firebase.database().ref();
        var dtdata = newref.child("downtime");
        var dtlist = $firebaseArray(dtdata);
        $scope.archivedData = [];
        $scope.allDT = [];

        dtlist.$loaded().then(function(dtlist) {
            $scope.dtdata = dtlist; // Getting Downtime node
            
             
            
                angular.forEach ($scope.dtdata, function(downt) {
                var excelref = firebase.database().ref().child("downtime"); // creating new reference
                var exceldtdata = excelref.child(downt.$id); // using the $id of the downtime node
                var excelList = $firebaseArray(exceldtdata); // storing the values in a new firebasearray
                
                excelList.$loaded().then(function() {
                    angular.forEach (excelList, function (downt) {
                        var downtimeJson = { "id": downt.$id, "Equipment": downt.equipment, "Start": moment(downt.start).format("DD/MMMM/YYYY HH:mm"), "End": moment(downt.end).format("DD/MMMM/YYYY HH:mm"), "Description": downt.description, "Type": downt.type };
                        
                        var copy = downt;
                    
                        var startConverstion = moment(copy.start).format("YYYY.MM.DD HH:mm");

                        $scope.checkYearStart = moment(copy.start).format("YYYY");

                        copy.start = startConverstion;

                        if (moment(copy.start).format("YYYY") !== new Date().getFullYear().toString()) {
                            $scope.archivedData.push(downtimeJson);
                        }
                        
                    })
                })
            });
            $scope.refresh();
            
             dtlist.$watch(function(event) {
                $scope.allDT = [];
                $scope.percentageData = [];
                $scope.equipmentLabels = [];
                $scope.chartData = [];
                
                $scope.dtdata = dtlist; // Getting Downtime node
                $scope.refresh();
            });
            
            }).catch(function(error) {
                $scope.error = error;
            });
    
    // FILTER CHANGE WILL CHANGE THE CHARTS BASED ON WHAT IS INSIDE THE TABLE
    
        $scope.filterChange = function () {
            $scope.percentageData = [];
            $scope.allDT = [];
            $scope.equipmentLabels = [];
            $scope.chartData = [];
            $scope.refresh();
        }
    
    // THIS BLOCK WILL REFRESH THE JSON LIST IF ANY CHANGES OCCUR
    
    $scope.downtimeHours = [];
    $scope.equipmentLabels = [];
    $scope.chartData = [];
    $scope.percentageData = [];
    
    $scope.refresh = function () {
        angular.forEach ($scope.dtdata , function (d) {
        // looping through the dtdata
            var newref1 = firebase.database().ref().child("downtime"); // creating new reference
            var newdtdata = newref1.child(d.$id); // using the $id of the downtime node
            var newdtlist = $firebaseArray(newdtdata); // storing the values in a new firebasearray
            
            // CHART FILTER START
            if($scope.equipment && $scope.equipment != "" && $scope.equipment && $scope.equipment != d.$id) return;
            // CHART FILTER END
        
        
            newdtlist.$loaded().then(function() {
                angular.forEach (newdtlist, function (n) {
                    
                    // CHART FILTER START
                                        
                    if($scope.type && $scope.type != "" && $scope.type != n.type) return;
                    
                    if($scope.dateFilter && $scope.dateFilter != "" && $scope.dateFilter != moment(n.start).format("YYYY.MM.DD")) return;
                    
                    if($scope.yearFilter && $scope.yearFilter != "" && $scope.yearFilter != moment(n.start).format("YYYY")) return;
                    
                    if($scope.monthFilter && $scope.monthFilter != "" && $scope.monthFilter != moment(n.start).format("YYYY.MM")) return;
                    
                    if($scope.dayFilter && $scope.dayFilter != "" && $scope.dayFilter != moment(n.start).format("YYYY.MM.DD")) return;
                    // CHART FILTER END
                    
                    var start = new Date (n.start);
                    var end = new Date (n.end);
                    var hours = Math.abs(end - start) / 36e5;
                    hours = parseFloat(Math.round(hours * 100) / 100).toFixed(2);
                    
                    // PUSHING THE HOURS CALCULATED TO THE ARRAY
                    
                    angular.forEach ($scope.dtdata, function (so) {
                        
                        var toPush = { "equipment": so.$id, "hours": hours };
                        $scope.downtimeHours.push(toPush);
                        
                    });
                    
                    // STORING THE LABLES
                    
                    if(moment(n.start).format("YYYY") !== new Date().getFullYear().toString()) {
                        var labels = [n.equipment];
                    }
                    
                    $.each(labels, function(i, el){
                        if($.inArray(el, $scope.equipmentLabels) === -1) {
                            $scope.equipmentLabels.push(el);
                            $scope.chartData.push(0);
                            $scope.percentageData.push(0);
                        }
                    });
                    
                    // FOR EQUIPMENT HOURS OF THE CHART
                    
                    for (var i = 0 ; i < $scope.equipmentLabels.length ; i++) {
                    if(moment(n.start).format("YYYY") !== new Date().getFullYear().toString()) {
                        if($scope.equipmentLabels[i] === n.equipment) {
                            $scope.chartData[i] += parseFloat(hours);
                        }
                    }
                        
                    }
                    
                    // CODE FOR CALCULATING THE PERCENTAGE
                                        
                    $scope.totalOperationTime = 8760; // THESE REFER TO THE HOURS IN THE ENTIRE YEAR WHICH WILL REMAIN CONSTANT
                    $scope.totalDownTime = 0;
                    
                    for(var x = 0 ; x < $scope.chartData.length ; x++) {
                        if(moment(n.start).format("YYYY") !== new Date().getFullYear().toString()) {
                            $scope.totalDownTime = $scope.chartData[x];
                        }
                    }
                                        
                    $scope.percentage = ($scope.totalDownTime/$scope.totalOperationTime) * 100;
                    $scope.percentage = parseFloat(Math.round($scope.percentage * 100) / 100).toFixed(2);
                    
                    
//                    $scope.uptime = ($scope.totalOperationTime - $scope.totalDownTime);
//                    $scope.uptime = parseFloat(Math.round($scope.uptime * 100) / 100).toFixed(2);
//                    
//                    $scope.upTimeData.push($scope.uptime);
                    
                  
                    for (var i = 0 ; i < $scope.equipmentLabels.length ; i++) {
                        
                        if($scope.equipmentLabels[i] === n.equipment) {
                            $scope.percentageData[i] += parseFloat($scope.percentage);
                        }
                    }
                    
                    // FOR STORING THE DATE FOR THE TABLE TO USE
                    
                    var copy = n;
                    
                    var startConverstion = moment(copy.start).format("YYYY.MM.DD HH:mm");
                    var endConverstion = moment(copy.end).format("YYYY.MM.DD HH:mm");
                    
                    copy.start = startConverstion;
                    copy.end= endConverstion;
                    
                    if (moment(copy.start).format("YYYY") !== new Date().getFullYear().toString()) {

                        $scope.allDT.push(copy);
                    }
                    
                    
                    
                    
                });
            });
                });
    }
    
    // ARCHIVES PAGINATION START
    
        $scope.currentPage = 1, $scope.numPerPage = 5, $scope.orderByField = 'equipment', $scope.reverseSort = false;

        $scope.$watch("archivedEquipment", function (newVal, oldVal) {

                for (var i = 0; i < $scope.allDT.length; i++) {
                    if(newVal === undefined) {
                    newVal = "";
                    }

                    $scope.allDT[i].filtered = $scope.allDT[i].equipment.toUpperCase().indexOf(newVal.toUpperCase()) === -1;
                            archivePaginationFunc();
                }
            });
        $scope.$watch("allDT.length", archivePaginationFunc);
            $scope.$watch("currentPage + numPerPage", archivePaginationFunc);
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
            function archivePaginationFunc() {
                var allDT = $scope.allDT.filter(function (item) { return !item.filtered });
                $scope.numbers = Math.ceil(allDT.length / $scope.numPerPage);
                if ($scope.currentPage < 1) $scope.currentPage = 1;
                if ($scope.currentPage > $scope.numbers) $scope.currentPage = $scope.numbers;
                var begin = (($scope.currentPage - 1) * $scope.numPerPage), end = begin + $scope.numPerPage;
                $scope.filteredArchivedData = allDT.slice(begin, end);
            }


    // ARCHIVES PAGINATION END
    
    $scope.update = function (indexDT) {
        $scope.indexDTValue = $scope.allDT.findIndex(downtime => downtime.$id === indexDT);
    };
    
    $scope.deleteArchivedDowntime = function () {
        var txt;
        var r = confirm("Are you sure you want to delete the archived downtime?");
        if (r == true) {
            
            
        $scope.toDeleteDT = firebase.database().ref('downtime/' + $scope.allDT[$scope.indexDTValue].equipment + "/" + $scope.allDT[$scope.indexDTValue].$id);
        $scope.toDeleteDT.remove(function (event) {
        });
            
        } else {
        }
    };
    
    
    // ARCHIVED TABLE DOWNLOAD
    
    $("document").ready(function() {
           $("#btnDown").click(function() {
             $scope.exportTools();
           });
         });
    
    var latestdate = new Date();
    var mystyle = {
        sheetid: 'Downtime List',
        headers: true,
        caption: {
          title:'Archived Downtime Data Table - created on: ' + moment(latestdate).format("DD, MMMM YYYY HH:mm"),
            
        },
        style:'background:#FFFFFF',
        column: {
          style: function (event) {
              return 'border: 1px green solid'
          }
        },
        columns: [
          {columnid:'Equipment', width:200},
          {columnid:'Start', width:200},
          {columnid:'End', width:200},
          {columnid:'Description', width:200},
          {columnid:'Type', width:200},
        ],
        
        row: {
            style: function(event) {
                return 'border: green solid; width: 1px';
            }
        }
   
    };
    
    
    $scope.exportTools = function () {
        alasql('SELECT * INTO XLS("Archived Downtime Data Table.xls",?) FROM ?',[mystyle, $scope.archivedData]);
        
    }
    
    
    
    
    // -------------------------------------------------------------------------------------------------------
    // CHART
    // -------------------------------------------------------------------------------------------------------    
    
    // CHART ON CLICK FUNCTION 
    
    $scope.onClick = function (points, evt) {
        $scope.descriptionPush = [];
        
        angular.forEach ($scope.dtdata , function (d) {
            var refDesc = firebase.database().ref().child("downtime");
            var descData = refDesc.child(d.$id);
            var newDescList = $firebaseArray(descData);
            
            newDescList.$loaded().then(function () {
                angular.forEach(newDescList , function (n) {
                    
                    if(points[0]._model.label === n.equipment) {
                                
                        var toPush = { "description": n.description, "start": moment(n.start).format("DD/MM/YYYY HH:mm"), "end": moment(n.end).format("DD/MM/YYYY HH:mm") };
                        
                        if(moment(n.start).format("YYYY") !== new Date().getFullYear().toString()) {
                            $scope.descriptionPush.push(toPush);
                        }



                    }
                    
                    
                    $scope.pointLabel = points[0]._model.label;
                })
            });
            
            
        });
        
        
        
        $scope.$apply();
    }

    
    //////////////////DOWNTIME HOUR CHART//////////
    
        $scope.chartOptions = {
            data: {
            datasets: [{
                fillColor: "rgba(14,72,100,1)",
                strokeColor: "brown",
                borderWidth: 1
            }]
        },
            title: {
                display: true,
                text: "Equipment Downtime",
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
                yAxes: [{id: 'y-axis-1', type: 'linear', position: 'left', ticks: {beginAtZero: true}}],
                xAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'Equipment Name'
                    },
                gridLines: {
                    color: "rgba(0, 0, 0, 0)",
                }
                }],
                yAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'Hours'
                    },
                gridLines: {
                    color: "rgba(0, 0, 0, 0)",
                }   
            }]
            }
            }
    /////////////////////////////////////////////
    
    ////////////////////PERCENTAGE CHART////////
    
    $scope.chartPercentOptions = {
            data: {
            datasets: [{
                fillColor: "rgba(14,72,100,1)",
                strokeColor: "brown",
                borderWidth: 1
            }]
        },
            title: {
                display: true,
                text: "Equipment Downtime Percentage",
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
                yAxes: [{id: 'y-axis-1', type: 'linear', position: 'left', ticks: {beginAtZero: true}}],
                xAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'Equipment Name'
                    },
                gridLines: {
                    color: "rgba(0, 0, 0, 0)",
                }
                }],
                yAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'Percentage (%)'
                    },
                gridLines: {
                    color: "rgba(0, 0, 0, 0)",
                }   
            }]
            }
            }
        
    
    ///////////////////////////////////////////// END CHARTS
    
    
    }]);