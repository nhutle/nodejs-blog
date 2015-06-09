(function(angular) {
  'use strict';

  angular
    .module('blogApp', [
      'ui.router',
      'blogApp.article',
      'blogApp.user',
      'blogApp.templates'
    ])
    .config([
      '$urlRouterProvider',
      '$stateProvider',
      function($urlRouterProvider, $stateProvider) {
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
      }
    ]);
})(angular);
