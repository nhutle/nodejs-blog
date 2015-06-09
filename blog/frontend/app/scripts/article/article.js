(function(angular) {
  'use strict';

  angular
    .module('blogApp.article', [
      'ui.router',
      'restangular',
      'common'
    ])
    .config([
      '$stateProvider',
      'RestangularProvider',
      function($stateProvider, RestangularProvider) {
        RestangularProvider.setBaseUrl('/api/');
        $stateProvider
          .state('articles', {
            parent: 'main',
            url: '/articles',
            templateUrl: 'views/articles.html',
            resolve: {
              results: [
                'ArticlesService',
                function(ArticlesService) {
                  return ArticlesService.getArticles(1, 5);
                }
              ]
            },
            controller: 'ArticlesCtrl'
          })
          .state('addArticle', {
            url: '/articles/new',
            parent: 'main',
            templateUrl: 'views/article-form.html',
            controller: 'AddArticleCtrl',
            isAuthRequired: true
          })
          .state('article', {
            url: '/articles/:_id',
            parent: 'main',
            templateUrl: 'views/article.html',
            resolve: {
              article: [
                '$stateParams',
                'ArticlesService',
                function($stateParams, ArticlesService) {
                  return ArticlesService.getArticle($stateParams._id);
                }
              ]
            },
            controller: 'ArticleCtrl'
          })
          .state('editArticle', {
            url: '/articles/:_id/edit',
            parent: 'main',
            templateUrl: 'views/article-form.html',
            resolve: {
              article: [
                '$stateParams',
                'ArticlesService',
                function($stateParams, ArticlesService) {
                  return ArticlesService.getArticle($stateParams._id);
                }
              ]
            },
            controller: 'EditArticleCtrl'
          });
      }
    ])
    .run([
      '$rootScope',
      '$state',
      function($rootScope, $state) {
        $rootScope.$on('$stateChangeStart', function(event, toState) {
          if (toState.isAuthRequired && $rootScope.user === null) {
            event.preventDefault();
            $state.go('login');
          }
        });
      }
    ]);
})(angular);
