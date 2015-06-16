(function(angular) {
  'use strict';

  angular
    .module('blogApp.user')
    .controller('SignUpCtrl', [
      '$rootScope',
      '$scope',
      '$state',
      'UserService',
      function($rootScope, $scope, $state, UserService) {
        var isUploaded = false;

        $scope.usrInfo = {};
        $scope.$on("file:selected", function(evt, args) {
          UserService.uploadFile(args.files[0]).then(function(file) {
            $scope.usrInfo.avatar = file.image;
            isUploaded = true;
          }, function(err) {
            $scope.errMsg = err.data.message;
          });
        });

        $scope.signup = function(usrInfo) {
          if (!isUploaded) {
            return;
          }

          UserService.signup(usrInfo).then(function() {
            $rootScope.isReg = true;
            $state.go('login');
          }, function(err) {
            $scope.errMsg = err.data.message;
          });
        };
      }
    ]);
})(angular);
