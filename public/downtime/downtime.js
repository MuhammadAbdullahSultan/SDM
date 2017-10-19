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
    
    
    var ref = firebase.database().ref();
    
    var dtUpdatedRef = firebase.database().ref().child("downtimeUpdate");
    var dtUpdated = $firebaseArray(dtUpdatedRef);
    
    dtUpdated.$loaded().then(function (dtUpdated) {
        $scope.updatedDowntime = dtUpdated[0].$value;
    });
    
    'use strict';
    
    //////////// HTML TABLE TO EXCEL (XLSX)/////////
    
    $("document").ready(function() {
   $("#btnDown").click(function() {
     export_table_to_excel();
   });
 });

 function export_table_to_excel() {
   var wb = XLSX.utils.table_to_book($("#exTable")[0], {
     sheet: "Downtime List"
   });
   var wbout = XLSX.write(wb, {
     bookType: "xlsx",
     bookSST: true,
     type: 'binary'
   });

   try {
     saveAs(new Blob([s2ab(wbout)], {
       type: "application/octet-stream"
     }), "Downtime Data Table.xlsx");
   } catch (e) {
     if (typeof console != 'undefined') console.log(e, wbout);
   }

   return wbout;
 }

 function s2ab(s) {
   if (typeof ArrayBuffer !== 'undefined') {
     var buf = new ArrayBuffer(s.length);
     var view = new Uint8Array(buf);
     for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
     return buf;
   } else {
     var buf = new Array(s.length);
     for (var i = 0; i != s.length; ++i) buf[i] = s.charCodeAt(i) & 0xFF;
     return buf;
   }
 }
    
    /////ENDS///////////////////////////////////
    
    
    //////////////////DOWNLOAD DATA INTO PDF
    
    $scope.downloadHour = function () {
        var d_canvas = document.getElementById('hour');

            $('#downloadhr').click(function() {       
                html2canvas($("#hour"), {
                    onrendered: function(canvas) {         
                        var imgData = canvas.toDataURL(
                            'image/png');              
                        var doc = new jsPDF('p', 'mm', [419.53,  595.28]);
                        doc.addImage(imgData, 'PNG', 10, 10);
                        doc.save('Equipment Downtime.pdf');
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
                        doc.save('Equipment Downtime Percentage.pdf');
                    }
                });
            });
    }
    
    $scope.downloadHourDash = function () {
        var d_canvas = document.getElementById('hourdash');

            $('#downloadhrdash').click(function() {       
                html2canvas($("#hourdash"), {
                    onrendered: function(canvas) {         
                        var imgData = canvas.toDataURL(
                            'image/png');              
                        var doc = new jsPDF('p', 'mm', [419.53,  595.28]);
                        doc.addImage(imgData, 'PNG', 10, 10);
                        doc.save('Equipment Downtime Dashboard.pdf');
                    }
                });
            });
    }
    
    $scope.downloadPercentDash = function () {
        var d_canvas = document.getElementById('perdash');

            $('#downloadperdash').click(function() {       
                html2canvas($("#perdash"), {
                    onrendered: function(canvas) {         
                        var imgData = canvas.toDataURL(
                            'image/png');              
                        var doc = new jsPDF('p', 'mm', [419.53,  595.28]);
                        doc.addImage(imgData, 'PNG', 10, 10);
                        doc.save('Equipment Downtime Percentage Dashboard.pdf');
                    }
                });
            });
    }
    
