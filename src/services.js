'use strict';
 
angular.module('Authentication')
 
.factory('FirebaseService',
    ['$http', '$window', '$cookieStore', '$rootScope', '$timeout',
    function ( $http, $window, $cookieStore, $rootScope, $timeout) {
        var service = {};

        service.Login = function (email, password) {
            return firebase.auth().signInWithEmailAndPassword(email, password)
        };

        service.Register = function (email, password) {
            return firebase.auth().createUserWithEmailAndPassword(email, password)
        };

        service.createUserProfile = function(callback) {
            var database = firebase.database();
            var user  = $rootScope.globals.currentUser;
            var updates = {};
            updates['/users/' + user.uid + '/name/'] = user.displayName
            updates['/users/' + user.uid + '/email/'] = user.email
            updates['/users/' + user.uid + '/uid/'] = user.uid

            return database.ref().update(updates, function(error){
                callback(error)
            });
        }

        service.updateProfile = function(data) {
            var user = firebase.auth().currentUser;
            return user.updateProfile(data)
        };

        service.createChannel = function(channelName, callback) {
            var database = firebase.database();
            var user  = $rootScope.globals.currentUser;

            var channelId = database.ref().child('channels').push().key;

            var updates = {};
            updates['/channels/' + channelId + '/name'] = channelName;
            updates['/channels/' + channelId + '/members/' + user.uid] = user.displayName
            updates['/channels/' + channelId + '/owner'] = user.uid
            updates['/users/' + user.uid + '/channels/' + channelId] = channelName

            return database.ref().update(updates, function(error){
                callback(error)
            });

        }

        service.createOneToOneChannel = function(participant, callback) {
            var database = firebase.database();
            var user  = $rootScope.globals.currentUser;

            var channelId = database.ref().child('channels').push().key;

            var updates = {};
            updates['/channels/' + channelId + '/name'] = "chat";
            updates['/channels/' + channelId + '/directChat'] = true;
            updates['/channels/' + channelId + '/members/' + user.uid] = user.displayName
            updates['/channels/' + channelId + '/members/' + participant.uid] = participant.name
            updates['/channels/' + channelId + '/owner'] = user.uid
            updates['/users/' + user.uid + '/channels/' + channelId] = participant.name
            updates['/users/' + participant.uid + '/channels/' + channelId] = user.displayName

            return database.ref().update(updates, function(error){
                callback(error)
            });

        }

        service.addUserToChannel = function(channelId, channelName, user, callback) {
            var database = firebase.database();
            var updates = {};
            updates['/channels/' + channelId + '/members/' + user.uid] = user.name
            updates['/users/' + user.uid + '/channels/' + channelId] = channelName

            return database.ref().update(updates, function(error){
                callback(error)
            });
        }

        service.removeUserFromChannel = function(channeId, userId, callback) {
            var database = firebase.database();
            var updates = {};
            updates['/channels/' + channeId + '/members/' + userId] = null
            updates['/users/' + userId + '/channels/' + channeId] = null

            return database.ref().update(updates, function(error){
                callback(error)
            });
        }

        service.createMessage = function(channelId, message, callback) {
            var user  = $rootScope.globals.currentUser;
            var database = firebase.database();

            var messageObj = {
                sender: {
                    name: user.displayName,
                    uid: user.uid
                },
                message: message,
                timestamp: firebase.database.ServerValue.TIMESTAMP

            }

            var messageId = database.ref().child('messages').child(channelId).push().key;

            var updates = {};
            updates['/messages/' + channelId + "/" + messageId] = messageObj;
            updates['/channels/' + channelId + '/lastMessage'] = messageObj

            return database.ref().update(updates, function(error){
                callback(error)
            });

        }
 
        service.SetCredentials = function (password, callback) {
            var authdata = firebase.auth().currentUser;
            authdata['pwd'] = password
            $rootScope.globals = {
                currentUser: authdata,
                p: password
            };
            $cookieStore.put('globals', $rootScope.globals)
            callback('done')
        };
         
         service.createOneToOneChannel = function(participant, callback) {
            var database = firebase.database();
            var user  = $rootScope.globals.currentUser;

            var channelId = database.ref().child('channels').push().key;

            var updates = {};
            updates['/channels/' + channelId + '/name'] = "chat";
            updates['/channels/' + channelId + '/directChat'] = true;
            updates['/channels/' + channelId + '/members/' + user.uid] = user.displayName
            updates['/channels/' + channelId + '/members/' + participant.uid] = participant.name
            updates['/channels/' + channelId + '/owner'] = user.uid
            updates['/users/' + user.uid + '/channels/' + channelId] = participant.name
            updates['/users/' + participant.uid + '/channels/' + channelId] = user.displayName

            return database.ref().update(updates, function(error){
                callback(channelId, error)
            });

        }
        service.ClearCredentials = function () {
            $rootScope.globals = {};
            $cookieStore.remove('globals');
        };
 
        return service;
    }])
 
