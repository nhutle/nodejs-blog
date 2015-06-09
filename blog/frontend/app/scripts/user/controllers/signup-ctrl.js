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
        $scope.usrInfo = {};
        //listen for the file selected event
        $scope.$on("file:selected", function(evt, args) {
          UserService.uploadFile(args.files[0]).then(function(file) {
            $scope.usrInfo.avatar = file;
          }, function(err) {
            console.log(err);
          });
        });

        $scope.signup = function(usrInfo) {
          UserService.signup(usrInfo).then(function() {
            $rootScope.isReg = true;
            $state.go('login');
          }, function(err) {
            console.log(err);
          });
        };
      }
    ]);
})(angular);
