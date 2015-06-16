(function(angular) {
  'use strict';

  angular
    .module('blogApp', [
      'ui.router',
      'restangular',
      'LocalStorageModule',
      'common',
      'blogApp.article',
      'blogApp.user',
      'blogApp.templates'
    ])
    .config([
      '$urlRouterProvider',
      '$stateProvider',
      'RestangularProvider',
      'localStorageServiceProvider',
      function($urlRouterProvider, $stateProvider, RestangularProvider, localStorageServiceProvider) {
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
        localStorageServiceProvider.setStorageType('sessionStorage');
        localStorageServiceProvider.setPrefix('ls');
      }
    ])
    .run([
      '$rootScope',
      '$state',
      'SessionService',
      function($rootScope, $state, SessionService) {
        $rootScope.user = SessionService.getUser();
        $rootScope.$on('$stateChangeStart', function(event, toState) {
          if (toState.isAuthRequired && $rootScope.user === null) {
            event.preventDefault();
            $state.go('login');
          }
        });
      }
    ]);
})(angular);
