'use strict';

angular.module('artifactsteachAppApp')
  .controller('SupportCtrl', function ($scope, $sce) {
    $scope.message = 'Hello';
    $scope.supportActive = true;
    $scope.supportVideos = angular.copy(supportVideos);
  });
