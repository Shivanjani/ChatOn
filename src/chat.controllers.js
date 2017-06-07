'use strict';
 
angular.module('Home')
 
.controller('ChatController',
    ['$scope', '$location', '$rootScope', '$routeParams', 'FirebaseService',
    function ($scope, $location, $rootScope, $routeParams, FirebaseService) {

    	$scope.chats = []
        $scope.users = []
        $scope.user = $rootScope.globals.currentUser
        $scope.channelId = $routeParams.channelId;
        $scope.channel = {}

    	$scope.logout = function() {
    		FirebaseService.ClearCredentials();
    		$location.path('/login');
    	}

        $scope.sendChat = function() {

            if ($scope.chatText) {
                FirebaseService.createMessage($scope.channelId, $scope.chatText, function(error){
                    if (error == null) {
                        $scope.chatText = null
                        if(!$scope.$$phase) {
                            $scope.$apply()
                        }
                    } else {
                        alert("Sorry something went wrong!!")
                    }
                })
            }
        }

        $scope.selectUser = function(user) {
            if ($scope.channel.name) {
                FirebaseService.addUserToChannel($scope.channelId, $scope.channel.name, user, function(error){
                    if (error != null) {
                        alert("Sorry something went wrong!!")
                    } else {
                        $('#myModal').modal('hide');
                    }
                })
            }
        }
    	
    	$scope.getChats = function(channelId) {
    		var channelListRef = firebase.database().ref('messages/' + channelId);
            channelListRef.on('child_added', function(snapshot) {
                if (snapshot.val() != null) {
                    $scope.chats.push(snapshot.val())
                }
            	if(!$scope.$$phase) {
				  $scope.$apply()
				}
           });

            firebase.database().ref('channels/' + channelId).on('value', function(snap){
                $scope.channel = snap.val()
            })

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

        $scope.removeMember = function(uid) {
            if ($scope.channel.owner && $scope.channel.owner == uid) {
                alert("Sorry!! Yout cannot remove owner from chat.")
                return false;
            }
            var cnfm = confirm('Are you sure you want to remove this member ?');
            if (cnfm) {
                FirebaseService.removeUserFromChannel($scope.channelId, uid, function(error){
                    if (error) {
                        alert("Sorry something went wrong!!")
                    }
                })
            }
        }

    	$scope.getChats($scope.channelId)
        $scope.getUsers()
      
    }]).directive('scroll', function($timeout) {
      return {
        restrict: 'A',
        link: function(scope, element, attr) {
          scope.$watchCollection(attr.scroll, function(newVal) {
            $timeout(function() {
             element[0].scrollTop = element[0].scrollHeight;
            });
          });
        }
      }
    });