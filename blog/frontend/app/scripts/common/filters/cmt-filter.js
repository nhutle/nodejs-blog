(function(angular) {
  'use strict';

  angular
    .module('filters')
    .filter('cmtFilter', [

      function() {

        return function(totalCmts) {
          return totalCmts > 1 ? totalCmts + ' comments' : totalCmts + ' comment';
        };
      }
    ]);
})(angular);
