(function(angular) {
  'use strict';

  angular
    .module('blogApp.article', [])
    .config([
      '$stateProvider',
      function($stateProvider) {
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
    ]);
})(angular);
