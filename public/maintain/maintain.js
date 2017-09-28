/*global angular*/
var app = angular.module('maintain', ['ngRoute', 'firebase']);

app.config(['$routeProvider', function ($routeProvider) {
    'use strict';
    $routeProvider.when('/maintain', {
        templateUrl: 'maintain/maintain.html',
        controller: 'maintainCtrl'
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
    
    $scope.writeUserData = function () {
        var isEmpty = false;
        
        angular.forEach ($scope.data , function (d) {
            
    });
        if($scope.equipmentToAdd === undefined) {
            toaster.pop({type: 'warning', title: "Equipment Field Empty", body: "Please enter an equipment"});
        } else if ($scope.descToAdd === undefined) {
            toaster.pop({type: 'warning', title: "Description Empty", body: "Please fill in the description"});
        } else if ($scope.systemToAdd === undefined) {
            toaster.pop({type: 'warning', title: "System Field Empty", body: "Please enter a system"});
        } else if ($scope.groupToAdd === undefined) {
            toaster.pop({type: 'warning', title: "Group Field Empty", body: "Please select a group, or add a new group"});
        } else {
            firebase.database().ref('AllEquipments/' + $scope.equipmentToAdd).set({
                    system: $scope.systemToAdd,
                    description: $scope.descToAdd,
                    group: $scope.groupToAdd
                });
            toaster.pop({type: 'Success', title: "New Equipment", body: "A new equipment was added"});
        }
        
};
    //checkboxes table  
        $('.selectallAO').click(function() {
        this.checked ? $('.checkboxAO').prop('checked', true) : $('.checkboxAO').prop('checked', false);
    });
 //maximum character in description   
    $('textarea').keypress(function(){

    if(this.value.length > 100){
        return false;
    }
    $("#remainingC").html("Remaining characters : " +(50 - this.value.length));
});
    
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
        
        angular.forEach ($scope.data , function (d) {
            
    });
        if($scope.data[$scope.indexValue].system === "") {
            toaster.pop({type: 'warning', title: "Equipment Field Empty", body: "Please enter a system"});
        } else if ($scope.data[$scope.indexValue].description === "") {
            toaster.pop({type: 'warning', title: "Description Empty", body: "Please fill in the description"});
        } else if ($scope.data[$scope.indexValue].group === "") {
            toaster.pop({type: 'warning', title: "Group Field Empty", body: "Please select a group, or add a new group"});
        } else {
//            firebase.database().ref('AllEquipments/' + $scope.editEquipment).set({
//            system: $scope.data[$scope.indexValue].system,
//            description: $scope.data[$scope.indexValue].description,
//            group: $scope.data[$scope.indexValue].group
//            });
            list.$save($scope.indexValue).then (function (data) {
            toaster.pop({type: 'Success', title: "Success", body: "Equipment " +$scope.data[$scope.indexValue].$id +" was edited"});
            });
            
        }
        
        
        
    };
    
    $scope.deleteEquipment = function () {
        var item = list[$scope.indexValue];
        list.$remove(item).then (function (deletedData) {
            console.log(deletedData);
        });
    }
    
    
        var ref = firebase.database().ref();
        var data = ref.child("AllEquipments");
        var list = $firebaseArray(data);
        
        
        list.$loaded().then(function(data) {
            $scope.data = data;
            console.log($scope.data[0].$id);
            angular.forEach ($scope.data , function (d) {
        $scope.equipment1 = d.$id;
        angular.forEach (d.system, function (e) {
            $scope.system1 = e;
        })
    });
        }).catch(function(error) {
            $scope.error = error;
        });
    
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
    
    
    // Counting characters in text area.
    
    $("#textarea").keyup(function(){
  $("#count").text("Characters left: " + (100 - $(this).val().length));
});
    
}]);

    $(function () {
    $(".custom-close").on('click', function() {
        $('#myModal').modal('hide');
        });
    });

    
    $('body').removeClass('modal-open');
    $('.modal-backdrop fade in').remove();
function edit_row(no)
{
 document.getElementById("edit_button"+no).style.display="none";
 document.getElementById("save_button"+no).style.display="block";
	
 var name=document.getElementById("name_row"+no);
 var country=document.getElementById("country_row"+no);
 var age=document.getElementById("age_row"+no);
 var group=document.getElementById("group_row"+no);
	
 var name_data=name.innerHTML;
 var country_data=country.innerHTML;
 var age_data=age.innerHTML;
 var group_data=group.innerHTML;
	
 name.innerHTML="<input type='text' id='name_text"+no+"' value='"+name_data+"' data-ng-model='editEquipment'>";
 country.innerHTML="<input type='text' id='country_text"+no+"' value='"+country_data+"' data-ng-model='editSystem'>";
 age.innerHTML="<input type='text' id='age_text"+no+"' value='"+age_data+"' data-ng-model='editDescription'>";
 group.innerHTML="<input type='text' id='group_text"+no+"'value='"+group_data+"' data-ng-model='editGroup'>";
}

function save_row(no)
{
 var name_val=document.getElementById("name_text"+no).value;
 var country_val=document.getElementById("country_text"+no).value;
 var age_val=document.getElementById("age_text"+no).value;
 var group_val=document.getElementById("group_text"+no).value;

 document.getElementById("name_row"+no).innerHTML=name_val;
 document.getElementById("country_row"+no).innerHTML=country_val;
 document.getElementById("age_row"+no).innerHTML=age_val;
 document.getElementById("group_row"+no).innerHTML=group_val;

 document.getElementById("edit_button"+no).style.display="block";
 document.getElementById("save_button"+no).style.display="none";
}

function delete_row(no)
{
 document.getElementById("row"+no+"").outerHTML="";
}

function add_row()
{
 var new_name=document.getElementById("new_name").value;
 var new_country=document.getElementById("new_country").value;
 var new_age=document.getElementById("new_age").value;
 var new_group=document.getElementById("new_group").value;
	
 var table=document.getElementById("data_table");
 var table_len=(table.rows.length)-1;
 var row = table.insertRow(table_len).outerHTML="<tr id='row"+table_len+"'><td id='name_row"+table_len+"'>"+new_name+"</td><td id='country_row"+table_len+"'>"+new_country+"</td><td id='age_row"+table_len+"'>"+new_age+"</td><td id='group_row"+table_len+"'>"+new_group+"</td><td><input type='button' id='edit_button"+table_len+"' value='Edit' class='edit' onclick='edit_row("+table_len+")'> <input type='button' id='save_button"+table_len+"' value='Save' class='save' onclick='save_row("+table_len+")'> <input type='button' value='Delete' class='delete' onclick='delete_row("+table_len+")'></td></tr>";

 document.getElementById("new_name").value="";
 document.getElementById("new_country").value="";
 document.getElementById("new_age").value="";
 document.getElementById("new_group").value="";
}

$("#myModal .close").click()

