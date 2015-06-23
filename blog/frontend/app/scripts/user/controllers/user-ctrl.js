(function(angular) {
  'use strict';

  angular
    .module('blogApp.user')
    .controller('UserCtrl', [
      '$rootScope',
      '$scope',
      '$state',
      'UserService',
      'TokenService',
      function($rootScope, $scope, $state, UserService, TokenService) {
        $scope.login = function(email, password) {
          UserService.login(email, password).then(function(user) {
            // set token to cookie
            TokenService.setToken(user.token);

            $rootScope.user = {};
            $rootScope.user._id = user._id,
            $rootScope.user.fullname = user.fullname,
            $rootScope.user.avatar = user.avatar
            $rootScope.isReg = false;
            $rootScope.isVerified = false;

            $state.go('articles');
          }, function(err) {
            $scope.errMsg = err.data.message;
          });
        };

        $scope.logout = function() {
          UserService.logout().then(function() {
            $rootScope.user = null;
            TokenService.removeToken();
          }, function(err) {
            $scope.errMsg = err.data.message;
          });
        };
      }
    ]);
})(angular);
