import angular from 'angular';

const template = require('./user-item.component.html');

class UserItemController {

    static get $inject() {
        return ['$mdDialog', '$state', 'backendService'];
    }

    constructor ($mdDialog, $state, backendService) {
        this.$mdDialog = $mdDialog;
        this.$state = $state;
        this.backendService = backendService;
    }

    editUser(ev) {
        let prompt = this.$mdDialog.prompt()
            .title('Change user name')
            // .textContent('Please enter the user\'s name')
            .placeholder('name')
            .ariaLabel('User name')
            .initialValue(this.user.name)
            .targetEvent(ev)
            .ok('Update')
            .cancel('Cancel');

        this.$mdDialog.show(prompt)
            .then(name => {
                name = name.trim();
                if (name && name !== this.user.name) {
                    console.log('Updating user name: ' + name);
                    this.user.name = name
                    this.backendService.updateUser(this.user)
                }
            })
            .catch(() => console.log('Change user name was cancelled'));
    }

    deleteUser(ev) {
        this.onDelete({id: this.user._id, ev: ev});
    }

    showTodos() {
        this.$state.go('userTodos', {id: this.user._id});
    }
}

angular.module('app')
    .component('hyfUserItem', {
        template,
        bindings: {
            user: '<',
            onDelete: '&'
        },
        controller: UserItemController
    });


