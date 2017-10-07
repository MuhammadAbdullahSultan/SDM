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

app.controller('createUserCtrl', ['$scope', '$rootScope', '$firebaseObject', 'Auth', 'toaster', '$firebaseArray' , function ($scope, $rootScope, $firebaseObject, Auth, toaster, $firebaseArray) {
        
        var ref = firebase.database().ref();
        var data = ref.child("users");
        var list = $firebaseArray(data);
        
        
        list.$loaded().then(function(data) {
            $scope.allUsers = data;
            console.log(data);

        }).catch(function(error) {
            $scope.error = error;
        });
    
        var ref2 = firebase.database().ref();
        var data2 = ref2.child("userState");
        var list2 = $firebaseArray(data2);
        
        list2.$loaded().then(function (data) {
            $scope.userStates = data;
        }).catch (function (error) {
            toaster.pop({type: 'error', title: "Error", body: error});
        });
    
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
    
    $scope.activateUser = function (id) {
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
    
    $scope.deactivateUser = function (id) {
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
    
    //delete User
    $scope.deleteUser = function () {
        var item = list[$scope.indexValue];
        list.$remove(item).then (function (deletedData) {
            console.log(deletedData);
        });
    };
    
    
}]);