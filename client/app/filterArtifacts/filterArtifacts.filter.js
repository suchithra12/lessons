'use strict';

angular.module('artifactsteachAppApp')
  .filter('filterArtifacts', function () {
    return function (input) {
      console.log(input);
      return 'filterArtifacts filter: ' + input;
    };
  });
