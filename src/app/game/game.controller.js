(function() {
    'use strict';

    angular
        .module('app')
        .controller('GameController', GameController);

    GameController.$inject = ['bunchkinsFactory', '$scope', '$state', 'swangular', 'toastr', 'toastrConfig'];

    /* @ngInject */
    function GameController(bunchkinsFactory, $scope, $state, swangular, toastr, toastrConfig) {
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
            if (vm.game.gameState.name == 'CombatState') {
                if (vm.game.gameState.canPlayerWin) {
                    if (vm.game.gameState.playersPassed.length == vm.opponents.length) {
                        // Check win condition for battle and that all opponents have passed
                        // Proceed into next stage in game
                        bunchkinsFactory.proceed();
                    } else {
                        // Opponents have not all passed yet, return alert for active player
                        console.log('Number of players passed: ' + vm.game.gameState.playersPassed.length);
                        console.log('Number of opponents: ' + vm.opponents.length);
                        toastr.info('Please wait for your opponents to pass before battling.', 'Waiting');
                    }
                } else {
                    // Warn player that death is imminent
                    toastr.warning('Please run away quietly. *tip toes away*', 'Warning');
                }
            } else if (vm.game.gameState.name == 'EndState' && vm.player.hand.length > 5) {
                //Warns player that maximum hand size has been exceeded
                toastr.info('You must have 5 or less cards in your hand, please.');
            } else {
                // Okay to proceed in all other cases
                bunchkinsFactory.proceed();
            }
            console.log(vm.player.hand.length);
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

        function playCard(card) {
            var targetName;
            // some cards need opponent specified
            // otherwise target = self
            if (card.type == "Curse") {
                swangular.open({
                    title: "Cast curse!",
                    htmlTemplate: "app/game/target.swal.html",
                    scope: $scope,
                    showCancelButton: true
                }).then(
                    function() {
                        bunchkinsFactory.playCard(vm.spellTarget, card);
                    }
                );
            } else {
                bunchkinsFactory.playCard(vm.player.name, card);
            }
        }

        function discard(card) {
            swangular.confirm("Are you sure you want to discard?", {
                showCancelButton: true
            }).then(
                function() {
                    bunchkinsFactory.discard(card);
                    console.log(vm.discard);
                },
                function(dismiss) {
                    // dismiss can be 'overlay', 'cancel', 'close', 'esc', 'timer'
                }
            );
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
            toastr.info({
                card: card,
                playerName: playerName,
                targetName: playerName != targetName ? targetName : null
            }, {
                extendedTimeOut: 5000000,
                iconClass: 'toast-card-icon',
                messageClass: 'toast-card-message',
                timeOut: 5000,
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
