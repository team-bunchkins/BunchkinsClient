(function() {
    'use strict';

    angular
        .module('app', ['SignalR', 'ui.router'])
        .value('signalRUrl', 'http://localhost:59887/signalr')
        .config(appConfig);

    appConfig.$inject = ['$urlRouterProvider', '$stateProvider'];

    function appConfig($urlRouterProvider, $stateProvider) {

    	$urlRouterProvider.otherwise('/');
    }
})();
