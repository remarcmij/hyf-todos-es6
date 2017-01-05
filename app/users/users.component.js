import angular from 'angular';

const template = require('./users.component.html');

class UsersController {

    static get $inject() {
        return ['$rootScope', '$mdDialog', '$window', 'backendService'];
    }

    constructor($rootScope, $mdDialog, $window, backendService) {
        this.$rootScope = $rootScope;
        this.$mdDialog = $mdDialog;
        this.$window = $window;
        this.backendService = backendService;
        this.deregisterFn = null;
    }

    // listen for an addUser event, emitted by the toolbar of the home component
    $onInit() {
        this.deregisterFn = this.$rootScope.$on('addUser',
            (broadcastEvent, mouseEvent) => this.addUser(mouseEvent));

        this.backendService.getUsers()
            .then(data => this.users = data.users)
            .catch(err => this.$window.alert(err.message));
    }

    $onDestroy() {
        this.deregisterFn();
    }

    addUser(ev) {
        // Appending dialog to document.body to cover sidenav in docs app
        let prompt = this.$mdDialog.prompt()
            .title('Add new user')
            .textContent('Please enter the name of the new user.')
            .placeholder('name')
            .ariaLabel('User name')
            .initialValue('')
            .targetEvent(ev)
            .ok('Add')
            .cancel('Cancel');
        this.$mdDialog.show(prompt)
            .then(name => this.backendService.addUser({name: name}))
            .then(data => this.users = data.users)
            .catch(() => console.log('Add new user was cancelled'));
    }

    onDelete(id, ev) {
        this.backendService.getUserById(id)
            .then(user => {
                let todosCount = user.assignedTodos.length
                let message;
                if (todosCount === 0) {
                    message = `${user.name}  has NO assigned todos.`;
                } else if (todosCount === 1) {
                    message = `${user.name}  has 1 assigned todo.`;
                } else {
                    message = `${user.name}  has ${todosCount} assigned todos.`;
                }
                let confirm = this.$mdDialog.confirm()
                    .title('Delete user?')
                    .textContent(message)
                    .ariaLabel('Confirm delete user')
                    .targetEvent(ev)
                    .ok('Delete')
                    .cancel('Cancel');
                return this.$mdDialog.show(confirm)
                    .then(() => this.backendService.deleteUser(user._id))
                    .then(data => this.users = data.users)
                    .catch(() => console.log('Delete user was cancelled'));
            })
            .catch(err => this.$window.alert(err.message));
    }
}

angular.module('app')
    .component('hyfUsers', {
        template,
        controller: UsersController
    });