'use strict';
 
angular.module('Authentication')
 
.controller('LoginController',
    ['$scope', '$rootScope', '$location', '$window', 'FirebaseService',
    function ($scope, $rootScope, $location, $window, FirebaseService) {
        // reset login status
        //AuthenticationService.ClearCredentials();
 
        $scope.login = function () {
            $scope.dataLoading = true;
            FirebaseService.Login($scope.email, $scope.password)
            .then(function(authData) {
                console.log("login success......")
                FirebaseService.SetCredentials($scope.password, function(status){
                    $location.path('/');
                    $scope.$apply()
                });
            }).catch(function(error){
                $scope.error = error.message;
                $scope.dataLoading = false;
                $scope.$apply()
            })
                
        };

        $scope.redirectToRegister = function() {
            $window.location.assign('#/register');
        }

    }]);