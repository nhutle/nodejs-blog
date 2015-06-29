(function(angular) {
  'use strict';

  angular
    .module('services')
    .factory('JwtInterceptor', [
      'JwtService',
      function(JwtService) {
        return {
          'request': function(config) {
            if (JwtService.getToken()) {
              config.headers = config.headers || {};
              config.headers.Authorization = JwtService.getToken();
            }

            return config;
          }
        };
      }
    ]);
})(angular);
