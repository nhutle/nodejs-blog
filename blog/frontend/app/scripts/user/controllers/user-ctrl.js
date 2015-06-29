(function(angular) {
  'use strict';

  angular
    .module('blogApp.user')
    .controller('UserCtrl', [
      '$rootScope',
      '$scope',
      '$state',
      'UserService',
      'JwtService',
      function($rootScope, $scope, $state, UserService, JwtService) {
        $scope.login = function(email, password) {
          UserService.login(email, password).then(function(user) {
            // set token to cookie
            JwtService.setToken(user.token);

            $rootScope.user = {
              _id: user._id,
              fullname: user.fullname,
              avatar: user.avatar
            };
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
            JwtService.removeToken();
          }, function(err) {
            $scope.errMsg = err.data.message;
          });
        };
      }
    ]);
})(angular);
