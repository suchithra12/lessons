'use strict';

angular.module('artifactsteachAppApp')
  .factory('User', function ($resource) {
    return $resource('/api/users/:id/:controller', {
      id: '@_id'
    },
    {
      forgotPassword:  {
        method: 'POST',
        params: {
          controller:'forgot'
        }
      },
      resetPassword:  {
        method: 'POST',
        params: {
          controller:'reset'
        }
      },
      changePassword: {
        method: 'PUT',
        params: {
          controller:'password'
        }
      },
      get: {
        method: 'GET',
        params: {
          id:'me'
        }
      }
	  });
  });
