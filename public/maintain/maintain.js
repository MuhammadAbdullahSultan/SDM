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
          "currentAuth": ["Auth", function(Auth) {
            // $waitForSignIn returns a promise so the resolve waits for it to complete
            return Auth.$requireSignIn();
          }]
        }
    });
}]);

app.controller('maintainCtrl', ['$scope', '$firebaseArray', 'toaster', '$filter', function ($scope, $firebaseArray, toaster, $filter) {
    
    
    
    

    'use strict';
    
    // -------------------------------------------------------------------------------------------------------
    // PAGINATION
    // -------------------------------------------------------------------------------------------------------
    
    
    $scope.message;
    
    //Auto capitalize Equipment input
    $(document).ready(function() {
    $('#equi').keyup(function() {
        var val = $(this).val()
        $(this).val(val.toUpperCase());
    });
    
    $('#equi').on('keypress', function() { 
        var $this = $(this), value = $this.val(); 
        if (value.length === 1) { 
            $this.val( value.charAt(0).toUpperCase() );
        }  
    });
})
    
    // -------------------------------------------------------------------------------------------------------
    // GET GROUP VALUES
    // -------------------------------------------------------------------------------------------------------

    $scope.groupA = [];
    var gref = firebase.database().ref();
    var gdata = gref.child('group');
    var glist = $firebaseArray(gdata);
    glist.$loaded().then(function(gg){
//        console.log(gg);
        
        angular.forEach(gg, function (g) {
//            console.log(g);
            $scope.groupA.push(g.group);
        })
    }).catch (function (error){
        console.log(error);
    });
    
    $scope.addGroup = function(){
        firebase.database().ref('group/').push({
            group: $scope.groot
        });
        
    }
    
    //Sort
    
//    $(document).ready(function() {
//      $('th').each(function(col) {
//        $(this).hover(
//        function() { $(this).addClass('focus'); },
//        function() { $(this).removeClass('focus'); }
//      );
//        $(this).click(function() {
//          if ($(this).is('.asc')) {
//            $(this).removeClass('asc');
//            $(this).addClass('desc selected');
//            sortOrder = -1;
//          }
//          else {
//            $(this).addClass('asc selected');
//            $(this).removeClass('desc');
//            sortOrder = 1;
//          }
//          $(this).siblings().removeClass('asc selected');
//          $(this).siblings().removeClass('desc selected');
//          var arrData = $('table').find('tbody >tr:has(td)').get();
//          arrData.sort(function(a, b) {
//            var val1 = $(a).children('td').eq(col).text().toUpperCase();
//            var val2 = $(b).children('td').eq(col).text().toUpperCase();
//            if($.isNumeric(val1) && $.isNumeric(val2))
//            return sortOrder == 1 ? val1-val2 : val2-val1;
//            else
//               return (val1 < val2) ? -sortOrder : (val1 > val2) ? sortOrder : 0;
//          });
//          $.each(arrData, function(index, row) {
//            $('tbody').append(row);
//          });
//        });
//      });
//    }); 
    
    /////////////////////////
    
    $scope.writeUserData = function () {
        var exists = false;
        

        
        for(var i = 0 ; i < $scope.data.length ; i++) {
            if($scope.equipmentToAdd === $scope.data[i].$id) {
                toaster.pop({type: 'warning', title: "Equipment Exists", body: "The equipment already exists"});
                return;
            }
            break;
        }
        
        if($scope.equipmentToAdd === undefined) {
            toaster.pop({type: 'warning', title: "Equipment Field Empty", body: "Please enter an equipment"});
            return;
        } else if ($scope.descToAdd === undefined) {
            toaster.pop({type: 'warning', title: "Description Empty", body: "Please fill in the description"});
            return;
        } else if ($scope.systemToAdd === undefined) {
            toaster.pop({type: 'warning', title: "System Field Empty", body: "Please enter a system"});
            return;
        } else if ($scope.groupToAdd === undefined) {
            toaster.pop({type: 'warning', title: "Group Field Empty", body: "Please select a group, or add a new group"});
            return;
        } else {
            firebase.database().ref('AllEquipments/' + $scope.equipmentToAdd).set({
                    system: $scope.systemToAdd,
                    description: $scope.descToAdd,
                    group: $scope.groupToAdd
                });
            toaster.pop({type: 'Success', title: "New Equipment", body: "A new equipment was added"});
            $scope.equipmentToAdd= undefined;
            $scope.descToAdd= undefined;
            $scope.systemToAdd= undefined;
            $scope.groupToAdd= undefined;
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
$('.dropdown-menu li').click(function(){
 
$('.dropdown-toggle b').remove().appendTo($('.dropdown-toggle').text($(this).text()));
});
    
    
    $scope.update = function (index) {
        $scope.indexValue = index;
    };
    
    $scope.saveEquipment = function () {
        
        var isEmpty = false;
    
        if($scope.data[$scope.indexValue].system === "") {
            toaster.pop({type: 'warning', title: "Equipment Field Empty", body: "Please enter a system"});
        } else if ($scope.data[$scope.indexValue].description === "") {
            toaster.pop({type: 'warning', title: "Description Empty", body: "Please fill in the description"});
        } else if ($scope.data[$scope.indexValue].group === "") {
            toaster.pop({type: 'warning', title: "Group Field Empty", body: "Please select a group, or add a new group"});
        } else {
            $scope.list.$save($scope.indexValue).then (function (data) {
            toaster.pop({type: 'Success', title: "Success", body: "Equipment " +$scope.data[$scope.indexValue].$id +" was edited"});
            });
        }
        
        $("#editEquipment .close").click();

    };
    
    // -------------------------------------------------------------------------------------------------------
    // DELETING EQUIPMENT
    // -------------------------------------------------------------------------------------------------------
    
    $scope.deleteEquipment = function () {
        
        var item = $scope.list[$scope.indexValue];
        $scope.list.$remove(item).then (function (deletedData) {
            console.log(deletedData);
        });
    };
    
    
    // -------------------------------------------------------------------------------------------------------
    // Loading all equipment
    // -------------------------------------------------------------------------------------------------------
    
    
        
    
        var ref = firebase.database().ref();
        var data = ref.child("AllEquipments");
        $scope.list = $firebaseArray(data);
        

        $scope.list.$loaded().then(function(data) {
//            $scope.newData = data;
//            console.log($scope.newData);
            var newref = firebase.database().ref().child("AllEquipments");
            var newdata = newref.child(data.$id);
            $scope.newlist = $firebaseArray(newdata);
            
            
            sceope.newlist.loaded().then (function(n) {
                console.log(n);
            })
            for(var i = 0 ; i < $scope.list.length ; i++) {
                $scope.list[i].$priority = 0;
                $scope.data.push($scope.list[i]);
            }
            
//            angular.forEach(data, function(d) {
//                $scope.data.push(d);
//            })
            $scope.list.$watch(function(event) {
                $scope.list = data;
              console.log(event);
            });
            console.log($scope.data);
        });
    
    
    
//    console.log($scope.list);
    // Counting characters in text area.
    
    $("textarea").keyup(function(){
    $("#remainingC").text("Characters left: " + (50 - $(this).val().length));
    });
    
	
    
    // -------------------------------------------------------------------------------------------------------
    // PAGINATION/SORT/SEARCH
    // ------------------------------------------------------------------------------------------------------- 
    
    // init
    
    $scope.sortingOrder = sortingOrder;
    $scope.reverse = false;
    $scope.filteredItems = [];
    $scope.itemsPerPage = 5;
    $scope.pagedItems = [];
    $scope.currentPage = 0;
    $scope.data = [];

    
//    console.log($scope.filteredItems);
//    console.log($scope.groupedItems);
//    console.log($scope.pagedItems);


    var searchMatch = function (haystack, needle) {
        if (!needle) {
            return true;
        }
        return haystack.toString().toLowerCase().indexOf(needle.toLowerCase()) !== -1;
    };

    // init the filtered items
    $scope.search = function () {
        $scope.filteredItems = $filter('filter')($scope.data, function (item) {
            for(var attr in item) {
                
                if (searchMatch(item[attr], $scope.query))
                    return true;
            }
            return false;
        });
        // take care of the sorting order
        if ($scope.sortingOrder !== '') {
            $scope.filteredItems = $filter('orderBy')($scope.filteredItems, $scope.sortingOrder, $scope.reverse);
        }
        $scope.currentPage = 0;
        // now group by pages
        $scope.groupToPages();
    };
    
    // calculate page in place
    $scope.groupToPages = function () {
        $scope.pagedItems = [];
        
        for (var i = 0; i < $scope.filteredItems.length; i++) {
            if (i % $scope.itemsPerPage === 0) {
                $scope.pagedItems[Math.floor(i / $scope.itemsPerPage)] = [ $scope.filteredItems[i] ];
            } else {
                $scope.pagedItems[Math.floor(i / $scope.itemsPerPage)].push($scope.filteredItems[i]);
            }
        }
    };
    
    $scope.range = function (start, end) {
        var ret = [];
        if (!end) {
            end = start;
            start = 0;
        }
        for (var i = start; i < end; i++) {
            ret.push(i);
        }
        return ret;
    };
    
    $scope.prevPage = function () {
        if ($scope.currentPage > 0) {
            $scope.currentPage--;
        }
    };
    
    $scope.nextPage = function () {
        if ($scope.currentPage < $scope.pagedItems.length - 1) {
            $scope.currentPage++;
        }
    };
    
    $scope.setPage = function () {
        $scope.currentPage = this.n;
    };

    // functions have been describe process the data for display
    $scope.search();

    // change sorting order
    $scope.sort_by = function(newSortingOrder) {
        if ($scope.sortingOrder == newSortingOrder)
            $scope.reverse = !$scope.reverse;

        $scope.sortingOrder = newSortingOrder;

        // icon setup
        $('th i').each(function(){
            // icon reset
            $(this).removeClass().addClass('icon-sort');
        });
        if ($scope.reverse)
            $('th.'+newSortingOrder+' i').removeClass().addClass('icon-chevron-up');
        else
            $('th.'+newSortingOrder+' i').removeClass().addClass('icon-chevron-down');
    };
    
}]);

$("#myModal .close").click();

