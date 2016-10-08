(function() {
    'use strict';

    angular
        .module('app')
        .factory('bunchkinsFactory', bunchkinsFactory);

    bunchkinsFactory.$inject = ['$rootScope', 'Hub', '$timeout', 'signalRUrl'];

    /* @ngInject */
    function bunchkinsFactory($rootScope, Hub, $timeout, signalRUrl) {

        var service = this;

        service.game = {
            connected: '',
            gameId: '',
            gameState: ''
        };
        service.player = {
            Name: '',
            Hand: [],
            Equips: []
        };
        service.opponents = [];
        service.createGame = createGame;
        service.joinGame = joinGame;
        service.pass = pass;

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
                    // TODO: camelCasing!
                    console.log(player.Name + " joined");
                    $rootScope.$apply();
                },
                'displayError': function(errorString) {
                    console.log(errorString);
                    //toastr?
                    //$rootScope.$apply();
                },
                // maybe call specific method for action logging instead
                // front-end doesn't care about passed, just state change
                'passed': function(player) {
                    $rootScope.$broadcast('passed', player);
                }
            },

            //server side methods
            methods: ['createGame', 'joinGame', 'startGame', 'pass'],

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
        }

        function joinGame(playerName, gameId) {
            hub.joinGame(playerName, gameId);
            service.game.gameId = gameId;
        }

        function pass() {
            hub.pass(service.gameId, service.player.name); //Calling a server method
        }

        return service;
    }
})();
