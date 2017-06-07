'use strict';

// declare modules
angular.module('Authentication', []);
angular.module('Home', []);

angular.module('BasicHttpAuthExample', [
    'Authentication',
    'Home',
    'ngRoute',
    'ngCookies'
])
 
.config(['$routeProvider', function ($routeProvider) {

    $routeProvider
        .when('/login', {
            controller: 'LoginController',
            templateUrl: 'views/login.html',
            hideMenus: true
        })

        .when('/register', {
            controller: 'RegisterController',
            templateUrl: 'views/register.html',
            hideMenus: true
        })

        .when('/:channelId', {
            controller: 'ChatController',
            templateUrl: 'views/chat-detail.html'
        })
 
        .when('/', {
            controller: 'HomeController',
            templateUrl: 'views/home.html'
        })
 
        .otherwise({ redirectTo: '/login' });
}])
 
.run(['$rootScope', '$location', '$cookieStore', '$window', '$http', 'FirebaseService',
    function ($rootScope, $location, $cookieStore, $window, $http, FirebaseService) {
         
         var favoriteCookie = $cookieStore.get('globals');
         $rootScope.globals = favoriteCookie
         console.log($rootScope.globals)

        $rootScope.$on('$locationChangeStart', function (event, next, current) {
            if ($location.path() !== '/login' && $location.path() !== '/register' && (!$rootScope.globals || !$rootScope.globals.currentUser)) {
                $location.path('/login');
            }
        });
        var config = {
            apiKey: "AIzaSyBjItOSWFRrNuuK5jQtnV5B0cPiQQxLmWY",
            authDomain: "chat-3c32b.firebaseapp.com",
            databaseURL: "https://chat-3c32b.firebaseio.com",
            projectId: "chat-3c32b",
            storageBucket: "chat-3c32b.appspot.com",
            messagingSenderId: "778275602766"
          };  
        firebase.initializeApp(config);

        if ($rootScope.globals && $rootScope.globals.currentUser) {
            FirebaseService.Login($rootScope.globals.currentUser.email, $rootScope.globals.p)
            .then(function(authData) {
                console.log("login success......")
            }).catch(function(error){
                $location.path('/login');
            })
        }

        
        
    }]);