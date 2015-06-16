(function(angular) {
  'use strict';

  angular
    .module('blogApp.article')
    .controller('EditArticleCtrl', [
      '$scope',
      '$state',
      'article',
      'ArticlesService',
      function($scope, $state, article, ArticlesService) {
        var isUploaded = false;

        $scope.article = article;
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
          $scope.article.put().then(function(article) {
            $state.go('article', {
              _id: article._id
            });
          }, function(err) {
            $scope.errMsg = err.data.message;
          });
        };
      }
    ]);
})(angular);
