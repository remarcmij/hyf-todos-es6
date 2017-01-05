import angular from 'angular';

const template = require('./user-todos.component.html');

class UserTodosController {

    static get $inject() {
        return ['$stateParams', 'backendService'];
    }

    constructor($stateParams, backendService) {
        this.$stateParams = $stateParams;
        this.backendService = backendService;
    }

}

angular.module('app')
    .component('hyfUserTodos', {
        template,
        bindings: {
            user: '<'
        },
        controller: UserTodosController
    });


