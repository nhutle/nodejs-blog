(function(angular) {
  'use strict';

  angular
    .module('services')
    .factory('JwtService', [
      '$cookies',
      function($cookies) {
        var JwtService = {};

        JwtService.setToken = function(token) {
          $cookies.put('token', token);
        };

        JwtService.getToken = function() {
          return $cookies.get('token');
        };

        JwtService.removeToken = function() {
          $cookies.remove('token');
        };

        return JwtService;
      }
    ]);
})(angular);
