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
        var exists = false;



        for (var i = 0; i < $scope.equipments.length; i++) {
            if ($scope.equipmentToAdd === $scope.equipments[i].equipment) {
                toaster.pop({ type: 'warning', title: "Equipment Exists", body: "The equipment already exists" });
                return;
            }
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

    //PAGINATION//


    //checkboxes table  
    //        $('.selectallAO').click(function() {
    //        this.checked ? $('.checkboxAO').prop('checked', true) : $('.checkboxAO').prop('checked', false);
    //    });
    //maximum character in description   
    //    $('textarea').keypress(function(){
    //
    //    if(this.value.length == 50){
    //        return false;
    //    } else {
    //        $("#remainingC").html("Remaining characters : " + (49 - this.value.length));
    //    }
    //});

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

    $scope.deleteEquipment = function () {

        var item = $scope.equipments[$scope.indexValue];
        $scope.equipments.$remove(item).then(function (deletedData) {
            paginationFunc();
            console.log(deletedData);
        });
    };


    // -------------------------------------------------------------------------------------------------------
    // Loading all equipment
    // -------------------------------------------------------------------------------------------------------




    //        var ref = firebase.database().ref();
    //        var data = ref.child("AllEquipments");
    //        $scope.list = $firebaseArray(data);

    console.log($scope.equipments);
    //        $scope.equipment.$loaded().then(function(data) {

    //            console.log(data);
    //            $scope.newData = data;
    //            console.log($scope.newData);

    //            $scope.list.$watch(function(Event) {
    //                console.log(Event);
    //            })
    //            for(var i = 0 ; i < $scope.list.length ; i++) {
    //                $scope.data.push($scope.list[i]);
    //            }

    //            angular.forEach(data, function(d) {
    //                $scope.data.push(d);
    //            })
    //            $scope.list.$watch(function(event) {
    //                $scope.list = data;
    //              console.log(event);
    //            });
    //            console.log($scope.data);
    //        });



    //    console.log($scope.list);
    // Counting characters in text area.

    $("textarea").keyup(function () {
        $("#remainingC").text("Characters left: " + (50 - $(this).val().length));
    });



    // -------------------------------------------------------------------------------------------------------
    // PAGINATION/SORT/SEARCH
    // ------------------------------------------------------------------------------------------------------- 
    // $scope.currentPage = 1;
    // $scope.pageSize = 2;

    $scope.meals = [];
    for (var i = 1; i <= 100; i++) {
        var equipment = $scope.equipments[Math.floor(Math.random() * $scope.equipments.length)];
    }

    $scope.pageChangeHandler = function (num) {
        console.log('Page Number: ' + num);
    };

    //    // init
    //    
    //    $scope.sortingOrder = sortingOrder;
    //    $scope.reverse = false;
    //    $scope.filteredItems = [];
    //    $scope.itemsPerPage = 5;
    //    $scope.pagedItems = [];
    //    $scope.currentPage = 0;
    //    $scope.data = [];
    //
    //    
    ////    console.log($scope.filteredItems);
    ////    console.log($scope.groupedItems);
    ////    console.log($scope.pagedItems);
    //
    //
    //    var searchMatch = function (haystack, needle) {
    //        if (!needle) {
    //            return true;
    //        }
    //        return haystack.toString().toLowerCase().indexOf(needle.toLowerCase()) !== -1;
    //    };
    //
    //    // init the filtered items
    //    $scope.search = function () {
    //        $scope.filteredItems = $filter('filter')($scope.data, function (item) {
    //            for(var attr in item) {
    //                
    //                if (searchMatch(item[attr], $scope.query))
    //                    return true;
    //            }
    //            return false;
    //        });
    //        // take care of the sorting order
    //        if ($scope.sortingOrder !== '') {
    //            $scope.filteredItems = $filter('orderBy')($scope.filteredItems, $scope.sortingOrder, $scope.reverse);
    //        }
    //        $scope.currentPage = 0;
    //        // now group by pages
    //        $scope.groupToPages();
    //    };
    //    
    //    // calculate page in place
    //    $scope.groupToPages = function () {
    //        $scope.pagedItems = [];
    //        
    //        for (var i = 0; i < $scope.filteredItems.length; i++) {
    //            if (i % $scope.itemsPerPage === 0) {
    //                $scope.pagedItems[Math.floor(i / $scope.itemsPerPage)] = [ $scope.filteredItems[i] ];
    //            } else {
    //                $scope.pagedItems[Math.floor(i / $scope.itemsPerPage)].push($scope.filteredItems[i]);
    //            }
    //        }
    //    };
    //    
    //    $scope.range = function (start, end) {
    //        var ret = [];
    //        if (!end) {
    //            end = start;
    //            start = 0;
    //        }
    //        for (var i = start; i < end; i++) {
    //            ret.push(i);
    //        }
    //        return ret;
    //    };
    //    
    //    $scope.prevPage = function () {
    //        if ($scope.currentPage > 0) {
    //            $scope.currentPage--;
    //        }
    //    };
    //    
    //    $scope.nextPage = function () {
    //        if ($scope.currentPage < $scope.pagedItems.length - 1) {
    //            $scope.currentPage++;
    //        }
    //    };
    //    
    //    $scope.setPage = function () {
    //        $scope.currentPage = this.n;
    //    };
    //
    //    // functions have been describe process the data for display
    //    $scope.search();
    //
    //    // change sorting order
    //    $scope.sort_by = function(newSortingOrder) {
    //        if ($scope.sortingOrder == newSortingOrder)
    //            $scope.reverse = !$scope.reverse;
    //
    //        $scope.sortingOrder = newSortingOrder;
    //
    //        // icon setup
    //        $('th i').each(function(){
    //            // icon reset
    //            $(this).removeClass().addClass('icon-sort');
    //        });
    //        if ($scope.reverse)
    //            $('th.'+newSortingOrder+' i').removeClass().addClass('icon-chevron-up');
    //        else
    //            $('th.'+newSortingOrder+' i').removeClass().addClass('icon-chevron-down');
    //    };
    //    
}]);

$("#myModal .close").click();

app.filter('range', function () {
    return function (input, total) {
        total = parseInt(total);
        for (var i = 0; i < total; ++i) input.push(i);
        return input;
    };
});