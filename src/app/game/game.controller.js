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
        vm.opponents = bunchkinsFactory.opponents;

        //functions
        vm.proceed = proceed;
        vm.fight = fight;
        vm.run = run;
        vm.pass = pass;
        vm.playCard = playCard;
        vm.discard = discard;
        vm.getHeadgear = getHeadgear;

        //variables
        vm.equips = {
            head: {},
            body: {},
            feet: {},
            leftHand: {},
            rightHand: {},
            bothHand: {}
        }


        activate();

        ////////////////

        function activate() {
            // $scope.$on('stateChanged', function(event, data) {});
            // but may be sufficient to ng-show/hide elements based on state

            // TODO: Add $on combatStart (or start state) to update ref to activePlayer
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

        function playCard(target, card) {
            // some cards need opponent specified
            // otherwise target = self
            bunchkinsFactory.playCard(target, card);
            getHeadgear(target);
            getArmor(target);
        }

        function discard(card) {
            bunchkinsFactory.discard(card);
        }

        function getHeadgear(player) {
            var headgear = bunchkinsFactory.getHeadgear(player);
            vm.equips.head = headgear;
        }

        function getArmor(player) {
            var armor = bunchkinsFactory.getArmor(player);
            vm.equips.body = armor;
        }

        function getFootgear(player) {
            var footgear = bunchkinsFactory.getFootgear(player);
            vm.equips.feet = footgear;
        }
    }
})();
