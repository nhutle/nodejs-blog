(function(angular) {
  'use strict';

  angular
    .module('blogApp.user')
    .factory('TokenService', [
      '$cookies',
      function($cookies) {
        var TokenService = {};

        TokenService.setToken = function(token) {
          $cookies.put('token', token);
        };

        TokenService.getToken = function() {
          return $cookies.get('token');
        };

        TokenService.removeToken = function() {
          $cookies.remove('token');
        };

        return TokenService;
      }
    ]);
})(angular);
