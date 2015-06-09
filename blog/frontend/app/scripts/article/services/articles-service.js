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
          var deferred = $q.defer();

          Articles.post(article).then(function(article) {
            deferred.resolve(article);
          }, function(reason) {
            deferred.reject(reason);
          });

          return deferred.promise;
        };

        /**
         * add a comment to the article
         * @param {String} artId
         * @param {String} comment
         * @param {String} usrId
         * @return {Object} promise
         */
        ArticlesService.addComment = function(artId, comment, usrId) {
          var deferred = $q.defer(),
            newComment = {};

          newComment.articleId = artId;
          newComment.userId = usrId;
          newComment.content = comment;

          Comments.post(newComment).then(function(comment) {
            deferred.resolve(comment);
          }, function(reason) {
            deferred.reject(reason);
          });

          return deferred.promise;
        };

        ArticlesService.uploadFile = function(files) {
          var deferred = $q.defer(),
            fd = new FormData();

          for (var i = 0, j = files.length; i < j; i++) {
            fd.append('photo' + i, files[i]);
          }

          Articles.withHttpConfig({
            transformRequest: angular.identity
          }).customPOST(fd, 'upload', undefined, {
            'Content-Type': undefined
          }).then(function(files) {
            deferred.resolve(files);
          }, function(reason) {
            deferred.reject(reason);
          });

          return deferred.promise;
        };

        return ArticlesService;
      }
    ]);

})(angular);
