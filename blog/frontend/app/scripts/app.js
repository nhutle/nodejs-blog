(function(angular) {
  'use strict';

  angular
    .module('blogApp', [
      'ngCookies',
      'ui.router',
      'restangular',
      'common',
      'blogApp.article',
      'blogApp.user',
      'blogApp.templates'
    ])
    .config([
      '$urlRouterProvider',
      '$stateProvider',
      '$httpProvider',
      'RestangularProvider',
      function($urlRouterProvider, $stateProvider, $httpProvider, RestangularProvider) {
        $urlRouterProvider.otherwise('/articles');
        $stateProvider
          .state('main', {
            url: '',
            abstract: true,
            views: {
              '': {
                templateUrl: 'views/layout.html'
              },
              'header@main': {
                templateUrl: 'views/header.html',
              },
              'footer@main': {
                templateUrl: 'views/footer.html',
              }
            }
          });
        RestangularProvider.setBaseUrl('/api/');
        $httpProvider.interceptors.push(['$q', 'JwtService',
          function($q, JwtService) {
            return {
              'responseError': function(response) {
                if (response.status === 401)
                  JwtService.removeToken();

                return $q.reject(response);
              }
            };
          }
        ]);
        $httpProvider.interceptors.push('JwtInterceptor');
      }
    ])
    .run([
      '$rootScope',
      '$state',
      'JwtService',
      'UserService',
      function($rootScope, $state, JwtService, UserService) {
        var token = JwtService.getToken();

        if (token) {
          UserService.authen().then(function(user) {
            $rootScope.user = user;
          }, function(err) {
            JwtService.removeToken();
          });
        }

        $rootScope.$on('$stateChangeStart', function(event, toState) {
          if (toState.isAuthRequired && $rootScope.user === null) {
            event.preventDefault();
            $state.go('login');
          }
        });
      }
    ]);
})(angular);
