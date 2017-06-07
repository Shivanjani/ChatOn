'use strict';
 
angular.module('Home')
 
.controller('HomeController',
    ['$scope', '$location', '$rootScope', 'FirebaseService',
    function ($scope, $location, $rootScope, FirebaseService) {

    	$scope.channels = {}
         $scope.users=[]
    	$scope.logout = function() {
    		FirebaseService.ClearCredentials();
    		$location.path('/login');
    	}

    	$scope.user = $rootScope.globals.currentUser

    	$scope.createChannel = function() {
    		$scope.dataLoading = true

    		FirebaseService.createChannel($scope.channelName, function(error){
    			if (error == null) {
    				$scope.channelName = null
    				$('#myModal').modal('hide');
    				$scope.dataLoading = false
    			} else {
    				alert("Sorry something went wrong!!")
    			}
    		})

    	}

    	$scope.createOneToOneChat = function(selectedUser) {
            FirebaseService.createOneToOneChannel(selectedUser, function(channelId, error){
                if (error == null) {
                    $('#userModel').modal('hide');
                    $location.path('/'+channelId)
                } else {
                    alert("Sorry something went wrong!!")
                }
            })

        }

    	$scope.onClickChannel = function(channelId) {
    		$location.path('/'+channelId)
    	}
    	$scope.getUsers = function() {
            var channelListRef = firebase.database().ref('users');
            channelListRef.on('child_added', function(snapshot) {
                if (snapshot.val() != null) {
                    $scope.users.push(snapshot.val())
                }
                if(!$scope.$$phase) {
                  $scope.$apply()
                }
            });
        }
         $scope.getUsers()
    	$scope.getAllCHannels = function(uid) {
    		var channelListRef = firebase.database().ref('users/' + uid+ '/channels');
            channelListRef.on('value', function(snapshot) {
            	$scope.channels = snapshot.val()
            	if(!$scope.$$phase) {
				  $scope.$apply()
				}
            });
    	}
    	$scope.getAllCHannels($scope.user.uid)
      
    }]);