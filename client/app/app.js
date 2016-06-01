'use strict';

angular.module('artifactsteachAppApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'ui.bootstrap',
  'ngToast'
])
  .config(function ($routeProvider, $locationProvider, $httpProvider) {
    $routeProvider
      .otherwise({
        redirectTo: '/'
      })
      .when('/support', {
        templateUrl: 'app/support/support.html',
        controller: 'SupportCtrl',
        authenticate: true
      });

    $locationProvider.html5Mode(true);
    $httpProvider.interceptors.push('authInterceptor');
  })

  .factory('authInterceptor', function ($rootScope, $q, $cookieStore, $location) {
    return {
      // Add authorization token to headers
      request: function (config) {
        config.headers = config.headers || {};
        if ($cookieStore.get('token')) {
          config.headers.Authorization = 'Bearer ' + $cookieStore.get('token');
        }
        return config;
      },

      // Intercept 401s and redirect you to login
      responseError: function(response) {
        if(response.status === 401) {
          $location.path('/login');
          // remove any stale tokens
          $cookieStore.remove('token');
          return $q.reject(response);
        }
        else {
          return $q.reject(response);
        }
      }
    };
  })

  .run(function ($rootScope, $location, $cookieStore, Auth) {
    // Redirect to login if route requires auth and you're not logged in
    $rootScope.$on('$routeChangeStart', function (event, next) {
      var today = new Date(); 
      var todayDateOnly = new Date(today.getFullYear(),today.getMonth(),today.getDate());
      // if(new Date($cookieStore.get('curDate')).getTime() !== todayDateOnly.getTime()) {
        Auth.isLoggedInAsync(function(loggedIn) {
          if (loggedIn) {
            Auth.getExpdate(function(cb) {
              console.log("_____Exp Status Check ___________"+cb)
              console.log($cookieStore.get('stripeCustId'))
              if ($cookieStore.get('stripeCustId') == undefined || $cookieStore.get('stripeCustId') == 'undefined'){
                if  (!cb) {
                  $location.path('/accRenewal');
                }
              }
              // $cookieStore.put('curDate', todayDateOnly);
            });
          }
        });
        
      
      // }

      //once the status is true, user won't be able go other than accRenewal page until he pays
      // if ($cookieStore.get('expStatus') == false){
      //   $location.path('/accRenewal');
      // }

      Auth.isLoggedInAsync(function(loggedIn) {
        if (next.authenticate && !loggedIn) {
          $location.path('/login');
        }
      });
    });
  });