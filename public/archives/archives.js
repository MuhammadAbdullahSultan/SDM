/*global angular*/
var app = angular.module('archives', ['ngRoute', 'firebase', 'ngAnimate', 'ngSanitize']);

app.config(['$routeProvider', function ($routeProvider) {
    'use strict';
    $routeProvider.when('/archives', {
        templateUrl: 'archives/archives.html',
        controller: 'archivesCtrl'
    })
}]);

app.controller('archivesCtrl', ['$scope' , function ($scope) {
    
    
    
    }]);