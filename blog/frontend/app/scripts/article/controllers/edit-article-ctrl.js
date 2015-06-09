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
        var isUpCompl = false;

        $scope.article = article;

        //listen to the file selected event
        $scope.$on("file:selected", function(evt, args) {
          $scope.photos = args.files;

          ArticlesService.uploadFile(args.files).then(function(files) {
            isUpCompl = true;
            $scope.article.photos = files;
          }, function(err) {
            console.log(err);
          });
        });

        $scope.save = function(article) {
          if (!isUpCompl) {
            return;
          }

          $scope.article.put().then(function(article) {
            $state.go('article', {
              _id: article._id
            });
          }, function(err) {
            console.log(err);
          });
        };
      }
    ]);
})(angular);
