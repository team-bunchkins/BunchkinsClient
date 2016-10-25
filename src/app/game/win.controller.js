(function() {
    'use strict';

    angular
        .module('app')
        .controller('WinController', WinController);

    WinController.$inject = ['$scope', 'bunchkinsFactory', '$stateParams'];

    /* @ngInject */
    function WinController($scope, bunchkinsFactory, $stateParams) {
        var vm = this;
        vm.title = 'WinController';
        vm.player = $stateParams.player;
        //vm.imdbId = $stateParams.imdbCode;

        activate();

        ////////////////

        function activate() {
        	console.log($stateParams);
        }
    }
})();