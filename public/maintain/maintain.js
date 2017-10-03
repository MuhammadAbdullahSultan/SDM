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

app.filter("offset", function () {
	return function (input, start) {
        if (!input || !input.length) { return; }
		start = parseInt(start, 10);
		return input.slice(start);
	};
});

app.controller('maintainCtrl', ['$scope', '$firebaseObject', '$firebaseArray', 'toaster', function ($scope, $firebaseObject, $firebaseArray, toaster) {
    $scope.unitsInPage = 6;
	$scope.currentPage = 0;
    'use strict';
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
    
    //AddGroup
    $scope.groupA = [];
    var gref = firebase.database().ref();
    var gdata = gref.child('group');
    var glist = $firebaseArray(gdata);
    glist.$loaded().then(function(gg){
//        console.log(gg);
        
        angular.forEach(gg, function (g) {
//            console.log(g);
            $scope.groupA.push(g.group);
            console.log($scope.groupA);
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
    
    $(document).ready(function() {
      $('th').each(function(col) {
        $(this).hover(
        function() { $(this).addClass('focus'); },
        function() { $(this).removeClass('focus'); }
      );
        $(this).click(function() {
          if ($(this).is('.asc')) {
            $(this).removeClass('asc');
            $(this).addClass('desc selected');
            sortOrder = -1;
          }
          else {
            $(this).addClass('asc selected');
            $(this).removeClass('desc');
            sortOrder = 1;
          }
          $(this).siblings().removeClass('asc selected');
          $(this).siblings().removeClass('desc selected');
          var arrData = $('table').find('tbody >tr:has(td)').get();
          arrData.sort(function(a, b) {
            var val1 = $(a).children('td').eq(col).text().toUpperCase();
            var val2 = $(b).children('td').eq(col).text().toUpperCase();
            if($.isNumeric(val1) && $.isNumeric(val2))
            return sortOrder == 1 ? val1-val2 : val2-val1;
            else
               return (val1 < val2) ? -sortOrder : (val1 > val2) ? sortOrder : 0;
          });
          $.each(arrData, function(index, row) {
            $('tbody').append(row);
          });
        });
      });
    }); 
    
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

        $(function () {

            var obj = $('#pagination').twbsPagination({
                totalPages: $scope.data.length,
                visiblePages: 5,
                currentPage: 1,
                itemsOnPage: 4,

                onPageClick: function (event, page) {
                    console.info(page);
                }
            });
            console.info(obj.data());
        });
    
    //checkboxes table  
        $('.selectallAO').click(function() {
        this.checked ? $('.checkboxAO').prop('checked', true) : $('.checkboxAO').prop('checked', false);
    });
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
            list.$save($scope.indexValue).then (function (data) {
            toaster.pop({type: 'Success', title: "Success", body: "Equipment " +$scope.data[$scope.indexValue].$id +" was edited"});
            });
        }
        
        $("#editEquipment .close").click();

    };
    
    $scope.deleteEquipment = function () {
        var item = list[$scope.indexValue];
        list.$remove(item).then (function (deletedData) {
            console.log(deletedData);
        });
    };
    
    
        var ref = firebase.database().ref();
        var data = ref.child("AllEquipments");
        var list = $firebaseArray(data);
        
        
        list.$loaded().then(function(data) {
            $scope.data = data;
            console.log($scope.data[0].$id);
            angular.forEach ($scope.data , function (d) {
            console.log(d);
        $scope.equipment1 = d.$id;
        angular.forEach (d.system, function (e) {
            $scope.system1 = e;
        })
    });
        }).catch(function(error) {
            $scope.error = error;
        });
    
// Sorting table on click 
    $scope.sortType     = 'name'; // set the default sort type
    $scope.sortReverse  = false;  // set the default sort order
    $scope.search   = '';     // set the default search/filter term
    
    
    // Counting characters in text area.
    
    $("textarea").keyup(function(){
    $("#remainingC").text("Characters left: " + (50 - $(this).val().length));
});
    
    // SORTING ALGORITHM
	
	
	
	function randomNumber() {
		return Math.floor(Math.random()*101)
	}
    
}]);

$("#myModal .close").click();

