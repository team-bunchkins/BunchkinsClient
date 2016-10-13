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
                connected: '',
                gameId: '',
                gameState: ''
            },
            player: {
                name: '',
                level: 0,
                hand: [],
                equippedCards: []
            },
            opponents: [],
            createGame: createGame,
            joinGame: joinGame,
            startGame: startGame,
            playCard: playCard,
            proceed: proceed,
            fight: fight,
            run: run,
            pass: pass
        };

        var hub = new Hub('bunchkinsHub', {
            //client side methods
            listeners: {
                'callerJoined': function(gameId, players) {
                    service.game.gameId = gameId;
                    // append to original opponents object to preserve bindings
                    if (players) {
                        players.forEach(function(element){
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
                    $rootScope.$broadcast('stateChanged', service.game.gameState);
                },
                'updateHand': function(hand) {
                    service.player.hand = hand;
                    $rootScope.$apply();
                },
                'updateOpponentHand': function(playerName, hand) {
                    service.player.hand = hand;
                    $rootScope.$apply();
                },
                'updateEquips': function(playerName, equips) {
                    if (playerName == service.player.name) {
                        service.player.equips = equips;
                    } else {
                        var index = service.opponents.findIndex(function(element) {
                            return element.name == playerName;
                        });
                        service.opponents[index].equips = equips;
                    }
                    $rootScope.$apply();
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
            service.player.IsActive = true;
        }

        function joinGame(playerName, gameId) {
            hub.joinGame(playerName, gameId);
        }

        function startGame() {
            hub.startGame(service.game.gameId);
        }

        function playCard(target, card) {
            hub.playCard(service.gameId, service.player.playerName, target.playerName, card);
        }

        function discard(card) {
            hub.discard(service.gameId, service.player.playerName, card);
        }

        function proceed() {
            hub.proceed(service.gameId, service.player.name); //Calling a server method
        }

        function fight() {
            hub.fight(service.gameId, service.player.name); //Calling a server method
        }

        function run() {
            hub.run(service.gameId, service.player.name); //Calling a server method
        }

        function pass() {
            hub.pass(service.gameId, service.player.name); //Calling a server method
        }

        return service;
    }
})();
