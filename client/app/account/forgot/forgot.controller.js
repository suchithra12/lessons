'use strict';

angular.module('artifactsteachAppApp')
  .controller('ForgotCtrl', function ($rootScope, $scope, $routeParams, $location, ngToast, Auth) {
    $scope.errors = {};

    $scope.forgotPassword = function(form) {
      $rootScope.serverActive = true;
      if(form.$valid) {
        Auth.forgotPassword( $scope.user.email )
        .then( function() {
          //$scope.message = 'Password Reset Emailed.';
          displayToast('success', 'Password reset and instructions emailed.');
        })
        .catch( function() {
          form.email.$setValidity('mongoose', false);
          $scope.errors.other = 'Incorrect email';
          $scope.message = '';
          displayToast('danger', 'Incorrect Email');
        });
      }
		};

    $scope.resetPassword = function(form) {
      $rootScope.serverActive = true;
      if(form.$valid) {
        Auth.resetPassword( $routeParams.token, $scope.user.password )
        .then( function() {
          // $scope.message = 'Password successfully changed.';
          displayToast('success', 'Password Successfully Changed');
          $location.path('/');
        })
        .catch( function() {
          form.password.$setValidity('mongoose', false);
          $scope.errors.other = 'Incorrect password';
          $scope.message = '';
          displayToast('danger', 'Incorrect Password');
        });
      }
    };

    function displayToast(type, content){
      $rootScope.serverActive = false;
      ngToast[type]({
        timeout: 5000,
        content: content
      });
    }
  });
