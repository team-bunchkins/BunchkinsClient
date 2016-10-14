(function() {
    'use strict';

    angular
        .module('app')
        .controller('GameController', GameController);

    GameController.$inject = ['bunchkinsFactory', '$scope', '$state'];

    /* @ngInject */
    function GameController(bunchkinsFactory, $scope, $state) {
        var vm = this;
        vm.title = 'GameController';
        vm.game = bunchkinsFactory.game;
        vm.player = bunchkinsFactory.player;
        vm.players = bunchkinsFactory.opponents;

        //functions
        vm.proceed = proceed;
        vm.fight = fight;
        vm.run = run;
        vm.pass = pass;
        vm.playCard = playCard;
        vm.discard = discard;

        activate();

        ////////////////

        function activate() {

        }

        function proceed() {
            bunchkinsFactory.proceed();
        }

        function fight() {
            bunchkinsFactory.fight();
        }

        function run() {
            bunchkinsFactory.run();
        }

        function pass() {
            bunchkinsFactory.pass();
        }

        function playCard() {
            bunchkinsFactory.playCard();
        }

        function discard() {
            bunchkinsFactory.discard();
        }
    }
})();