//    $scope.DTPDF = function () {
//        var d_canvas = document.getElementById('tabledowntime');
//
//            $('#tablepdfdowntime').click(function() {       
//                html2canvas($("#tabledowntime"), {
//                    onrendered: function(canvas) {         
//                        var imgData = canvas.toDataURL(
//                            'image/png');              
//                        var doc = new jsPDF('p', 'mm', [419.53,  595.28]);
//                        doc.addImage(imgData, 'PNG', 10, 10);
//                        doc.save('Downtime Data.pdf');
//                    }
//                });
//            });
//    }
    
    
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
    
    $('.dtFilter').datetimepicker({
        //language:  'fr',
		autoclose: 1,
		todayHighlight: 1,
		startView: 2,
		forceParse: 0,
        showMeridian: 1,
        format: 'dd.mm.yyyy',
        startView: 2,
        minView: 4,
        endDate: '+1d'
    });
     
    $('.form_starttime').datetimepicker({
		autoclose: 1,
		todayHighlight: 1,
        format: 'yyyy.mm.dd hh:ii',
        todayBtn: 1,
        pickerPosition: "bottom-left",
        endDate: '+1d',
        })
        .on('changeDate', function (selected) {
        var minDate = new Date(selected.date.valueOf());
        $('.form_endtime').datetimepicker('setStartDate', minDate);
        
            });
    
    
        
    $('.form_endtime').datetimepicker({
        todayBtn:  1,
		autoclose: 1,
		todayHighlight: 1,
        format: 'yyyy.mm.dd hh:ii',
        pickerPosition: "bottom-left",
        endDate: '+1d',
        })
        .on('changeDate', function (selected) {
        var maxDate = new Date(selected.date.valueOf());
         $('.form_starttime').datetimepicker('setEndDate', maxDate);
            });
    $('.form_starttime [name="start"]').datetimepicker('setEndDate', '+0d');
    
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
 	    $("#hourdash").get(0).toBlob(function(blob) {
            saveAs(blob, "hour_chart.jpeg");
                });
        });
    }
    
    $scope.downloadImgHrDt = function () {
        $("#saveImgHrDt").click(function() {
 	    $("#hour").get(0).toBlob(function(blob) {
            saveAs(blob, "hour_chart.jpeg");
                });
        });
    }
    
    $scope.downloadImgPer = function () {
        $("#saveImgPer").click(function() {
 	    $("#perdash").get(0).toBlob(function(blob) {
            saveAs(blob, "percentage_chart.jpeg");
                });
        });
    }
    
    $scope.downloadImgPerDt = function () {
        $("#saveImgPerDt").click(function() {
 	    $("#percent").get(0).toBlob(function(blob) {
            saveAs(blob, "percentage_chart.jpeg");
                });
        });
    }
        
    
    
    
    // -------------------------------------------------------------------------------------------------------
    // CHART
    // -------------------------------------------------------------------------------------------------------    

    
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
                yAxes: [{id: 'y-axis-1', type: 'linear', position: 'left', ticks: {min: 0, max: 100}}],
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
                console.log(event);
                    console.log(elem);
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
        
    
    /////////////////////////////////////////////
        
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
            
            $scope.dtUpdate = firebase.database().ref('downtimeUpdate');
            var timeUpdated = new Date();
            $scope.timeUpdated = moment(timeUpdated).format("DD, MMMM YYYY HH:mm");
            $scope.dtUpdate.set({
                lastUpdated: $scope.timeUpdated
            });
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
        if($scope.filterWord === undefined) {
            $scope.filterWord = "";
        }
        for (var i = 0; i < $scope.allDT.length; i++)
            $scope.allDT[i].filtered = $scope.allDT[i].equipment.toUpperCase().indexOf(newVal.toUpperCase()) === -1;
        paginationFunc();
    });
