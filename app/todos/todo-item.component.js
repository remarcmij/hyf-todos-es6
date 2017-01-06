'use strict';
import angular from 'angular';

const template = require('./todo-item.component.html');

class TodoItemController {

    static get $inject() {
        return ['$mdDialog', '$state', 'backendService'];
    }

    constructor($mdDialog, $state, backendService) {
        this.$mdDialog = $mdDialog;
        this.$state = $state;
        this.backendService = backendService;
    }

    doneChanged() {
        this.backendService.updateTodo(this.todo);
    }

    editTodo(ev) {
        let confirm = this.$mdDialog.prompt()
            .title('Change todo')
            .textContent('Please update the description for todo.')
            .placeholder('todo text')
            .ariaLabel('Todo text')
            .initialValue(this.todo.text)
            .targetEvent(ev)
            .ok('Update')
            .cancel('Cancel');

        this.$mdDialog.show(confirm)
            .then(text => {
                text = text.trim();
                if (text && text !== this.todo.text) {
                    console.log('Updating todo: ' + text);
                    this.todo.text = text
                    this.backendService.updateTodo(this.todo)
                }
            })
            .catch(() => console.log('Change todo was cancelled'));
    }

    deleteTodo(ev) {
        this.onDelete({id: this.todo._id, ev: ev});
    }

    showUsers() {
        this.$state.go('todoUsers', {id: this.todo._id});
    }

}

angular.module('app')
    .component('hyfTodoItem', {
        template,
        bindings: {
            todo: '<',
            onDelete: '&'
        },
        controller: TodoItemController
    });

