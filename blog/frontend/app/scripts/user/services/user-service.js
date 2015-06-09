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
          var deferred = $q.defer(),
            usrInfo = {};

          usrInfo.email = email;
          usrInfo.password = password;

          Users.customPOST(usrInfo, 'login').then(function(user) {
            deferred.resolve(user);
          }, function(reason) {
            deferred.reject(reason);
          });

          return deferred.promise;
        };

        UserService.logout = function() {
          var deferred = $q.defer();

          Users.customGET('logout').then(function(result) {
            deferred.resolve(result);
          }, function(reason) {
            deferred.reject(reason);
          });

          return deferred.promise;
        };

        UserService.uploadFile = function(file) {
          var deferred = $q.defer(),
            fd = new FormData();

          fd.append('avatar', file);
          Users.withHttpConfig({
            transformRequest: angular.identity
          }).customPOST(fd, 'upload', undefined, {
            'Content-Type': undefined
          }).then(function(file) {
            deferred.resolve(file);
          }, function(reason) {
            deferred.reject(reason);
          });

          return deferred.promise;
        }

        UserService.signup = function(usrInfo) {
          var deferred = $q.defer();

          Users.customPOST(usrInfo, 'signup').then(function(results) {
            deferred.resolve(results);
          }, function(reason) {
            deferred.reject(reason);
          });

          return deferred.promise;
        };

        UserService.verifyAcc = function(token) {
          var deferred = $q.defer();

          Restangular.addFullRequestInterceptor(function(element, operation, route, url, headers, params, httpConfig) {
            headers = headers || {};
            if (token) {
              headers.Authorization = token;
            }

            return {
              headers: headers
            };
          });
          Users.customGET('verify').then(function() {
            deferred.resolve();
          }, function(reason) {
            deferred.reject(reason);
          });

          return deferred.promise;
        }

        return UserService;
      }
    ]);
})(angular);
