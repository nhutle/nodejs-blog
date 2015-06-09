(function(angular) {
  'use strict';

  angular
    .module('blogApp.user')
    .controller('UserCtrl', [
      '$rootScope',
      '$scope',
      '$state',
      'UserService',
      'SessionService',
      function($rootScope, $scope, $state, UserService, SessionService) {
        $scope.login = function(email, password) {
          UserService.login(email, password).then(function(user) {
            $rootScope.user = {
              _id: user._id,
              fullname: user.fullname,
              avatar: user.avatar,
              isAuth: user.isAuth
            };
            SessionService.setUser($rootScope.user);
            $rootScope.isReg = false;
            $rootScope.isVerified = false;
            $state.go('articles');
          }, function(err) {
            console.log(err);
          });
        };

        $scope.logout = function() {
          UserService.logout().then(function() {
            $rootScope.user._id = '';
            $rootScope.user.fullname = '';
            $rootScope.user.avatar = '';
            $rootScope.user.isAuth = false;
            SessionService.destroyUser();
          }, function(err) {
            console.log(err);
          });
        };
      }
    ]);
})(angular);
