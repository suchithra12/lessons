'use strict';

angular.module('artifactsteachAppApp')
  .controller('LessonsCtrl', function ($rootScope, $scope, $routeParams, $location, $sce, ngToast, lessonService) {

    var all_cs_docs = cs_documents.concat(cs_documents_new);

    $scope.lessonsActive = true;
    $scope.artifacts = angular.copy(newArtifacts);

    $scope.purchaseClick = false;
    $scope.purchaseDone = false;

    $scope.purchase = function(){

      $scope.purchaseClick = true;

      var handler = StripeCheckout.configure({
        key: 'pk_test_gi70mqCyPzCtGfk0sCm01FWR',
        image: 'assets/images/background.jpg',
        locale: 'auto',
        token: function(token) {
          console.log(token.id);
          lessonService.Pay(token.id).then(function(response) {

          });
          
          $scope.purchaseDone = true;
        }
      });

      handler.open({
        name: 'Stripe.com',
        description: 'My lessons',
        amount: 1499
      });

    }


    $scope.editLesson = function(){
      window.location.href = "/" + this.lesson._id;
      event.preventDefault();
    }

    $scope.viewLesson = function(){
      $scope.lesson = this.lesson;
      $scope.activeArtifacts = _.map($scope.lesson.artifacts, function(i){
        return _.where($scope.artifacts, {uuid: i})[0];
      });
      $scope.setActiveArtifact();
      $scope.showLessonViewer();
    };

    $scope.deleteLesson = function(){
      var lesson = this.lesson;
      var r = window.confirm('Are you sure you want to delete ' + lesson.title + '?');
      if (r === true) {
        lessonService.deleteLesson(lesson._id).then(function(){
          displayToast('danger', 'deleted');
          $scope.lessons = _.reject($scope.lessons, lesson);
        }).catch(function(err){
          // Failed - log error or alert
        })
      }
    };

    $scope.setActiveArtifact = function(){
      $scope.activeArtifact = this.artifact || $scope.activeArtifacts[0];
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

    function getLessons(){
      lessonService.getLessons().then(function(lessons){
        if(!_.isEmpty($scope.lesson)){
          $scope.viewLesson();
        }
      }).catch(function(err){
        // Failed - log error or alert
      })
    }

    function displayToast(type, content){
      ngToast[type]({
        timeout: 3000,
        content: 'Lesson ' + content + '.'
      });
    }

    getLessons();

  });
