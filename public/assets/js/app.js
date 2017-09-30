/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global define */
/*global angular */
// DEFINING ANGULAR MODULE ngCookies
/*jshint sub:true*/
var app = angular.module('myApp', ['ngRoute', 'chart.js', 'downtime', 'maintain', 'create', 'sdt', 'firebase', 'ngAnimate', 'toaster', 'profile', 'manual']);

var config = {
    apiKey: "AIzaSyDlZwVsbxI6V161f7ZcyCsy_mg4-GRFwxo",
    authDomain: "xfab-downtime.firebaseapp.com",
    databaseURL: "https://xfab-downtime.firebaseio.com",
    projectId: "xfab-downtime",
    storageBucket: "xfab-downtime.appspot.com",
    messagingSenderId: "937142810228"
  };

firebase.initializeApp(config);
app.config(['$routeProvider', function ($routeProvider) {
    'use strict';
    $routeProvider.otherwise({
        redirectTo: '/sdt'
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

app.controller('myCtrlPercent', ['$scope', '$http', function ($scope, $http) {
            $scope.labelsPercent = ['Equipment 1', 'Equipment 2', 'Equipment 3', 'Equipment 4'];
//        $scope.series = ['Hello'];
        $scope.chartOptionsPercent = {
            title: {
                display: true,
                text: "",
                fontSize: 20
            },
            legend: {
                text: "Hello"
            },
            
            tooltips: {
                enabled: false
            },
            
            onClick: function(event, elem) {
                 var chartele = elem[0];
                 if (!chartele) {
                     return;
                 } // check and return if not clicked on bar/data
                 // else...
                else {
                    $(document).ready(function(){
                    $("#hour").click(function(){
                        $("#viewGraph").modal(); 
                        
                        });
                    }); 
                }
                    
              },
            
            scales: {
                yAxes: [{id: 'y-axis-1', type: 'linear', position: 'left', ticks: {min: 0, max: 100}}],
                xAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: ''
                    },
                gridLines: {
                    color: "rgba(0, 0, 0, 0)",
                }
                }],
                yAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: ''
                    },
                gridLines: {
                    color: "rgba(0, 0, 0, 0)",
                }   
            }]
            }
            }
    $scope.dataPercent = [5, 6, 7, 12];
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



app.controller("loginCtrl", ["$scope", "Auth", 'toaster',
    function ($scope, Auth, toaster) {
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
                document.location.href= "dashboard.html#!/sdt";
                toaster.pop({type: 'success', title: "Logged in", body: 'Welcome to System Downtime Monitoring!'});
                
//                user.providerData.forEach(function(profile) {
//                    $scope.signin.profile.provider = profile.providerId;
//                    $scope.signin.profile.uid = profile.uid;
//                    $scope.signin.profile.name = profile.displayName;
//                    $scope.signin.profile.email = profile.email;
//                    $scope.signin.profile.photoURL = profile.photoURL;
//                })
            } else {
                $scope.signin.state = false
                $scope.signin.uid = null
                document.location.href= "index.html#!/home";
                toaster.pop({type: 'success', title: "Logged out", body: 'You have logged out from the system'});

            }
        })

        // signout
        $scope.signout = function() {
            Auth.$signOut()
            document.location.href= "index.html#!/home";

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
            Auth.$signInWithEmailAndPassword(email, password).catch(function(error) {
                toaster.pop({type: 'error', title: "Error", body: error.message});
            });
            
            
            
            
        };
      }
    
  
]);

