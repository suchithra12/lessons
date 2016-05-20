'use strict';

angular.module('artifactsteachAppApp')
  .controller('HeaderCtrl', function ($rootScope, $scope, $location, $uibModal, $cookieStore, $log, Auth) {

    if($rootScope.tutorialViewer){
      $rootScope.tutorialViewer.close()
    }

    if($rootScope.lessonViewer){
      $rootScope.lessonViewer.close()
    }

    $scope.menu = [{
      'title': 'Artifacts',
      'link': '/'
    },{
      'title': 'Lessons',
      'link': '/lessons'
    },{
      'title': 'Support',
      'link': '/support'
    }];

    $scope.isCollapsed = true;
    $scope.isLoggedIn = Auth.isLoggedIn;
    $scope.isAdmin = Auth.isAdmin;
    $scope.getCurrentUser = Auth.getCurrentUser;

    $scope.legit = function(){
      // || $scope.getCurrentUser().provider == 'google';
      return $scope.getCurrentUser().provider == 'facebook';
    }

    $scope.logout = function() {
      Auth.logout();
      $location.path('/login');
    };

    $scope.isActive = function(route) {
      return route === $location.path();
    };

    $scope.closeModal = function(){
      this.$close();
    };

    $rootScope.showLessonViewer = function(){
      $rootScope.lessonViewer = $uibModal.open({
        animation: true,
        templateUrl: 'app/lessons/lesson-view.html',
        size: 'lg',
        scope: $scope
      });

      $rootScope.lessonViewer.result.then(function () {
        $log.info('Modal closed at: ' + new Date());
      }, function () {
        $log.info('Modal dismissed at: ' + new Date());
      });
    }

    $rootScope.showTutorialViewer = function(){
      $cookieStore.put('firstLogin', false);
      showTutorial();
    }

    function showTutorial(){
      if($location.path() != '/login' && $location.path() != '/signup' ){
        if( $cookieStore.get('firstLogin') ) return
        $rootScope.tutorialViewer = $uibModal.open({
          animation: true,
          templateUrl: 'app/main/tutorial.html',
          size: 'lg',
          scope: $scope
        });

        $rootScope.tutorialViewer.result.then(function () {
          $cookieStore.put('firstLogin', true);
        }, function () {
          $cookieStore.put('firstLogin', true);
        });
      }
    }

    showTutorial();
  });