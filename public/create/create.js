/*global angular*/
var app = angular.module('create', ['ngRoute']);

app.config(['$routeProvider', function ($routeProvider) {
    'use strict';
    $routeProvider.when('/create', {
        templateUrl: 'create/create.html',
        controller: 'createUserCtrl'
    });
}]);

app.controller('createUserCtrl', ['$scope', '$rootScope', '$firebaseObject', 'Auth', 'toaster', function ($scope, $rootScope, $firebaseObject, Auth, toaster) {
    
    // Change user password
    $scope.changePassword = function () {
        
        // check for password match
        if ($scope.newPassword != $scope.repeatNewPassword) {
            toaster.pop({type: 'error', title: "Password mismatch", body: 'Both passwords must match'});
            // returns outside if no match i.e. will not change password unless function called again
            return;
        }
        
        var userData = Auth.EmailAuthProvider.credential($scope.email, $scope.currentPassword);
        firebase.auth().currentUser.reauthenticate(credentials)
            .then(function() {
                Auth.$updatePassword($scope.newPassword)
                    .then(function(){
                    toaster.pop({type: 'success', title: "Success", body: 'Password changed'});
                });
        })
            // Any error will log an error
            .catch(function(error) {
                console.error(error);
            // Create a toaster error message
            toaster.pop({type: 'error', title: "Error", body: error.message});
            $scope.$apply();
        });
    };
    
    // Create new user
    $scope.createUser = function() {
        
        if($scope.email == undefined) {
            toaster.pop({type: 'error', title: "Error", body: 'Empty Email Field'});
            return;
        }
        
        if($scope.password == undefined) {
            toaster.pop({type: 'error', title: "Error", body: 'Empty Password Field'});
            return;
        }
      Auth.$createUserWithEmailAndPassword($scope.email, $scope.password)
        .then(function(firebaseUser) {
          // Store user into database
            var uid = firebaseUser.uid;
            firebase.database().ref("users/" + uid).set($scope.email);
          // pop toaster for success
            toaster.pop({type: 'success', title: "User Account created", body: "A new user has been added"});
        }).catch(function(error) {
            $scope.error = error;
            toaster.pop({type: 'error', title: "Error", body: error});
        });
    };
}]);