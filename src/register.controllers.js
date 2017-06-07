'use strict';
 
angular.module('Authentication')
 
.controller('RegisterController',
    ['$scope', '$rootScope', '$location', '$window', 'FirebaseService',
    function ($scope, $rootScope, $location, $window, FirebaseService) {

 
        $scope.register = function () {
            $scope.dataLoading = true;

            if ($scope.password !== $scope.c_password) {
                $scope.error = "Password doesn't match!!"
                $scope.dataLoading = false;
            }

            FirebaseService.Register($scope.email, $scope.password)
            .then(function(authData){
                FirebaseService.updateProfile({displayName: $scope.name}).then(function(data) {
                    FirebaseService.SetCredentials($scope.password, function(status){
                        FirebaseService.createUserProfile(function(error){
                            if (error != null) {
                                alert("Sorry!! something went wrong!")
                            } else {
                                $location.path('/');
                                $scope.$apply()
                            }
                        })
                    });
                    
                }, function(error) {
                    $scope.error = error.message;
                    $scope.dataLoading = false;
                    $scope.$apply()
                });
            }).catch(function(error){
                $scope.error = error.message;
                $scope.dataLoading = false;
                $scope.$apply()
            })
                // if(error) {
                //     console.log("login success......")
                //     AuthenticationService.SetCredentials($scope.firstname,$scope.username, $scope.password);
                //     $location.path('/');
                // } else {
                //     $scope.error = error.message;
                //     $scope.dataLoading = false;
                // }
        };
    }]);