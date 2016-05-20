'use strict';

angular.module('artifactsteachAppApp')
  .controller('MainCtrl', function ($rootScope, $scope, $location, $sce, $log, ngToast, lessonService, Auth) {

    var all_cs_docs = cs_documents.concat(cs_documents_new);
    var lessonSaved = false;

    // Scope vars:
    $scope.artifactsActive = true;
    $scope.artifacts = angular.copy(newArtifacts);
    $scope.artifactTags = _.sortBy(_.compact(_.uniq(_.map(_.pluck($scope.artifacts, 'tags').toString().trim().split(','), function(tag){return tag.trim().toUpperCase();}))));
    $scope.collections = _.sortBy(_.compact(_.uniq(_.map(_.pluck($scope.artifacts, 'collection').toString().trim().split(','), function(tag){return tag.trim().toUpperCase();}))));
    $scope.templateUrl = 'app/main/popover.html';

    // Exposed scope functions:
    $scope.saveLesson = saveLesson;
    $scope.deleteLesson = deleteLesson;
    $scope.resetLesson = resetLesson;

    $scope.viewLesson = function(){
      event.preventDefault();
      $scope.activeArtifacts = _.map($scope.lesson.artifacts, function(i){
        return _.where($scope.artifacts, {uuid: i})[0];
      });
      $scope.activeArtifact = $scope.activeArtifacts[0];
      $scope.setActiveArtifact();
      $scope.showLessonViewer();
    };

    $scope.viewArtifact = function(){
      $scope.activeArtifacts = null;
      $scope.activeArtifact = this.artifact;
      $scope.setActiveArtifact();
      $scope.showLessonViewer();
    };

    $scope.setActiveArtifact = function(){
      if(this.artifact){
        $scope.activeArtifact = this.artifact;
      }
      var url = "https://bob.bigobjectbase.com/assets/"+$scope.activeArtifact.uuid+"/view/iframe";
      $scope.activeBOBURL = $sce.trustAsResourceUrl(url);
      $scope.cs_documents = _.filter(all_cs_docs, function(a){
        return _.indexOf(a.artifact, parseInt($scope.activeArtifact.old_number)) >= 0
      })
      if($scope.cs_documents[0].cs_docs){
        var artifact = $scope.cs_documents[0].artifact[0];
        $scope.fileURL = artifact === 100140 ? 'https://' : "/cs_docs_pdfs/";
        $scope.cs_documents = $scope.cs_documents[0].cs_docs
      } else {
        $scope.fileURL = null;
      }
    };

    $scope.showValue =function(){
      this.selectedTag = this.selectedTag || '';
      this.selectedCollection = this.selectedCollection || '';
    };

    $scope.isDuplicateName = function(){
      // Returning true disables
      if ($scope.lesson && $scope.lesson.title){
        var duplicate = _.where($scope.lessons, {title: $scope.lesson.title}).length > 0;
        var test = $scope.lesson._id ?  $rootScope.lesson.title === $scope.lesson.title || duplicate : duplicate;
        return test;
      } else {
        return true;
      }
    };

    $scope.artifactsNotValid = function(){
      // Returning true disables
      var len = _.where($scope.artifacts, {addedToLesson: true}).length;
      return len === 0 ? true : _.isEqual($scope.lesson.artifacts, _.pluck(_.where($scope.artifacts, {'addedToLesson': true}), 'uuid'));
    }

    $scope.disableButtons =function(){
      // Returning true disables, returning false enables save
      return ($scope.lesson && $scope.lesson._id) ? $scope.artifactsNotValid() && $scope.isDuplicateName() : $scope.artifactsNotValid() || $scope.isDuplicateName();
    }

    //Internal functions:
    function saveLesson(){
      displayToast('warning', 'saving');
      $rootScope.serverActive = true;
      $scope.lesson.artifacts = _.pluck(_.where($scope.artifacts, {'addedToLesson': true}), 'uuid');
      lessonService.saveLesson($scope.lesson).then(function(lesson){
        lessonSaved = true;
        $location.url("/" + lesson._id);
        displayToast('success', 'saved');
      }).catch(function(err){
        console.log(err);
        // Failed - log error or alert
      }) 
    };

    function deleteLesson(){
      var r = window.confirm('Are you sure you want to delete ' + $scope.lesson.title + '?');
      if (r === true) {
        $rootScope.serverActive = true;
        lessonService.deleteLesson($scope.lesson._id).then(function(){
          displayToast('danger', 'deleted');
          resetLesson();
        }).catch(function(err){
          // Failed - log error or alert
        })
      }
    };

    function getLessons(){
      lessonService.getLessons().then(function(lessons){
        resetLesson();
      }).catch(function(err){
        // Failed - log error or alert
      })
    }

    function resetLesson(){ // Actually - what does reset really mean? Here it means wipe it out, but if you have something there already??
      event.preventDefault();
      $scope.artifacts = angular.copy(newArtifacts);
      $scope.lesson = angular.copy($rootScope.lesson);
      _.each($scope.lesson.artifacts, function(i){
        _.find($scope.artifacts, {uuid: i}).addedToLesson = true;
      });
    };

    function displayToast(type, content){
      $rootScope.serverActive = false;
      ngToast[type]({
        timeout: 2000,
        content: 'Lesson ' + content + '.'
      });
    }

    // Scope events
    $scope.$on('$locationChangeStart', function( event ) {
      if(lessonSaved) {
        lessonSaved = false;
        return;
      }
      if ($scope.artifactsNotValid() && !$scope.lessonForm.$dirty) return //good to moveon
      var answer = confirm('If you leave this page you are going to lose all unsaved changes, are you sure you want to leave?')
      if (!answer) {
        event.preventDefault();
      }
    });

    getLessons();

  });