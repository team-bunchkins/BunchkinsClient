(function() {
    'use strict';

    angular
        .module('app', ['SignalR', 'ui.router', 'toastr', 'swangular'])
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
            // allowHtml needs to be false to allow passing object for message
            allowHtml: false,
            closeButton: false,
            closeHtml: '<button>&times;</button>',
            extendedTimeOut: 2000,
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
            positionClass: 'toast-top-right',
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
