(function(angular) {
  'use strict';

  angular
    .module('blogApp.user')
    .factory('SessionService', [
      'localStorageService',
      function(localStorageService) {
        var SessionService = {};

        SessionService.setUser = function(user) {
          localStorageService.set('user', user);
        };

        SessionService.getUser = function() {
          return localStorageService.get('user');
        };

        SessionService.destroyUser = function() {
          SessionService.setUser(null);
        };

        return SessionService;
      }
    ]);
})(angular);
