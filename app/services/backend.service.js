'use strict';
import angular from 'angular';

class BackendService {

    static get $inject() {
        return ['$http'];
    }

    constructor($http) {
        this.$http = $http;
    }

    getTodos() {
        return this.$http.get('/todo')
            .then(resp => resp.data)
            .catch(err => this.handleFailure(err, this.getTodos));
    }

    addTodo(todo) {
        return this.$http.post('/todo', todo)
            .then(resp => resp.data)
            .catch(err => this.handleFailure(err, this.addTodo));
    }

    updateTodo(todo) {
        return this.$http.patch('/todo/' + todo._id, {text: todo.text, done: todo.done})
            .catch(err => this.handleFailure(err, this.updateTodo));
    }

    deleteTodo(id) {
        return this.$http.delete('/todo/' + id)
            .then(resp => resp.data)
            .catch(err => this.handleFailure(err, this.deleteTodo));
    }

    deleteAllTodos() {
        return this.$http.delete('/todo')
            .catch(err => this.handleFailure(err, this.deleteAllTodos));
    }

    getTodoById(id) {
        return this.$http.get('/todo/' + id)
            .then(resp => resp.data)
            .catch(err => this.handleFailure(err, this.getTodoById));
    }

    getUsers() {
        return this.$http.get('/user')
            .then(resp => resp.data)
            .catch(err => this.handleFailure(err, this.getUsers));
    }

    addUser(user) {
        return this.$http.post('/user', user)
            .then(resp => resp.data)
            .catch(err => this.handleFailure(err, this.addUser));
    }

    updateUser(user) {
        return this.$http.patch('/user/' + user._id, {name: user.name})
            .catch(err => this.handleFailure(err, this.updateUser));
    }

    deleteUser(id) {
        return this.$http.delete('/user/' + id)
            .then(resp => resp.data)
            .catch(err => this.handleFailure(err, this.deleteUser));
    }

    getUserById(id) {
        return this.$http.get('/user/' + id)
            .then(resp => resp.data)
            .catch(err => this.handleFailure(err, this.getUserById));
    }

    assignUserToTodo(userId, todoId) {
        return this.$http.put('/user/' + userId + '/' + todoId)
            .catch(err => this.handleFailure(err, this.assignUserToTodo));
    }

    unassignUserFromTodo(userId, todoId) {
        return this.$http.delete('/user/' + userId + '/' + todoId)
            .catch(err => this.handleFailure(err, this.unassignUserFromTodo));
    }

    handleFailure(e, caller) {
        let message = 'XHR Failed for ' + caller.name;
        if (e.data) {
            message = message + '\n' + e.data;
        }
        throw new Error(message);
    }
}

angular.module('app')
    .service('backendService', BackendService);

