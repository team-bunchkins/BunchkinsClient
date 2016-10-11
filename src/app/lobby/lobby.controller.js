(function() {
    'use strict';

    angular
        .module('app')
        .controller('LobbyController', LobbyController);

    LobbyController.$inject = ['bunchkinsFactory', '$scope', '$state'];

    /* @ngInject */
    function LobbyController(bunchkinsFactory, $scope, $state) {
        var vm = this;
        vm.game = bunchkinsFactory.game;
        vm.player = bunchkinsFactory.player;
        vm.players = bunchkinsFactory.opponents;
        vm.createGame = createGame;
        vm.joinGame = joinGame;
        var factory = bunchkinsFactory;

        activate();

        function activate() {
            $scope.$on('gameStarted', function(event, data) {
                $state.go('game');
            });
        }

        function createGame(playerName) {
            factory.createGame(playerName);
        }

        function joinGame(playerName, gameId) {
            factory.joinGame(playerName, gameId);
        }


    }
})();
