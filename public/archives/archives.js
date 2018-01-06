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
    //                        console.log(date.getFullYear());
    //                        console.log($scope.checkYearStart);
                            $scope.archivedData.push(downtimeJson);
                        }
                        
                        console.log(downtimeJson);
                        
                    })
                })
            });
            
            }).catch(function(error) {
                $scope.error = error;
            });
    
    // ARCHIVES PAGINATION START
    
        $scope.currentPage = 1, $scope.numPerPage = 5, $scope.orderByField = 'equipment', $scope.reverseSort = false;

        $scope.$watch("archivedEquipment", function (newVal, oldVal) {

                for (var i = 0; i < $scope.archivedData.length; i++) {
                    if(newVal === undefined) {
                    newVal = "";
                    }

                    $scope.archivedData[i].filtered = $scope.archivedData[i].Equipment.toUpperCase().indexOf(newVal.toUpperCase()) === -1;
                            archivePaginationFunc();
                }
            });
        $scope.$watch("archivedData.length", archivePaginationFunc);
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
                var archivedData = $scope.archivedData.filter(function (item) { return !item.filtered });
                $scope.numbers = Math.ceil(archivedData.length / $scope.numPerPage);
                if ($scope.currentPage < 1) $scope.currentPage = 1;
                if ($scope.currentPage > $scope.numbers) $scope.currentPage = $scope.numbers;
                var begin = (($scope.currentPage - 1) * $scope.numPerPage), end = begin + $scope.numPerPage;
                $scope.filteredArchivedData = archivedData.slice(begin, end);
            }


    // ARCHIVES PAGINATION END
    
//    $scope.update = function (indexDT) {
//        $scope.indexDTValue = $scope.archivedData.findIndex(downtime => downtime.id === indexDT);
//        console.log($scope.indexDTValue);
//        console.log(indexDT);
//    };
//    
//    $scope.deleteArchivedDowntime = function () {
//        var txt;
//        var r = confirm("Are you sure you want to delete the archived downtime?");
//        if (r == true) {
//            
//            
//        $scope.toDeleteDT = firebase.database().ref('downtime/' + $scope.archivedData[$scope.indexDTValue].equipment + "/" + $scope.archivedData[$scope.indexDTValue].$id);
//        $scope.toDeleteDT.remove(function (event) {
//            console.log(event);
//        });
//        
//        } else {
//          
//        }
//    };
    
    
    }]);