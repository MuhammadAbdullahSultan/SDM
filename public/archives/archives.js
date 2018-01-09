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
            console.log($scope.allDT);
            $scope.refresh();
            
             dtlist.$watch(function(event) {
                $scope.allDT = [];
                
                $scope.dtdata = dtlist; // Getting Downtime node
                $scope.refresh();
            });
            
            }).catch(function(error) {
                $scope.error = error;
            });
    
    // THIS BLOCK WILL REFRESH THE JSON LIST IF ANY CHANGES OCCUR
    
    $scope.refresh = function () {
        angular.forEach ($scope.dtdata , function (d) {
        // looping through the dtdata
            var newref1 = firebase.database().ref().child("downtime"); // creating new reference
            var newdtdata = newref1.child(d.$id); // using the $id of the downtime node
            var newdtlist = $firebaseArray(newdtdata); // storing the values in a new firebasearray
        
        
            newdtlist.$loaded().then(function() {
                angular.forEach (newdtlist, function (n) {
                    
                    var copy = n;
                    
                    var startConverstion = moment(copy.start).format("YYYY.MM.DD HH:mm");
                    var endConverstion = moment(copy.end).format("YYYY.MM.DD HH:mm");
                    
                    copy.start = startConverstion;
                    copy.end= endConverstion;
                    
//                    console.log(moment(copy.start).format("YYYY"));
                    if (moment(copy.start).format("YYYY") !== new Date().getFullYear().toString()) {
//                        console.log(date.getFullYear());
//                        console.log($scope.checkYearStart);
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
        console.log($scope.indexDTValue);
        console.log(indexDT);
    };
    
    $scope.deleteArchivedDowntime = function () {
        var txt;
        var r = confirm("Are you sure you want to delete the archived downtime?");
        if (r == true) {
            
            
        $scope.toDeleteDT = firebase.database().ref('downtime/' + $scope.allDT[$scope.indexDTValue].equipment + "/" + $scope.allDT[$scope.indexDTValue].$id);
        $scope.toDeleteDT.remove(function (event) {
            console.log(event);
        });
            
        } else {
            console.log($scope.allDT);
            console.log($scope.allDT[$scope.indexDTValue].equipment);
            console.log($scope.allDT[$scope.indexDTValue].$id);
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
        console.log($scope.archivedData);
        alasql('SELECT * INTO XLS("Archived Downtime Data Table.xls",?) FROM ?',[mystyle, $scope.archivedData]);
        
    }
    
    
    }]);