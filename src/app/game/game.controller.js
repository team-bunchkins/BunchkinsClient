(function() {
    'use strict';

    angular
        .module('app')
        .controller('GameController', GameController);

    GameController.$inject = ['bunchkinsFactory'];

    /* @ngInject */
    function GameController(bunchkinsFactory) {
        var vm = this;
        vm.title = 'GameController';
        vm.game = bunchkinsFactory.game;
        vm.player = bunchkinsFactory.player;
        vm.players = bunchkinsFactory.opponents;

        vm.discard = discard;

        activate();

        ////////////////

        function activate() {
        }

    }
})();