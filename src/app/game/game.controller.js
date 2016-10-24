(function() {
    'use strict';

    angular
        .module('app')
        .controller('GameController', GameController);

    GameController.$inject = ['bunchkinsFactory', '$scope', '$state', 'toastr', 'toastrConfig'];

    /* @ngInject */
    function GameController(bunchkinsFactory, $scope, $state, toastr, toastrConfig) {
        var vm = this;
        vm.title = 'GameController';
        vm.game = bunchkinsFactory.game;
        vm.player = bunchkinsFactory.player;
        vm.opponents = bunchkinsFactory.opponents;
        vm.activePlayer = {};

        //functions
        vm.proceed = proceed;
        vm.fight = fight;
        vm.run = run;
        vm.pass = pass;
        vm.playCard = playCard;
        vm.discard = discard;
        vm.submitTarget = submitTarget;
        vm.getArray = getArray;

        activate();

        ////////////////

        function activate() {
            // Update ref to activePlayer
            $scope.$on('activePlayerChanged', function(event, data) {
                updateActivePlayer(data);
            });

            // call updateActivePlayer to initialize activePlayer
            // first $broadcast occurs before $on registered
            updateActivePlayer(vm.game.activePlayer);

            $scope.$on('cardPlayed', function(event, data) {
                cardPlayed(data.playerName, data.targetName, data.card);
            });
        }

        function proceed() {
            bunchkinsFactory.proceed();
            console.log(vm.player.hand.length)
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

        function playCard(targetName, card) {
            // some cards need opponent specified
            // otherwise target = self
            bunchkinsFactory.playCard(targetName, card);
        }

        function discard(card) {
            bunchkinsFactory.discard(card);
        }

        function submitTarget(targetName, card) {
            playCard(targetName, card);
            vm.isModalActive = false;
        }

        function updateActivePlayer(playerName) {
            if (vm.player.name == playerName) {
                vm.activePlayer = vm.player;
            } else {
                var index = vm.opponents.findIndex(function(element) {
                    return element.name == playerName;
                });
                vm.activePlayer = vm.opponents[index];
            }
        }

        function cardPlayed(playerName, targetName, card) {
            // change toastrConfig toast template
            angular.extend(toastrConfig, {
                templates: {
                    toast: 'app/toasts/cardtoast.html',
                    progressbar: 'directives/progressbar/progressbar.html'
                },
                positionClass: 'toast-top-center'
            });

            // call toastr, passing object for message
            toastr.info(
            {
                card: card,
                playerName: playerName,
                targetName: playerName != targetName ? targetName : null
            },
            {
                extendedTimeOut: 0,
                iconClass: 'toast-card-icon',
                messageClass: 'toast-card-message',
                timeOut: 0,
                toastClass: 'toast toast-card'
            });

            // reset toastrConfig to default template
            angular.extend(toastrConfig, {
                templates: {
                    toast: 'directives/toast/toast.html',
                    progressbar: 'directives/progressbar/progressbar.html'
                },
                positionClass: 'toast-top-right'
            });
        }

        function getArray(num) {
            return new Array(num);
        }

    }
})();
