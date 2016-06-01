'use strict';

angular.module('artifactsteachAppApp')
  .controller('RenewalCtrl', function ($scope, User, Auth, lessonService, $cookieStore) {
    $scope.errors = {};

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
            $cookieStore.put('stripeCustId', response.id);
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

    $scope.deleteAccount = function(){
      lessonService.deleteAcc().then(function(response) {
        $cookieStore.remove('stripeCustId');
      });
    }
  });
