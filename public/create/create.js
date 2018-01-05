/*global angular*/
var app = angular.module('create', ['ngRoute']);

app.config(['$routeProvider', function ($routeProvider) {
    'use strict';
    $routeProvider.when('/create', {
        templateUrl: 'create/create.html',
        controller: 'createUserCtrl',
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
        

app.controller('createUserCtrl', ['$scope', '$rootScope', '$firebaseObject', 'Auth', 'toaster', '$firebaseArray', '$http' , function ($scope, $rootScope, $firebaseObject, Auth, toaster, $firebaseArray, $http) {
        
        var ref = firebase.database().ref();
    
    
        $scope.allUsers = $firebaseArray(ref.child("users"));
        
    
        $scope.userStates = $firebaseArray(ref.child("userState"));
    
        
    $scope.display = function () {
        console.log($scope.allUsers);
        console.log($scope.userStates);
        
        console.log($scope.filteredUsers);
    }
    
    // Reset Password
    $scope.resetPass = function () {
        
        if($scope.reset == undefined) {
            toaster.pop({type: 'error', title: "Error", body: "Please enter an email"});
            return;
        }
    Auth.$sendPasswordResetEmail($scope.reset).then(function() {
        toaster.pop({type: 'success', title: "Success", body: 'A password reset email has been sent to' + $scope.reset });
        $scope.reset = undefined;
        $("#resetPass").modal("hide");
        
    }).catch(function(error) {
        toaster.pop({type: 'error', title: "Error", body: error});
    });
    }
    
    // Create new user
    $scope.createUser = function() {
        
        if($scope.toAddEmail == undefined) {
            toaster.pop({type: 'error', title: "Error", body: 'Empty Email Field'});
            return;
        }
        
        if($scope.password == undefined) {
            toaster.pop({type: 'error', title: "Error", body: 'Empty Password Field'});
            return;
        }
        
        if ($scope.password != $scope.reppassword) {
            toaster.pop({type: 'error', title: "Password mismatch", body: 'Both passwords must match'});
            return;
        }
        
        if ($scope.reppassword == undefined) {
            toaster.pop({type: 'error', title: "Error", body: "Please Enter the repeat Password"});
            return;
        }
        
        if($scope.password.length < 6 || $scope.reppassword.length < 6) {
            
            toaster.pop({type: 'error', title: "Error", body: "Password should be at least 6 characters"});
            return;
        }
      Auth.$createUserWithEmailAndPassword($scope.toAddEmail, $scope.password)
        .then(function(firebaseUser) {
          // Store user into database
            var uid = firebaseUser.uid;
            firebase.database().ref("users/" + uid).set({
                email: $scope.toAddEmail,
            });
            firebase.database().ref("userState/" + uid).set({
                active: false,
                type: 'unauthorized'
            });
            
          // pop toaster for success
            toaster.pop({type: 'success', title: "User Account created", body: "A new user has been added"});
            Auth.$signOut();
              $scope.toAddEmail = undefined;
              $scope.password = undefined;
              $scope.reppassword = undefined;
          
          

            })
          .catch(function(error) {
            $scope.error = error;
            toaster.pop({type: 'error', title: "Error", body: error});
        });
        
        $("#addUser .close").click();

    };
    
    /////////////PAGINATION, SORT, FILTER STARTS
    $scope.currentPage = 1, $scope.numPerPage = 5, $scope.orderByField = 'email', $scope.reverseSort = false;
    $scope.$watch("filterWord", function (newVal, oldVal) {
        for (var i = 0; i < $scope.allUsers.length; i++) {
            if(newVal === undefined) {
                newVal = "";
            }
            $scope.allUsers[i].filtered = $scope.allUsers[i].email.toUpperCase().indexOf(newVal.toUpperCase()) === -1;
            paginationFunc();
        }

    });
    $scope.$watch("allUsers.length", paginationFunc);
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
        var allUsers = $scope.allUsers.filter(function (item) { return !item.filtered });
        $scope.numbers = Math.ceil(allUsers.length / $scope.numPerPage);
        if ($scope.currentPage < 1) $scope.currentPage = 1;
        if ($scope.currentPage > $scope.numbers) $scope.currentPage = $scope.numbers;
        var begin = (($scope.currentPage - 1) * $scope.numPerPage), end = begin + $scope.numPerPage;
        $scope.filteredUsers = allUsers.slice(begin, end);
    }
///////////PAGINATION ENDS
    
    
    ////ACTIVATE & DEACTIVATE USERS
    $scope.activateUser = function (id) {
        
//        for(var i = 0 ; i < $scope.filteredUsers.length ; i++) {
//            if($scope.filteredUsers[i].email === $scope.email) {
//                toaster.pop({type: 'error', title: "NOPE", body: "NOPE"});
//                return;
//            }
//            break;
//        }
        
        if(id === $scope.signin.uid) {
            toaster.pop({type: 'error', title: "Error", body: "The logged in user cannot deactivate themselves"});
            return;
        } else if ($scope.userStates.$getRecord(id).type === "Admin") {
            toaster.pop({type: 'error', title: "Error", body: "You don't have permission to revoke an admin account"});
            return;
        } else {
            console.log(id);
            var toSave = $scope.userStates.$getRecord(id);
            toSave.active = true;
            toSave.type = 'Staff'
            $scope.userStates.$save(toSave).then(function () {
                toaster.pop({type: 'success', title: "Account Activated", body: "The Account has been successfully activated"});
            }).catch (function (error) {
                toaster.pop({type: 'error', title: "Error", body: error});
            });
        }
        
        
        
    }
    
    $scope.clickMeSenpai = function () {
        console.log($scope.email);
        console.log($scope.signin.uid);
//        for(var i = 0 ; i < $scope.filteredUsers.length ; i++) {
//            console.log($scope.filteredUsers[i].email);
//        }
    }
    
        
    $scope.deactivateUser = function (id) {
        
        
        if(id === $scope.signin.uid) {
            toaster.pop({type: 'error', title: "Error", body: "The logged in user cannot deactivate themselves"});
            return;
        } else if ($scope.userStates.$getRecord(id).type === "Admin") {
            toaster.pop({type: 'error', title: "Error", body: "You don't have permission to revoke an admin account"});
            return;
        } else {
            console.log(id);
            var toSave = $scope.userStates.$getRecord(id);
            toSave.active = false;
            toSave.type = 'Unauthorized';
            $scope.userStates.$save(toSave).then(function () {
                toaster.pop({type: 'success', title: "Account deactivated", body: "The Account has been successfully deactivated"});
            }).catch (function (error) {
                toaster.pop({type: 'error', title: "Error", body: error});
            });
        }
        
        
    }
    
    function createCORSRequest(method, url) {
      var xhr = new XMLHttpRequest();
      if ("withCredentials" in xhr) {

        // Check if the XMLHttpRequest object has a "withCredentials" property.
        // "withCredentials" only exists on XMLHTTPRequest2 objects.
        xhr.open(method, url, true);

      } else if (typeof XDomainRequest != "undefined") {

        // Otherwise, check if XDomainRequest.
        // XDomainRequest only exists in IE, and is IE's way of making CORS requests.
        xhr = new XDomainRequest();
        xhr.open(method, url);

      } else {

        // Otherwise, CORS is not supported by the browser.
        xhr = null;

      }
      return xhr;
    }
    
//    $scope.urlDelete = 'https://us-central1-xfab-downtime.cloudfunctions.net/hello1';
    //delete User
    $scope.deleteUser = function (id) {
        var r = confirm("Are you sure you want to delete the equipment?");
        
        if (r == true) {
            
            if(id === $scope.signin.uid) {
                toaster.pop({type: 'error', title: "Error", body: "The logged in user cannot delete themselves"});
                return;
            } else if ($scope.userStates.$getRecord(id).type === "Admin") {
                toaster.pop({type: 'error', title: "Error", body: "You don't have permission to delete an admin account"});
                return;
            } else {
                
                var requestURL = 'https://us-central1-xfab-downtime.cloudfunctions.net/hello2/' + id;
                var params = "uid=" + id
                var request = new XMLHttpRequest();
                request.open('POST', requestURL, true);
                request.setRequestHeader('Content-type',  'application/x-www-form-urlencoded');
                request.send(params);

                var item = $scope.allUsers.$getRecord(id);
                var item2 = $scope.userStates.$getRecord(id);
                
                $scope.allUsers.$remove(item).then (function (deletedData) {});

                $scope.userStates.$remove(item2).then (function (deletedData) {});
                
                toaster.pop({type: 'success', title: "Success", body: "The user has been deleted"});
            }
            
        }
            
        
    };
    
    ///////////////////////////////////////////
    
    
    
    
}]);