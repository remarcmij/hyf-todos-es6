import angular from 'angular';

const template = require('./todo-users.component.html');

class TodoUsersController {

    static get $inject() {
        return ['$stateParams', 'backendService'];
    }

    constructor($stateParams, backendService) {
        this.$stateParams = $stateParams;
        this.backendService = backendService;
    }

}

angular.module('app')
    .component('hyfTodoUsers', {
        template,
        bindings: {
            todo: '<'
        },
        controller: TodoUsersController
    });


