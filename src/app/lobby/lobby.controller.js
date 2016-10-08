(function() {
    'use strict';

    angular
        .module('app')
        .controller('LobbyController', LobbyController);

    LobbyController.$inject = ['bunchkinsFactory'];

    /* @ngInject */
    function LobbyController(bunchkinsFactory) {
        var vm = this;
        vm.player = bunchkinsFactory.player;
        vm.players = bunchkinsFactory.opponents;
        vm.createGame = createGame;
        vm.joinGame = joinGame;
        var factory = bunchkinsFactory;

        activate();

        function activate() {
        }

        function createGame() {
            factory.createGame(vm.create.playerName);
        }

        function joinGame() {
            factory.joinGame(vm.join.playerName, vm.join.gameId);
        }
    }
})();
