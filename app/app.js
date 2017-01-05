import angular from 'angular';

import './app.module';
import './home/home.component';
import './todos/todos.routing';
import './users/users.routing';
import './services/backend.service';

angular.module('app')
    .config(routing);

routing.$inject = ['$urlRouterProvider', '$stateProvider'];

function routing($urlRouterProvider, $stateProvider) {
    $urlRouterProvider.otherwise('/');

    $stateProvider
        .state('home', {
            url: '/?tab',
            component: 'hyfHome'
        });
}
