(function() {
    'use strict';

    angular
        .module('app', [
        	'ui.router'
        ])
        .value('apiUrl', 'http://localhost:88888/api')
        .config(appConfig);

    appConfig.$inject = ['$urlRouterProvider', '$stateProvider'];

    function appConfig($urlRouterProvider, $stateProvider) {

    	$urlRouterProvider.otherwise('/');
    }
})();