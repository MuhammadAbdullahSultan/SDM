/*global angular*/
var app = angular.module('profile', ['ngRoute']);

app.config(['$routeProvider', function ($routeProvider) {
    'use strict';
    $routeProvider.when('/profile', {
        templateUrl: 'profile/profile.html',
        controller: 'profileCtrl'
    });
}]);

app.controller('profileCtrl', ['$scope', '$rootScope', '$firebaseObject', 'toaster', 'Auth', function ($scope, $rootScope, $firebaseObject, toaster, Auth) {
    
    // Change user password
    $scope.changePassword = function () {
        
        if ($scope.currentPass == undefined) {
            toaster.pop({type: 'error', title: "Error", body: "Please Enter the current Password"});
            return;
        }
        
        if ($scope.newPassword != $scope.newPasswordrepeat) {
            toaster.pop({type: 'error', title: "Password mismatch", body: 'Both passwords must match'});
            return;
        }
        
        if ($scope.newPassword == undefined) {
            toaster.pop({type: 'error', title: "Error", body: "Please Enter the new Password"});
            return;
        }
        
        if ($scope.newPasswordrepeat == undefined) {
            toaster.pop({type: 'error', title: "Error", body: "Please Enter the repeat Password"});
            return;
        }
        
        if($scope.newPassword.length < 6 || $scope.newPasswordrepeat.length < 6) {
            
            toaster.pop({type: 'error', title: "Error", body: "Password should be at least 6 characters"});
            return;
        }
        
        
        
        
        
        
        var userData = firebase.auth.EmailAuthProvider.credential($scope.email, $scope.currentPass);
        firebase.auth().currentUser.reauthenticateWithCredential(userData)
            .then(function() {
                Auth.$updatePassword($scope.newPassword)
                    .then(function(){
                    toaster.pop({type: 'success', title: "Success", body: 'Password changed'});
                    $scope.currentPass = "";
                    $scope.newPassword = "";
                    $scope.newPasswordrepeat = "";
                });
        })
            // Any error will log an error
            .catch(function(error) {
            
            toaster.pop({type: 'error', title: "Error", body: error});
            $scope.$apply();
        });
    };
}]);