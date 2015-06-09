(function(angular) {
  'use strict';

  angular
    .module('blogApp.article')
    .controller('AddArticleCtrl', [
      '$scope',
      '$state',
      'ArticlesService',
      function($scope, $state, ArticlesService) {
        $scope.article = {};

        //listen to the file selected event
        $scope.$on("file:selected", function(evt, args) {
          $scope.photos = args.files;

          ArticlesService.uploadFile(args.files).then(function(files) {
            $scope.article.photos = files;
          }, function(err) {
            console.log(err);
          });
        });

        $scope.save = function(article) {
          ArticlesService.addArticle(article).then(function() {
            $state.go('articles');
          }, function(err) {
            console.log(err);
          });
        };
      }
    ]);
})(angular);
