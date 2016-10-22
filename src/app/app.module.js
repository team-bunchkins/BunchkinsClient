(function() {
    'use strict';

    angular
        .module('app', ['SignalR', 'ui.router', 'toastr'])
        .value('signalRUrl', 'http://localhost:59887/signalr')
        .config(appConfig);

    appConfig.$inject = ['$urlRouterProvider', '$stateProvider', 'toastrConfig'];

    function appConfig($urlRouterProvider, $stateProvider, toastrConfig) {

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
        })
        .state('win', {
          url: '/win',
          controller: 'WinController as winCtrl',
          templateUrl: 'app/game/win.html',
          params: {
            player: null
          }
        });

        angular.extend(toastrConfig, {
            allowHtml: true,
            closeButton: false,
            closeHtml: '<button>&times;</button>',
            extendedTimeOut: 1000,
            iconClasses: {
                error: 'toast-error',
                info: 'toast-info',
                success: 'toast-success',
                warning: 'toast-warning'
            },
            messageClass: 'toast-message',
            onHidden: null,
            onShown: null,
            onTap: null,
            progressBar: false,
            tapToDismiss: true,
            templates: {
                toast: 'directives/toast/toast.html',
                progressbar: 'directives/progressbar/progressbar.html'
            },
            timeOut: 5000,
            titleClass: 'toast-title',
            toastClass: 'toast'
        });
    }
})();
