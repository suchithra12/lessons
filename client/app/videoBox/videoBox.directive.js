'use strict';

angular.module('artifactsteachAppApp')
  .directive('videoBox', function ($sce) {
    return {
      templateUrl: 'app/videoBox/videoBox.html',
      restrict: 'EA',
      replace: true,
      link: function ($scope, $element, $attrs) {

        if($scope.video.videos.length > 0){
          var url = "https://www.youtube.com/embed/"+$scope.video.videos[0].video;
          $scope.iframeURL = $sce.trustAsResourceUrl(url);
        }

        $scope.setiframe = function(){
          var url = "https://www.youtube.com/embed/"+this.v.video;
          $scope.iframeURL = $sce.trustAsResourceUrl(url);
        }
      }
    };
  });