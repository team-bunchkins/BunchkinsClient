(function() {
    'use strict';

    angular
        .module('app')
        .factory('bunchkinsFactory', bunchkinsFactory);

    bunchkinsFactory.$inject = ['$rootScope', 'Hub', '$timeout'];

    /* @ngInject */
    function bunchkinsFactory($rootScope, Hub, $timeout) {

        var service = {
            connected: '',
            gameId: '',
            gameState: '',
            player: {
                hand: [],
                equips: []
            },
            opponents: [],
            createGame: createGame,
            joinGame: joinGame,
            pass: pass
        };

        var hub = new Hub('bunchkinsHub', {
            //client side methods
            listeners: {
                'callerJoined': function(gameId, players) {
                    service.gameId = gameId;
                    service.opponents.concat(players);
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
            //can maybe change to $rootScope.$broadcast so only specific controllers are notified
            //controllers would have to have their own copy of object :/
            //Ex.
            /*
            'joined': function (player) {
                service.players.push(player);
                $rootScope.$broadcast('joined', player);
            },
            */

            //server side methods
            methods: ['createGame', 'joinGame', 'startGame', 'pass'],

            //handle connection error
            errorHandler: function(error) {
                console.error(error);
            },

            //specify a non default root
            rootPath: 'http://localhost:59887/signalr',
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
        }

        function pass() {
            hub.pass(service.gameId, service.player.name); //Calling a server method
        }

        return service;
    }
})();
