var app = angular.module('ActionRequiredApp', ['smart-table','ui.router']);

app.config(function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/ars_list.html');

    $stateProvider
        // HOME STATES AND NESTED VIEWS ========================================
        .state('home', {
            url: '/home',
            templateUrl: 'ars_list.html'
        })

        .state('meetings', {
            template: '<h1>Meetings<h1>'
        })

        .state('users', {
            templateUrl: 'users_list.html',
            controller: 'UsersCtrl'
        })
        .state('projects', {
            template: '<h1>Projects<h1>'
        })

});
