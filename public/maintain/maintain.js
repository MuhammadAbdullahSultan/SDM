/*global angular*/
var app = angular.module('maintain', ['ngRoute', 'firebase']);

app.config(['$routeProvider', function ($routeProvider) {
    'use strict';
    $routeProvider.when('/maintain', {
        templateUrl: 'maintain/maintain.html',
        controller: 'maintainCtrl',
        resolve: {
            // controller will not be loaded until $waitForSignIn resolves
            // Auth refers to our $firebaseAuth wrapper in the factory below
            "currentAuth": ["Auth", function (Auth) {
                // $waitForSignIn returns a promise so the resolve waits for it to complete
                return Auth.$requireSignIn();
            }]
        }
    });
}]);



app.controller('maintainCtrl', ['$scope', '$firebaseArray', 'toaster', '$filter', function ($scope, $firebaseArray, toaster, $filter) {


    var ref = firebase.database().ref();


    'use strict';

    // -------------------------------------------------------------------------------------------------------
    // PAGINATION
    // -------------------------------------------------------------------------------------------------------


    $scope.message;

    //Auto capitalize Equipment input
    $(document).ready(function () {
        $('#equiedit').keyup(function () {
            var val = $(this).val()
            $(this).val(val.toUpperCase());
        });

        $('#equiedit').on('keypress', function () {
            var $this = $(this), value = $this.val();
            if (value.length === 1) {
                $this.val(value.charAt(0).toUpperCase());
            }
        });
    })
    
    $(document).ready(function () {
        $('#equiadd').keyup(function () {
            var val = $(this).val()
            $(this).val(val.toUpperCase());
        });

        $('#equiadd').on('keypress', function () {
            var $this = $(this), value = $this.val();
            if (value.length === 1) {
                $this.val(value.charAt(0).toUpperCase());
            }
        });
    })

    // -------------------------------------------------------------------------------------------------------
    // GET GROUP VALUES
    // -------------------------------------------------------------------------------------------------------

    //    var gref = firebase.database().ref();
    //    var gdata = gref.child('group');
    //    var glist = $firebaseArray(gdata);
    //    glist.$loaded().then(function(gg){
    ////        console.log(gg);
    //        
    //        angular.forEach(gg, function (g) {
    ////            console.log(g);
    //            $scope.groupA.push(g.group);
    //        })
    //        
    //    }).catch (function (error){
    //        console.log(error);
    //    });

    $scope.groups = $firebaseArray(ref.child('group'));
    console.log($scope.groups);
    $scope.addGroup = function () {

        if ($scope.groot == undefined) {
            toaster.pop({ type: 'Error', title: "Error", body: "Please enter group" });
            return;
        } else {
            $scope.groups.$add({
                group: $scope.groot
            });
            toaster.pop({ type: 'success', title: "Success", body: "New Group added" });
            $scope.groot = undefined;

        }




    }

    /////////////PAGINATION, SORT, FILTER STARTS
    $scope.currentPage = 1, $scope.numPerPage = 5, $scope.orderByField = 'equipment', $scope.reverseSort = false;
    $scope.$watch("filterWord", function (newVal, oldVal) {
        for (var i = 0; i < $scope.equipments.length; i++)
            $scope.equipments[i].filtered = $scope.equipments[i].equipment.toUpperCase().indexOf(newVal.toUpperCase()) === -1;
        paginationFunc();
    });
    $scope.$watch("equipments.length", paginationFunc);
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
        var equipments = $scope.equipments.filter(function (item) { return !item.filtered });
        $scope.numbers = Math.ceil(equipments.length / $scope.numPerPage);
        if ($scope.currentPage < 1) $scope.currentPage = 1;
        if ($scope.currentPage > $scope.numbers) $scope.currentPage = $scope.numbers;
        var begin = (($scope.currentPage - 1) * $scope.numPerPage), end = begin + $scope.numPerPage;
        $scope.filteredEquipments = equipments.slice(begin, end);
    }
///////////PAGINATION ENDS
    
    $scope.equipments = $firebaseArray(ref.child('AllEquipments'));
    $scope.writeUserData = function () {
        



        for (var i = 0; i < $scope.equipments.length; i++) {
            if ($scope.equipmentToAdd === $scope.equipments[i].equipment) {
                toaster.pop({ type: 'warning', title: "Equipment Exists", body: "The equipment already exists" });
                return;
            }
            break;
        }

        if ($scope.equipmentToAdd === undefined) {
            toaster.pop({ type: 'warning', title: "Equipment Field Empty", body: "Please enter an equipment" });
            return;
        } else if ($scope.descToAdd === undefined) {
            toaster.pop({ type: 'warning', title: "Description Empty", body: "Please fill in the description" });
            return;
        } else if ($scope.systemToAdd === undefined) {
            toaster.pop({ type: 'warning', title: "System Field Empty", body: "Please enter a system" });
            return;
        } else if ($scope.groupToAdd === undefined) {
            toaster.pop({ type: 'warning', title: "Group Field Empty", body: "Please select a group, or add a new group" });
            return;
        } else {
            $scope.equipments.$add({
                equipment: $scope.equipmentToAdd,
                system: $scope.systemToAdd,
                description: $scope.descToAdd,
                group: $scope.groupToAdd
            });
            toaster.pop({ type: 'Success', title: "New Equipment", body: "A new equipment was added" });
            $scope.equipmentToAdd = undefined;
            $scope.descToAdd = undefined;
            $scope.systemToAdd = undefined;
            $scope.groupToAdd = undefined;
        }

    };


    $('.dropdown-menu input').click(function (e) {
        e.stopPropagation();
    });
    $('.dropdown-menu li').click(function () {

        $('.dropdown-toggle b').remove().appendTo($('.dropdown-toggle').text($(this).text()));
    });


    $scope.update = function (id) {
        $scope.indexValue = $scope.equipments.findIndex(equipment => equipment.$id === id);
    };

    $scope.saveEquipment = function () {

        var isEmpty = false;

        if ($scope.equipments[$scope.indexValue].system === "") {
            toaster.pop({ type: 'warning', title: "Equipment Field Empty", body: "Please enter a system" });
        } else if ($scope.equipments[$scope.indexValue].description === "") {
            toaster.pop({ type: 'warning', title: "Description Empty", body: "Please fill in the description" });
        } else if ($scope.equipments[$scope.indexValue].group === "") {
            toaster.pop({ type: 'warning', title: "Group Field Empty", body: "Please select a group, or add a new group" });
        } else {
            $scope.equipments.$save($scope.indexValue).then(function (data) {
                toaster.pop({ type: 'Success', title: "Success", body: "Equipment " + $scope.equipments[$scope.indexValue].equipment + " was edited" });
                paginationFunc();
            });
        }

        $("#editEquipment .close").click();

    };

    // -------------------------------------------------------------------------------------------------------
    // DELETING EQUIPMENT
    // -------------------------------------------------------------------------------------------------------
            $scope.getDowntime = $firebaseArray(ref.child('downtime'));

    $scope.pressMeSenpai = function () {
        
    }
    $scope.deleteEquipment = function () {
        
            for(var i = 0 ; i < $scope.getDowntime.length ; i++) {
            if($scope.getDowntime[i].$id === $scope.equipments[$scope.indexValue].equipment) {
                toaster.pop({ type: 'error', title: "Error", body: "Equipment " + $scope.equipments[$scope.indexValue].equipment + " already has an existing downtime. Please delete all the downtimes related." });
                exists = true;
                return;
            }
            break;
        }
            exists = false;
            var item = $scope.equipments[$scope.indexValue];
            console.log(item);
            $scope.equipments.$remove(item).then(function (deletedData) {
            paginationFunc();
            console.log(deletedData);
            });
        
        
        
    }


    $("textarea").keyup(function () {
        $("#remainingC").text("Characters left: " + (50 - $(this).val().length));
    });

}]);

$("#myModal .close").click();

app.filter('range', function () {
    return function (input, total) {
        total = parseInt(total);
        for (var i = 0; i < total; ++i) input.push(i);
        return input;
    };
});