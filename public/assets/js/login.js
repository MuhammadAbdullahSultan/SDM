/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global define */
/*global angular */
// DEFINING ANGULAR MODULE ngCookies
/*jshint sub:true*/
var app = angular.module("login", ["firebase"]);

AuthApp.factory("auth", [
    "$firebaseAuth",
    function($firebaseAuth) {
        return $firebaseAuth()
    }
]);

app.controller("loginCtrl", ["$scope", "auth",
    function ($scope, auth) {
        $scope.signin = {}
        $scope.signin.state = false
        $scope.signin.uid = null

        // add auth state listener
        auth.$onAuthStateChanged(function(user) {
            if (user) {
                $scope.signin.state = true
                $scope.signin.uid = user.uid
                $scope.signin.profile = {}
                console.log("user.uid " + $scope.signin.uid);
                user.providerData.forEach(function(profile) {
                    $scope.signin.profile.provider = profile.providerId;
                    $scope.signin.profile.uid = profile.uid;
                    $scope.signin.profile.name = profile.displayName;
                    $scope.signin.profile.email = profile.email;
                    $scope.signin.profile.photoURL = profile.photoURL;
                })
            } else {
                $scope.signin.state = false
                $scope.signin.uid = null
            }
        })

        // signout
        $scope.signout = function() {
            auth.$signOut()
        };

        // signin with email
        $scope.signInWithEmailAndPassword = function(email, password) {
            auth.$signInWithEmailAndPassword(email, password).catch(function(error) {
                var errorCode = error.code;
                var errorMessage = error.message;
            });
        };
      };
    
  
]);