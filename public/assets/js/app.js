/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global define */
/*global angular */
// DEFINING ANGULAR MODULE ngCookies
/*jshint sub:true*/
var app = angular.module('myApp', ['ngRoute', 'chart.js', 'downtime', 'maintain', 'create', 'sdt', 'firebase', 'ngAnimate', 'toaster', 'profile', 'manual', 'login']);

var config = {
    apiKey: "AIzaSyDlZwVsbxI6V161f7ZcyCsy_mg4-GRFwxo",
    authDomain: "xfab-downtime.firebaseapp.com",
    databaseURL: "https://xfab-downtime.firebaseio.com",
    projectId: "xfab-downtime",
    storageBucket: "xfab-downtime.appspot.com",
    messagingSenderId: "937142810228"
  };

firebase.initializeApp(config);

app.run(["$rootScope", "$location", function($rootScope, $location) {
  $rootScope.$on("$routeChangeError", function(event, next, previous, error) {
    // We can catch the error thrown when the $requireSignIn promise is rejected
    // and redirect the user back to the home page
    if (error === "AUTH_REQUIRED") {
      $location.path("/login");
    }
  });
}]);

app.config(['$routeProvider', function ($routeProvider) {
    'use strict';
    $routeProvider.otherwise({
        redirectTo: '/login'
    });
    
    $(document).ready(function(){
     
        // ===== Scroll to Top ==== 
$(window).scroll(function() {
    if ($(this).scrollTop() >= 50) {        // If page is scrolled more than 50px
        $('#return-to-top').fadeIn(200);    // Fade in the arrow
    } else {
        $('#return-to-top').fadeOut(200);   // Else fade out the arrow
    }
});
$('#return-to-top').click(function() {      // When arrow is clicked
    $('body,html').animate({
        scrollTop : 0                       // Scroll to top of body
    }, 500);
});
})
}]);

app.controller('myCtrl', ['$scope', '$http', function ($scope, $http) {
        
}]);

app.factory("Auth", ["$firebaseAuth",
  function($firebaseAuth) {
    return $firebaseAuth();
  }
]);

app.controller('authCtrl', ['$scope', '$rootScope', '$firebaseObject', 'Auth', function ($scope, $rootScope, $firebaseObject, Auth) {
            'use strict';
    
           $scope.createUser = function() {
              $scope.message = null;
              $scope.error = null;

              // Create a new user
              Auth.$createUserWithEmailAndPassword($scope.email, $scope.password)
                .then(function(firebaseUser) {
                  $scope.message = "User created with uid: " + firebaseUser.uid;
                }).catch(function(error) {
                  $scope.error = error;
                });
            };
           }]);



app.controller("loginCtrl", ["$scope", "Auth", 'toaster','$location', '$firebaseArray', '$firebaseObject',
    function ($scope, Auth, toaster,$location, $firebaseArray, $firebaseObject) {
        'use strict';
                             
        $scope.signin = {}
        $scope.signin.state = false
        $scope.signin.uid = null
        
        // add auth state listener
        Auth.$onAuthStateChanged(function(user) {
            if (user) {
                $scope.signin.state = true
                $scope.signin.uid = user.uid
                $scope.email = user.email;
                console.log ($scope.email);
                $scope.signin.profile = {}
                console.log("user.uid " + $scope.signin.uid);
//                document.location.href= "dashboard.html#!/sdt";
                
            } else {
                $scope.signin.state = false
                $scope.signin.uid = null
//                document.location.href= "/home";
                $location.path("/login");

            }
        })

        // signout
        $scope.signout = function() {
            Auth.$signOut();
//            document.location.href= "/login";
            $location.path("/login");
            toaster.pop({type: 'success', title: "Logged out", body: 'You have logged out from the system'});
        };

        // signin with email
        $scope.signInWithEmailAndPassword = function(email, password) {
            
            if($scope.email == undefined) {
            toaster.pop({type: 'error', title: "Error", body: 'Empty Email Field'});
                return;
            }

            if($scope.password == undefined) {
                toaster.pop({type: 'error', title: "Error", body: 'Empty Password Field'});
                return;
            }
            Auth.$signInWithEmailAndPassword(email, password).then (function(firebaseuser) {
                
                
                var ref = firebase.database().ref();
                var data = ref.child("userState").child(firebaseuser.uid);
                var list = $firebaseObject(data);
                
                
                list.$loaded().then(function(data) {
                    console.log(data);
                    if(data.$value === false) {
                        toaster.pop({type: "warning", title: "ERROR", body: "Your account has not been activated"});
                        Auth.$signOut();
                    } else {
                        toaster.pop({type: 'success', title: "Logged in", body: 'Welcome to System Downtime Monitoring!'});
                        $location.path("/sdt");
                    }
                }).catch (function(error) {
                    
                toaster.pop({type: 'error', title: "Error", body: error});
                });
            }).catch(function(error) {
                toaster.pop({type: 'error', title: "Error", body: error.message});
            });
            
            
            
            
        };
      }
    
  
]);