//    
    $scope.$watch("dateFilter", function (newVal, oldVal) {
        if($scope.dateFilter === undefined) {
            $scope.dateFilter = "";
        }
        for (var i = 0; i < $scope.allDT.length; i++)
            $scope.allDT[i].filtered = $scope.allDT[i].start.indexOf(newVal) === -1;
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
    
    
    //////////EDIT & DELETE DOWNTIME
    $scope.update = function (indexDT) {
        $scope.indexDTValue = $scope.allDT.findIndex(downtime => downtime.$id === indexDT);
        console.log($scope.indexDTValue);
        console.log(indexDT);
    };
    
    
    
    
    $scope.saveDowntime = function () {
        
        var txt;
        var r = confirm("Are you sure you want to save the edited downtime?");
        if (r == true) {

        var isEmpty = false;

            if ($scope.allDT[$scope.indexDTValue].type === "") {
                toaster.pop({ type: 'warning', title: "Type Field Empty", body: "Please enter a type" });
            } else if ($scope.allDT[$scope.indexDTValue].description === "") {
                toaster.pop({ type: 'warning', title: "Description Empty", body: "Please fill in the description" });
            } else {

                $scope.toEditDT = firebase.database().ref('downtime/' + $scope.allDT[$scope.indexDTValue].equipment + "/" + $scope.allDT[$scope.indexDTValue].$id);
                $scope.dtUpdate = firebase.database().ref('downtimeUpdate');
                var timeUpdated = new Date();
                $scope.timeUpdated = moment(timeUpdated).format("DD, MMMM YYYY HH:mm");
                $scope.dtUpdate.set({
                    lastUpdated: $scope.timeUpdated
                });

                $scope.toEditDT.set({
                    description: $scope.allDT[$scope.indexDTValue].description,
                    end: $scope.allDT[$scope.indexDTValue].end,
                    equipment: $scope.allDT[$scope.indexDTValue].equipment,
                    start: $scope.allDT[$scope.indexDTValue].start,
                    type: $scope.allDT[$scope.indexDTValue].type
                }

                ).then(function () {


                    toaster.pop({ type: 'Success', title: "Success", body: "Downtime for Equipment " + $scope.allDT[$scope.indexDTValue].equipment + " was edited" });
                    paginationFunc();
                });
            }

            $("#editDowntime .close").click();
        }
        else {
           
        }
    };
    
    
    $scope.deleteDowntime = function () {
        
        var txt;
        var r = confirm("Are you sure you want to delete the downtime?");
        if (r == true) {
            
            $scope.dtUpdate = firebase.database().ref('downtimeUpdate');
            var timeUpdated = new Date();
            $scope.timeUpdated = moment(timeUpdated).format("DD, MMMM YYYY HH:mm");
            $scope.dtUpdate.set({
                lastUpdated: $scope.timeUpdated
            });
            
            
            $scope.toDeleteDT = firebase.database().ref('downtime/' + $scope.allDT[$scope.indexDTValue].equipment + "/" + $scope.allDT[$scope.indexDTValue].$id);
        $scope.toDeleteDT.remove(function (event) {
        });
        
        } else {
           
        }
    };
    
    /////////////////////////////
    
$scope.percentageData = [];
$scope.upTimeData = [];
    
    $scope.checkChart = function () {
        console.log($scope.allDT);
    }
           

    $scope.displayFiltered = function () {
        console.log($scope.filteredDowntime);
        console.log($scope.percentage);
        console.log($scope.upTimeData);
        
    }
$scope.downtimeHours = [];
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
                    
                        
            
                    var start = new Date (n.start);
                    var end = new Date (n.end);
                    
                    var hours = Math.abs(end - start) / 36e5;
                    hours = parseFloat(Math.round(hours * 100) / 100).toFixed(2);
                                        
//                    console.log(n.equipment);
                    
                    
                    
                    angular.forEach ($scope.dtdata, function (so) {
                        var toPush = { "equipment": so.$id, "hours": hours };
                        $scope.downtimeHours.push(toPush);
                        console.log($scope.downtimeHours);
                    });
                    
                    $scope.chartData.push(hours);
                    
                    angular.forEach($scope.downtimeHours , function (l) {
//                            console.log(l);
                            console.log(n.equipment);
                        if (l.equipment === n.equipment) {
                            l.hours += hours;
                            $scope.equipmentss = l.equipment;
                        }
                            
                        
                    })
                    
                    
                    console.log($scope.chartData);
                    
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
                    $scope.percentage = parseFloat(Math.round($scope.percentage * 100) / 100).toFixed(2);
                    
                    $scope.uptime = ($scope.totalOperationTime - $scope.totalDownTime);
                    $scope.uptime = parseFloat(Math.round($scope.uptime * 100) / 100).toFixed(2);
                    
                    $scope.upTimeData.push($scope.uptime);
                    $scope.percentageData.push($scope.percentage);
                    
                    
                    var copy = n;
                    
                    var startConverstion = moment(copy.start).format("DD.MM.YYYY HH:mm");
                    var endConverstion = moment(copy.end).format("DD.MM.YYYY HH:mm");

                    // Will display time in 10:30:23 format
                    
                    copy.start = startConverstion;
                    copy.end= endConverstion;
                    
                    $scope.allDT.push(copy);
                    
                    $scope.equipmentLabels.push($scope.equipmentss);
                    
                });
            });
                });
}
    
    $scope.descriptionPush = [];
    $scope.onClick = function (points, evt) {
        $scope.descriptionPush = [];
        
        console.log(points);
        console.log(evt);
        angular.forEach ($scope.dtdata , function (d) {
            var refDesc = firebase.database().ref().child("downtime");
            var descData = refDesc.child(d.$id);
            var newDescList = $firebaseArray(descData);
            
            newDescList.$loaded().then(function () {
                angular.forEach(newDescList , function (n) {
                    console.log(n);
                    
                    if(points[0]._model.label === n.equipment) {
                                
                        var toPush = { "description": n.description, "start": moment(n.start).format("DD/MM/YYYY HH:mm"), "end": moment(n.end).format("DD/MM/YYYY HH:mm") };
                        
                        $scope.descriptionPush.push(toPush);


                        console.log($scope.descriptionPush);
                        
                        
                        
                    }
                    $scope.pointLabel = points[0]._model.label;
                })
            });
            
            
        });
        
        
        
        $scope.$apply();
      };
    
    // -------------------------------------------------------------------------------------------------------
    //RETRIEVING ALL DOWNTIMES
    // -------------------------------------------------------------------------------------------------------
    
    
    window.onload = function () {
        $scope.type = true;
        
    }
        var newref = firebase.database().ref();
        var dtdata = newref.child("downtime");
        var dtlist = $firebaseArray(dtdata);
        var push = false;
        var startDate = new Date();
        
            $scope.filterChange = function () {
                $scope.percentageData = [];
                $scope.allDT = [];
                $scope.equipmentLabels = [];
                $scope.chartData = [];
                $scope.refreshList();
            }
        
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

