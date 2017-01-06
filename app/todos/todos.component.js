'use strict';
import angular from 'angular';

const template = require('./todos.component.html');

class TodosController {

    static get $inject() {
        return ['$rootScope', '$mdDialog', '$q', '$window', 'backendService'];
    }

    constructor($rootScope, $mdDialog, $q, $window, backendService) {
        this.$rootScope = $rootScope;
        this.$mdDialog = $mdDialog;
        this.$q = $q;
        this.$window = $window;
        this.backendService = backendService;
        this.deregisterFn = null;
    }

    // listen for an addUser event, emitted by the toolbar of the home component
    $onInit() {
        this.deregisterFn = this.$rootScope.$on('addTodo',
            (broadcastEvent, mouseEvent) => this.addTodo(mouseEvent));

        this.backendService.getTodos()
            .then(data => this.todos = data.todos)
            .catch(err => this.$window.alert(err.message));
    }

    $onDestroy() {
        this.deregisterFn();
    }

    addTodo(ev) {
        // Appending dialog to document.body to cover sidenav in docs app
        let prompt = this.$mdDialog.prompt()
            .title('Add new todo')
            .textContent('Please enter a description for the new todo.')
            .placeholder('description')
            .ariaLabel('Todo description')
            .initialValue('')
            .targetEvent(ev)
            .ok('Add')
            .cancel('Cancel');
        this.$mdDialog.show(prompt)
            .then(text => this.backendService.addTodo({text: text, done: false}))
            .then(data => this.todos = data.todos)
            .catch(() => console.log('Add new todo was cancelled'));
    }

    onDelete(id, ev) {
        this.backendService.getTodoById(id)
            .then(todo => {
                let userCount = todo.assignedUsers.length
                let message;
                if (userCount === 0) {
                    message = `'${todo.text}' is assigned to nobody.`;
                } else if (userCount === 1) {
                    message = `'${todo.text}' is assigned to 1 user.`;
                } else {
                    message = `'${todo.text}' is assigned to ${userCount} users.`;
                }
                let confirm = this.$mdDialog.confirm()
                    .title('Delete todo?')
                    .textContent(message)
                    .ariaLabel('Confirm delete todo')
                    .targetEvent(ev)
                    .ok('Delete')
                    .cancel('Cancel');
                return this.$mdDialog.show(confirm)
                    .then(() => this.backendService.deleteTodo(todo._id))
                    .then(data => this.todos = data.todos)
                    .catch(() => {
                        console.log('Delete todo was cancelled');
                        return this.$q.resolve();
                    });
            })
            .catch(err => this.$window.alert(err.message));
    }
}

angular.module('app')
    .component('hyfTodos', {
        template,
        controller: TodosController
    });
