'use strict';
const assert = require('assert');
const mongo = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID
let mongoUrl;

let linkCollection;
let todoCollection;
let userCollection;

function openDatabase(dbname) {
    mongoUrl = 'mongodb://localhost:27017/' + dbname;

    return mongo.connect(mongoUrl)
        .then(db => {
            todoCollection = db.collection('todos');
            userCollection = db.collection('users');
            linkCollection = db.collection('links');
            console.log('Connected to Mongo database...');
        })
        .catch(err => {
            console.log('Could not connect to Mongo database');
            throw err;
        });
}

function getTodos() {
    return todoCollection.find().toArray();
}

function addTodo(todo) {
    return todoCollection.insertOne(todo)
        .then(result => result.insertedId);
}

function updateTodo(id, todo) {
    return hexStringToObjectID(id)
        .then(objectID => {
            let todoUpdate = {$set: {text: todo.text, done: todo.done}};
            return todoCollection.findOneAndUpdate({_id: objectID}, todoUpdate);
        });
}

function deleteTodo(id) {
    return hexStringToObjectID(id)
        .then(objectID => {
            return linkCollection.deleteMany({todo_id: objectID})
                .then(() => todoCollection.deleteOne({_id: objectID}));
        });
}

function deleteAllTodos() {
    return linkCollection.deleteMany({})
        .then(() => todoCollection.deleteMany({}));
}

function getTodoById(id) {
    return hexStringToObjectID(id)
        .then(objectID => {
            return todoCollection.find({_id: objectID}).toArray()
                .then(todos => {
                    if (todos.length === 0) {
                        throw new Error('no todo found with id ' + id);
                    }
                    let todo = todos[0];
                    return linkCollection.find({todo_id: objectID}).toArray()
                        .then(links => {
                            todo.assignedUsers = links.map(link => link.user_id);
                            return todo;
                        });
                });
        });
}

function getUsers() {
    return userCollection.find().toArray();
}

function addUser(user) {
    return userCollection.insertOne(user)
        .then(result => result.insertedId);
}

function updateUser(id, user) {
    return hexStringToObjectID(id)
        .then(objectID => {
            let userUpdate = {$set: {name: user.name}};
            return userCollection.findOneAndUpdate({_id: objectID}, userUpdate);
        });
}

function deleteUser(id) {
    return hexStringToObjectID(id)
        .then(objectID => {
            return linkCollection.deleteMany({user_id: objectID})
                .then(() => userCollection.deleteOne({_id: objectID}));
        });
}

function deleteAllUsers() {
    return linkCollection.deleteMany({})
        .then(() => userCollection.deleteMany({}));
}

function getUserById(id) {
    return hexStringToObjectID(id)
        .then(objectID => {
            return userCollection.find({_id: objectID}).toArray()
                .then(users => {
                    if (users.length === 0) {
                        throw new Error('no user found with id ' + id);
                    }
                    let user = users[0];
                    return linkCollection.find({user_id: objectID}).toArray()
                        .then(links => {
                            user.assignedTodos = links.map(link => link.todo_id);
                            return user;
                        });
                })
        });
}

function assignUserToTodo(userId, todoId) {
    return hexStringToObjectID(userId)
        .then(userObjectID => {
            return hexStringToObjectID(todoId)
                .then(todoObjectID => {
                    return linkCollection.find({user_id: userObjectID, todo_id: todoObjectID}).toArray()
                        .then(links => {
                            if (links.length === 0) {
                                return linkCollection.insertOne({user_id: userObjectID, todo_id: todoObjectID});
                            }
                        });
                });
        });
}

function unassignUserFromTodo(userId, todoId) {
    return hexStringToObjectID(userId)
        .then(userObjectID => {
            return hexStringToObjectID(todoId)
                .then(todoObjectID => linkCollection.deleteMany({user_id: userObjectID, todo_id: todoObjectID}));
        });
}

function hexStringToObjectID(hexString) {
    return new Promise((resolve, reject) => {
        try {
            resolve(new ObjectID(hexString));
        } catch (err) {
            reject(err);
        }
    });
}

module.exports = {
    openDatabase,
    getTodos,
    addTodo,
    updateTodo,
    deleteTodo,
    deleteAllTodos,
    getTodoById,
    getUsers,
    addUser,
    updateUser,
    deleteUser,
    deleteAllUsers,
    getUserById,
    assignUserToTodo,
    unassignUserFromTodo
};
