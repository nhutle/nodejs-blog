(function(angular) {
  'use strict';

  angular
    .module('directives')
    .directive('fileUpload', [

      function() {

        return {
          link: function(scope, el, attrs) {
            el.bind('change', function(event) {
              scope.$emit('file:selected', {
                files: event.target.files
              });
            });
          }
        };
      }
    ]);
})(angular);
