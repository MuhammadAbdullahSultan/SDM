/*global angular*/
var app = angular.module('manual', ['ngRoute', 'firebase']);

app.config(['$routeProvider', function ($routeProvider) {
    'use strict';
    $routeProvider.when('/manual', {
        templateUrl: 'manual/manual.html',
        controller: 'manualCtrl'
    });
}]);


app.controller('manualCtrl', ['$scope', function ($scope) {
    
}]);

