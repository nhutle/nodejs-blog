(function(angular) {
  'use strict';

  angular
    .module('blogApp.user')
    .factory('UserService', [
      '$q',
      'Restangular',
      function($q, Restangular) {
        var UserService = {},
          Users = Restangular.all('users');

        UserService.login = function(email, password) {
          var usrInfo = {
            email: email,
            password: password
          };

          return Users.customPOST(usrInfo, 'login');
        };

        UserService.logout = function() {
          return Users.customGET('logout');
        };

        UserService.uploadFile = function(file) {
          var fd = new FormData();

          fd.append('avatar', file);

          return Users.withHttpConfig({
            transformRequest: angular.identity
          }).customPOST(fd, 'upload', undefined, {
            'Content-Type': undefined
          });
        }

        UserService.signup = function(usrInfo) {
          return Users.customPOST(usrInfo, 'signup');
        };

        UserService.verifyAcc = function(token) {
          Restangular.addFullRequestInterceptor(function(element, operation, route, url, headers, params, httpConfig) {
            headers = headers || {};
            if (token) {
              headers.Authorization = token;
            }

            return {
              headers: headers
            };
          });

          return Users.customGET('verify');
        }

        return UserService;
      }
    ]);
})(angular);
