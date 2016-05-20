'use strict';

angular.module('artifactsteachAppApp')
  .factory('lessonService', function lessonService($location, $rootScope, $routeParams, $http, User, $cookieStore, $q, Auth) {

    var currentUser = Auth.getCurrentUser();
    var lessonService = {};

    lessonService.Pay = function(token_id){
      var deferred = $q.defer();

      console.log("currentUser: ", currentUser);

      $http.get('/api/pay/'+token_id+'/'+currentUser.name+'/'+currentUser._id).success(function(response) {
        deferred.resolve(response);
      }).
      error(function(err) {
        deferred.reject(err);
      });

      return deferred.promise;      
    };


    lessonService.getLessons = function(){
      var deferred = $q.defer();

      console.log("currentUser: ", currentUser);

      $http.get('/api/lessons').success(function(lessons) {
        var curatedLessons = lessons.filter(function(lesson){
          return lesson.user_ids.indexOf(currentUser.email) !== -1;
        })
        $rootScope.lessons = _.sortBy(curatedLessons, 'title');
        $rootScope.lesson = $routeParams.lessonID && $routeParams.lessonID.length > 10 && curatedLessons.length > 0 ? _.find(lessons, {_id: $routeParams.lessonID}) : {};
        deferred.resolve(lessons);
      }).
      error(function(err) {
        deferred.reject(err);
      });

      return deferred.promise;      
    };

    lessonService.saveLesson = function(lesson){
      var deferred = $q.defer();

      var url = lesson._id ? '/api/lessons/' + lesson._id : '/api/lessons/';
      var method = lesson._id ? 'put' : 'post';

      // Set User IDs
      lesson.user_ids = lesson.user_ids || [];
      if(lesson.user_ids.indexOf(currentUser.email) === -1){
        lesson.user_ids.push(currentUser.email);
      }

      $http[method](url, lesson).success(function(lesson) {
        lessonService.getLessons();
        deferred.resolve(lesson);
      }).
      error(function(err) {
        deferred.reject(err);
      });

      return deferred.promise;  
    };

    lessonService.deleteLesson = function(_id){
      var deferred = $q.defer();

      $http.delete('/api/lessons/'+_id).success(function(data) {
          deferred.resolve(data);
          lessonService.getLessons();
        }).
        error(function(err) {
          deferred.reject(err);
        });

      return deferred.promise; 
    };

    return lessonService;
  });
