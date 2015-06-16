(function(angular) {
  'use strict';

  angular
    .module('blogApp.article')
    .controller('ArticleCtrl', [
      '$rootScope',
      '$scope',
      '$state',
      '$window',
      'article',
      'ArticlesService',
      function($rootScope, $scope, $state, $window, article, ArticlesService) {
        $scope.article = article;
        $scope.deleteArticle = function(_id) {
          if ($window.confirm('Are you sure?') === true) {
            $scope.article.remove().then(function() {
              $state.go('articles');
            }, function(err) {
              $scope.errMsg = err.data.message;
            });
          }
        };

        $scope.addComment = function(_id, cmt, usrId) {
          if(!cmt) {
            return;
          }
          ArticlesService.addComment(_id, cmt, usrId).then(function(resultCmt) {
            $scope.article.cmts.push(resultCmt);
            $rootScope.user.cmt = '';
          }, function(err) {
            $scope.errMsg = err.data.message;
          });
        };
      }
    ]);
})(angular);
