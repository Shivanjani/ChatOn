'use strict';
 
angular.module('Authentication')
 
.controller('RegisterController',
    ['$scope', '$rootScope', '$location', 'AuthenticationService',
    function ($scope, $rootScope, $location, AuthenticationService) {
        // reset login status
        AuthenticationService.ClearCredentials();
 
        $scope.register = function () {
            $scope.dataLoading = true;
            AuthenticationService.Login($scope.firstname,$scope.username, $scope.password, function(error) {
                console.log(error)
                if(error) {
                    console.log("login success......")
                    AuthenticationService.SetCredentials($scope.firstname,$scope.username, $scope.password);
                    $location.path('/');
                } else {
                    $scope.error = error.message;
                    $scope.dataLoading = false;
                }
            });
        };
    }]);