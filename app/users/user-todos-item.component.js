'use strict';
import angular from 'angular';

const template = require('./user-todos-item.component.html');

class UserTodosItemController {

    static get $inject() {
        return ['$window', 'backendService'];
    }

    constructor($window, backendService) {
        this.$window = $window;
        this.backendService = backendService;
        this.assigned = false;
    }

    $onInit() {
        this.assigned = this.user.assignedTodos.indexOf(this.todo._id) !== -1;
    }

    toggleAssignment() {
        this.assigned = !this.assigned;
        let promise;
        if (this.assigned) {
            promise = this.backendService.assignUserToTodo(this.user._id, this.todo._id);
        } else {
            promise = this.backendService.unassignUserFromTodo(this.user._id, this.todo._id);
        }
        promise.catch(err => this.$window.alert(err.message));
    }
}

angular.module('app')
    .component('hyfUserTodosItem', {
        template,
        controller: UserTodosItemController,
        bindings: {
            user: '<',
            todo: '<'
        }
    });
