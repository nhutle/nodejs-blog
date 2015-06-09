(function(angular) {
  'use strict';

  angular
    .module('blogApp.user', [
      'ui.router',
      'restangular',
      'LocalStorageModule',
      'common'
    ])
    .config([
      '$stateProvider',
      'RestangularProvider',
      'localStorageServiceProvider',
      function($stateProvider, RestangularProvider, localStorageServiceProvider) {
        $stateProvider
          .state('login', {
            parent: 'main',
            url: '/users/login?token',
            templateUrl: 'views/login.html',
            controller: 'UserCtrl',
            onEnter: function($rootScope, $stateParams, UserService) {
              if ($stateParams.token) {
                UserService.verifyAcc($stateParams.token).then(function() {
                  $rootScope.isVerified = true;
                }, function(err) {
                  console.log(err);
                });
              }
            }
          })
          .state('signup', {
            parent: 'main',
            url: '/users/signup/',
            templateUrl: 'views/signup.html',
            controller: 'SignUpCtrl'
          });
        RestangularProvider.setBaseUrl('/api/');
        localStorageServiceProvider.setStorageType('sessionStorage');
        localStorageServiceProvider.setPrefix('ls');
      }
    ])
    .run([
      '$rootScope',
      'SessionService',
      function($rootScope, SessionService) {
        $rootScope.user = SessionService.getUser();
      }
    ]);
})(angular);
