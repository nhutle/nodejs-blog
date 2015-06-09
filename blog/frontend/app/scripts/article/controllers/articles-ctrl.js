(function(angular) {
  'use strict';

  angular
    .module('blogApp.article')
    .controller('ArticlesCtrl', [
      '$scope',
      '$state',
      'ArticlesService',
      'results',
      function($scope, $state, ArticlesService, results) {
        $scope.limit = 5;
        $scope.curPage = 1;
        $scope.pages = [];
        $scope.articles = results[0];

        for (var i = 1; i <= results[1]; i++) {
          $scope.pages.push({
            text: i
          });
        }

        $scope.paginData = function(curPage) {
          ArticlesService.getArticles(curPage, $scope.limit).then(function(results) {
            $scope.articles = results[0];
            $scope.curPage = curPage;
          });
        };
      }
    ]);
})(angular);
