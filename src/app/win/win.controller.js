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
        vm.winner = $stateParams.player;

        activate();

        ////////////////

        function activate() {
            // Check if url accessed improperly
            if (vm.game.gameId == '') {
                $state.go('lobby');
            } else if (vm.winner === null) {
                $state.go('game');
            }
        }
    }
})();
