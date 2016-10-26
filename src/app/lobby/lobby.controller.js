(function() {
    'use strict';

    angular
        .module('app')
        .controller('LobbyController', LobbyController);

    LobbyController.$inject = ['bunchkinsFactory', '$scope', '$state', 'swangular'];

    /* @ngInject */
    function LobbyController(bunchkinsFactory, $scope, $state, swangular) {
        var vm = this;
        vm.game = bunchkinsFactory.game;
        vm.player = bunchkinsFactory.player;
        vm.players = bunchkinsFactory.opponents;
        vm.createGame = createGame;
        vm.joinGame = joinGame;
        vm.startGame = startGame;
        vm.leaveGame = leaveGame;

        activate();

        function activate() {
            $scope.$on('gameStarted', function(event, data) {
                $state.go('game');
            });
        }

        function createGame(playerName) {
            bunchkinsFactory.createGame(playerName);
        }

        function joinGame(playerName, gameId) {
            bunchkinsFactory.joinGame(playerName, gameId);
        }

        function startGame() {
            bunchkinsFactory.startGame();
        }

        function leaveGame(gameId, playerName) {
            swangular.confirm("Are you sure you want to leave the game?",
                {showCancelButton: true}
            ).then(
                function() {
                    bunchkinsFactory.leaveGame(gameId, playerName);
                },
                function(dismiss) {
                    // dismiss can be 'overlay', 'cancel', 'close', 'esc', 'timer'
                }
            );

        }

    }
})();
