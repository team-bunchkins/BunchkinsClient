(function() {
    'use strict';

    angular
        .module('app')
        .controller('WinController', WinController);

    WinController.$inject = ['$scope', '$state'];

    /* @ngInject */
    function WinController($scope, $state) {
        var vm = this;
        vm.title = 'WinController';

        activate();

        ////////////////

        function activate() {
        }
    }
})();