(function() {
    'use strict';

    angular
        .module('app')
        .controller('TestController', TestController);

    TestController.$inject = ['bunchkinsFactory'];

    /* @ngInject */
    function TestController(bunchkinsFactory) {
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
