'use strict';
import angular from 'angular';

const template = require('./unassigned-users.component.html');

class UnassignedUsersController {

    static get $inject() {
        return ['backendService'];
    }

    constructor(backendService) {
        this.backendService = backendService;
    }

    $onInit() {
        this.backendService.getUsers()
            .then(data => this.users = data.users.filter(user => todo.assignedUsers.indexOf(user._id) === -1))
            .catch(err => this.$window.alert(err.message));
    }

    onSelect() {

    }
}

angular.module('app')
    .component('hyfUnassignedUsers', {
        template,
        controller: UnassignedUsersController,
        bindings: {
            todo: '<'
        }
    });