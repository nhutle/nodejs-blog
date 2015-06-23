(function(angular) {
  'use strict';

  angular
    .module('blogApp.user', [])
    .config([
      '$stateProvider',
      function($stateProvider) {
        $stateProvider
          .state('login', {
            parent: 'main',
            url: '/users/login?token',
            templateUrl: 'views/login.html',
            controller: 'UserCtrl',
            onEnter: function($rootScope, $stateParams, UserService) {
              if ($stateParams.token) {
                UserService.authen($stateParams.token).then(function() {
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
      }
    ]);
})(angular);
