(function() {
    'use strict';

    angular
        .module('app', ['SignalR', 'ui.router'])
        .value('signalRUrl', 'http://localhost:59887/signalr')
        .config(appConfig);

    appConfig.$inject = ['$urlRouterProvider', '$stateProvider'];

    function appConfig($urlRouterProvider, $stateProvider) {

    	$urlRouterProvider.otherwise('lobby');

        $stateProvider.state('lobby', {
            url: '/lobby',
            controller: 'LobbyController as lobby',
            templateUrl: 'app/lobby/lobby.html'
        })
        .state('game', {
            url: '/game',
            controller: 'GameController as gameCtrl',
            templateUrl: 'app/game/game.html'
        });
    }
})();
