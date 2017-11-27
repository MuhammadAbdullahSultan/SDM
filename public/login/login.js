/*global angular*/
var app = angular.module('login', ['ngRoute', 'firebase', 'ngAnimate', 'ngSanitize']);

app.config(['$routeProvider', function ($routeProvider) {
    'use strict';
    $routeProvider.when('/login', {
        templateUrl: 'login/login.html',
        controller: 'loginCtrl'
    })
}]);

app.controller('loginCtrl', ['$scope' , function ($scope) {
    
    
    
    }]);