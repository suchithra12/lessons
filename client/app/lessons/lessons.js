'use strict';

angular.module('artifactsteachAppApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/lessons', {
        templateUrl: 'app/lessons/lessons.html',
        controller: 'LessonsCtrl',
        authenticate: true
      })
      .when('/lessons/:lessonID', {
        templateUrl: 'app/lessons/lessons.html',
        controller: 'LessonsCtrl',
        authenticate: true
      });
  });
