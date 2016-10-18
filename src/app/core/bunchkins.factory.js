(function() {
    'use strict';

    angular
        .module('app')
        .factory('bunchkinsFactory', bunchkinsFactory);

    bunchkinsFactory.$inject = ['$rootScope', 'Hub', '$timeout', 'signalRUrl'];

    /* @ngInject */
    function bunchkinsFactory($rootScope, Hub, $timeout, signalRUrl) {

        var service = {
            game: {
                gameId: '',
                gameState: '',
                activePlayer: '',
                combatState: {}
            },
            player: {
                name: '',
                level: 0,
                hand: [],
                equippedCards: {}
            },
            opponents: [],
            createGame: createGame,
            joinGame: joinGame,
            startGame: startGame,
            playCard: playCard,
            discard: discard,
            proceed: proceed,
            fight: fight,
            run: run,
            pass: pass,
            getHeadgear: getHeadgear,
            getArmor: getArmor,
            getFootgear: getFootgear
        };

        var hub = new Hub('bunchkinsHub', {
            //client side methods
            listeners: {
                'callerJoined': function(gameId, players) {
                    service.game.gameId = gameId;
                    // append to original opponents object to preserve bindings
                    if (players) {
                        players.forEach(function(element) {
                            service.opponents.push(element);
                        });
                    }
                    console.log("Joined game " + gameId);
                    $rootScope.$apply();
                },
                'playerJoined': function(player) {
                    service.opponents.push(player);
                    console.log(player.name + " joined");
                    $rootScope.$apply();
                },
                'displayError': function(errorString) {
                    console.log(errorString);
                },
                'gameStarted': function() {
                    $rootScope.$broadcast('gameStarted', service.game.gameState);
                },
                'stateChanged': function(state) {
                    service.game.gameState = state;
                    $rootScope.$apply();
                    // $rootScope.$broadcast('stateChanged', service.game.gameState);
                },
                'activePlayerChanged': function(playerName) {
                    service.game.activePlayer = playerName;
                    $rootScope.$apply();
                },
                'updatePlayer': function(player) {
                    service.player.level = player.level;
                    service.player.combatPower = player.combatPower;
                    service.player.hand = player.hand;
                    service.player.equippedCards = player.equippedCards;
                    $rootScope.$apply();
                },
                'updateOpponent': function(player) {
                    var index = service.opponents.findIndex(function(element) {
                        return element.name == player.name;
                    });
                    var opponent = service.opponents[index];
                    opponent.level = player.level;
                    opponent.combatPower = player.combatPower;
                    opponent.handSize = player.handSize;
                    opponent.equippedCards = player.equippedCards;
                    $rootScope.$apply();
                },
                'updateHand': function(hand) {
                    service.player.hand = hand;
                    $rootScope.$apply();
                },
                'updateOpponentHand': function(playerName, handSize) {
                    var index = service.opponents.findIndex(function(element) {
                        return element.name == playerName;
                    });
                    service.opponents[index].handSize = handSize;
                },
                'updateLevel': function(playerName, level) {
                    if (playerName == service.player.name) {
                        service.player.level = level;
                    } else {
                        var index = service.opponents.findIndex(function(element) {
                            return element.name == playerName;
                        });
                        service.opponents[index].level = level;
                    }
                    $rootScope.$apply();
                },
                'updateCombatState': function(combatState) {
                    service.game.combatState = combatState;
                    $rootScope.$apply();
                },
                'endCombatState': function() {
                    service.game.combatState = {};
                    $rootScope.$apply();
                },
                // maybe call specific method for action logging instead
                // front-end doesn't care about passed, just state change
                'proceeded': function(player) {
                    $rootScope.$broadcast('proceeded', player);
                }
            },

            //server side methods
            methods: ['createGame', 'joinGame', 'startGame', 'proceed', 'fight', 'run', 'pass', 'playCard', 'discard'],

            //handle connection error
            errorHandler: function(error) {
                console.error(error);
            },

            //specify a non default root
            rootPath: signalRUrl,
            logging: true,

            stateChanged: function(state) {
                switch (state.newState) {
                    case $.signalR.connectionState.connecting:
                        //your code here
                        break;
                    case $.signalR.connectionState.connected:
                        service.connected = true;
                        break;
                    case $.signalR.connectionState.reconnecting:
                        //your code here
                        break;
                    case $.signalR.connectionState.disconnected:
                        service.connected = false;
                        break;
                }
            }
        });

        function createGame(playerName) {
            hub.createGame(playerName);
            service.player.name = playerName;
            service.player.isHost = true;
        }

        function joinGame(playerName, gameId) {
            hub.joinGame(playerName, gameId);
            service.player.name = playerName;
        }

        function startGame() {
            hub.startGame(service.game.gameId);
        }

        function playCard(target, card) {
            if ((service.game.gameState == "CombatState" && card.type != "Equipment") || (service.game.gamestate != "CombatState" && card.type != "CombatSpell")) {
                hub.playCard(service.game.gameId, service.player.name, target.name, card.cardId);
            }
        }

        function discard(card) {
            hub.discard(service.game.gameId, service.player.name, card.cardId);
        }

        function proceed() {
            if (service.player.name == service.game.activePlayer) {
                // game state check
                if (service.game.gameState != "CombatState" ||
                    (service.game.combatState.passedPlayers.length == service.opponents.length && canPlayerWinCombat())) {
                    hub.proceed(service.game.gameId, service.player.name); //Calling a server method
                }
            }
        }

        function fight() {
            if (service.player.name == service.game.activePlayer && service.game.gameState == "DrawState") {
                hub.fight(service.game.gameId, service.player.name); //Calling a server method
            }
        }

        function run() {
            if (service.player.name == service.game.activePlayer && service.game.gameState == "CombatState") {
                hub.run(service.game.gameId, service.player.name); //Calling a server method
            }
        }

        function pass() {
            if (service.player.name != service.game.activePlayer && service.game.gameState == "CombatState") {
                hub.pass(service.game.gameId, service.player.name); //Calling a server method
            }
        }

        function canPlayerWinCombat() {
            var combatPower = 0;
            if (service.player.name == service.game.activePlayer) {
                combatPower = service.player.combatPower;
            } else {
                var index = service.opponents.findIndex(function(element) {
                    return element.name == service.game.activePlayer;
                });
                combatPower = service.opponents[index].combatPower;
            }

            if (combatPower + service.game.combatState.PlayerCombatBonus > service.game.combatState.monsterCombatPower + service.game.combatState.monsterCombatBonus) {

            }

            return true;
        }

        function getHeadgear() {
            var headgear = "";

            return headgear;
        }

        function getArmor() {
            var armor = "";

            return armor;
        }

        function getFootgear() {
            var footgear = "";

            return footgear;
        }

        return service;
    }
})();
