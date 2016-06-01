'use strict';

angular.module('artifactsteachAppApp')
  .factory('Auth', function Auth($timeout, $location, $rootScope, $http, User, $cookieStore, $q) {
    var currentUser = {};
    if($cookieStore.get('token')) {
      currentUser = User.get();
    }

    return {

      /**
       * Authenticate user and save token
       *
       * @param  {Object}   user     - login info
       * @param  {Function} callback - optional
       * @return {Promise}
       */
      login: function(user, callback) {
        var cb = callback || angular.noop;
        var deferred = $q.defer();

        $http.post('/auth/local', {
          email: user.email,
          password: user.password
        }).
        success(function(data) {
          $cookieStore.put('token', data.token);
          $cookieStore.put('stripeCustId', data.stripe_cust_id);
          currentUser = User.get();
          deferred.resolve(data);
          return cb();
        }).
        error(function(err) {
          this.logout();
          deferred.reject(err);
          return cb(err);
        }.bind(this));

        return deferred.promise;
      },

      /**
       * Delete access token and user info
       *
       * @param  {Function}
       */
      logout: function() {
        $cookieStore.remove('token');
        $cookieStore.remove('stripeCustId')
        //$cookieStore.remove('firstLogin');
        currentUser = {};
      },

      /**
       * Create a new user
       *
       * @param  {Object}   user     - user info
       * @param  {Function} callback - optional
       * @return {Promise}
       */
      createUser: function(user, callback) {
        var cb = callback || angular.noop;

        return User.save(user,
          function(data) {
            $cookieStore.put('token', data.token);
            currentUser = User.get();
            return cb(user);
          },
          function(err) {
            this.logout();
            return cb(err);
          }.bind(this)).$promise;
      },

      /**
       * Change password
       *
       * @param  {String}   oldPassword
       * @param  {String}   newPassword
       * @param  {Function} callback    - optional
       * @return {Promise}
       */
      changePassword: function(oldPassword, newPassword, callback) {
        var cb = callback || angular.noop;

        return User.changePassword({ id: currentUser._id }, {
          oldPassword: oldPassword,
          newPassword: newPassword
        }, function(user) {
          return cb(user);
        }, function(err) {
          return cb(err);
        }).$promise;
      },

      /**
       * Reset password
       *
       * @param  {String}   email
       * @param  {Function} callback    - optional
       * @return {Promise}
       */
      forgotPassword: function(email, callback) {
        var cb = callback || angular.noop;

        return User.forgotPassword({
          email: email
        }, function(user) {
          return cb(user);
        }, function(err) {
          return cb(err);
        }).$promise;
      },

      /**
       * Reset password
       *
       * @param  {String}   email
       * @param  {Function} callback    - optional
       * @return {Promise}
       */
      resetPassword: function(token, password, callback) {
        var cb = callback || angular.noop;

        return User.resetPassword({
          token: token,
          password: password
        }, function(user) {
          return cb(user);
        }, function(err) {
          return cb(err);
        }).$promise;
      },

      /**
       * Gets all available info on authenticated user
       *
       * @return {Object} user
       */
      getCurrentUser: function() {
        return currentUser;
      },

      /**
       * Check if a user is logged in
       *
       * @return {Boolean}
       */
      isLoggedIn: function() {
        return currentUser.hasOwnProperty('role');
      },

      /**
       * Waits for currentUser to resolve before checking if user is logged in
       */
      isLoggedInAsync: function(cb) {
        if(currentUser.hasOwnProperty('$promise')) {
          currentUser.$promise.then(function() {
            cb(true);
          }).catch(function() {
            cb(false);
          });
        } else if(currentUser.hasOwnProperty('role')) {
          cb(true);
        } else {
          cb(false);
        }
      },

      /**
       * Check if a user is an admin
       *
       * @return {Boolean}
       */
      isAdmin: function() {
        return currentUser.role === 'admin';
      },

      /**
       * Get auth token
       */
      getToken: function() {
        return $cookieStore.get('token');
      },

      /**
       * Get Expire date
       */
      getExpdate: function(cb) {
        var callAtTimeout=function(){
          console.log("In service")
          // var today = new Date(); 
          // var todayDateOnly = new Date(today.getFullYear(),today.getMonth(),today.getDate());
          // var d = new Date(currentUser.created_at); 
          // var dDateOnly = new Date(d.getFullYear(),d.getMonth(),d.getDate());
          // dDateOnly = new Date(dDateOnly.getTime() + 30*24*60*60*1000);
          // cb(dDateOnly.getTime() >= todayDateOnly.getTime());


          //----------------- Demo ----------------------
          var today = new Date(); 
          var todayDateOnly = new Date(today);
          var d = new Date(currentUser.created_at); 
          var dDateOnly = new Date(d.getTime() + (2 * 60 * 1000));
          cb(dDateOnly.getTime() >= todayDateOnly.getTime());
        }
        $timeout(callAtTimeout,1000);
      }

    };
  });
