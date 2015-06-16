(function(angular) {
  'use strict';

  angular
    .module('blogApp.article')
    .controller('AddArticleCtrl', [
      '$scope',
      '$state',
      'ArticlesService',
      function($scope, $state, ArticlesService) {
        var isUploaded = false;

        $scope.article = {};
        $scope.$on("file:selected", function(evt, args) {
          $scope.photos = args.files;
          ArticlesService.uploadFile(args.files).then(function(result) {
            $scope.article.photos = result.photos;
            isUploaded = true;
          }, function(err) {
            $scope.errMsg = err.data.message;
          });
        });

        $scope.save = function(article) {
          if (!isUploaded) {
            return;
          }
          ArticlesService.addArticle(article).then(function() {
            $state.go('articles');
          }, function(err) {
            $scope.errMsg = err.data.message;
          });
        };
      }
    ]);
})(angular);
