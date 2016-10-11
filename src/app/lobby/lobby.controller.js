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
        vm.startGame = startGame;

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

        function startGame(){
            bunchkinsFactory.startGame();
        }

    }
})();
