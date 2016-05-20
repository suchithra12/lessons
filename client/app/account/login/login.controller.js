'use strict';

angular.module('artifactsteachAppApp')
  .controller('LoginCtrl', function ($scope, Auth, $location, $cookieStore, $window) {
    $scope.user = {};
    $scope.errors = {};

    $scope.login = function(form) {
      $scope.submitted = true;

      if(form.$valid) {
        Auth.login({
          email: $scope.user.email,
          password: $scope.user.password
        })
        .then( function() {
          // Logged in, redirect to home
          $location.path('/');
        })
        .catch( function(err) {
          $scope.errors.other = err.message;
        });
      }
    };

    $scope.loginOauth = function(provider) {
      event.preventDefault();
      $window.location.href = '/auth/' + provider;
    };

    $scope.forgotPassword = function(){
      event.preventDefault();
      $location.path('/forgot');
    }
  });
