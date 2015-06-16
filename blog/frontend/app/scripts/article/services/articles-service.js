(function(angular) {
  'use strict';

  angular
    .module('blogApp.article')
    .factory('ArticlesService', [
      '$q',
      'Restangular',
      function($q, Restangular) {
        var ArticlesService = {},
          Articles = Restangular.all('articles'),
          Comments = Restangular.all('comments');

        /**
         * get list of articles
         * @return {Object} promise
         */
        ArticlesService.getArticles = function(currentPage, pageLimit) {
          var deferred = $q.defer();

          Articles.getList({
            curPage: currentPage,
            limit: pageLimit
          }).then(function(articles) {
            deferred.resolve(articles);
          }, function(reason) {
            deferred.reject(reason);
          });

          return deferred.promise;
        };

        /**
         * get an article with its id
         * @param  {String} _id
         * @return {Object} promise
         */
        ArticlesService.getArticle = function(_id) {
          var deferred = $q.defer();

          Articles.one(_id).get().then(function(article) {
            deferred.resolve(article);
          }, function(reason) {
            deferred.reject(reason);
          });

          return deferred.promise;
        };

        /**
         * add a new article
         * @param {article} article
         * @return {Object} promise
         */
        ArticlesService.addArticle = function(article) {
          return Articles.post(article);
        };

        /**
         * add a comment to the article
         * @param {String} artId
         * @param {String} comment
         * @param {String} usrId
         * @return {Object} promise
         */
        ArticlesService.addComment = function(artId, comment, usrId) {
          var newComment = {
            articleId: artId,
            userId: usrId,
            content: comment
          };

          return Comments.post(newComment);
        };

        ArticlesService.uploadFile = function(files) {
          var fd = new FormData();

          for (var i = 0, j = files.length; i < j; i++) {
            fd.append('photo' + i, files[i]);
          }

          return Articles.withHttpConfig({
            transformRequest: angular.identity
          }).customPOST(fd, 'upload', undefined, {
            'Content-Type': undefined
          });
        };

        return ArticlesService;
      }
    ]);

})(angular);
