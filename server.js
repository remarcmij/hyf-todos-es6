'use strict';
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const PORT = 8080;

let app = null;
let dbname = null;
let database = null;

setupDatabase();
setupExpress();
setupApiEndPointRoutes();
setupStaticRoutes();
startServer();

function setupDatabase() {
    let dbtype;
    let password = null;

    let argLen = process.argv.length;

    if (argLen >= 3 && process.argv[2] === 'mongo') {
        dbtype = 'mongo';
        dbname = (argLen >= 4 && process.argv[3] === 'test') ? 'hyf-todos-test' : 'hyf-todos';
    } else if (argLen >= 4 && process.argv[2] === 'mysql') {
        dbtype = 'mysql';
        password = process.argv[3];
        dbname = (argLen >= 5 && process.argv[4] === 'test') ? 'hyf-todos-test' : 'hyf-todos';
    } else {
        console.log('to run, type: node database.js mongo [test]| mysql <password> [test]');
        process.exit();
    }

    switch (dbtype) {
        case 'mongo':
            database = require('./database/mongo.database.js');
            break;
        case 'mysql':
            database = require('./database/mysql.database.js');
            break;
        default:
            console.error('unsupported database type: ' + dbtype);
            process.exit(1);
    }

    database.openDatabase(dbname, password)
        .catch((err) => {
            console.log(err);
            process.exit();
        });
}

function setupExpress() {
    app = express();
    app.use(bodyParser.json());
}

function setupApiEndPointRoutes() {
    app.get('/todo/:id', getTodoById);
    app.get('/todo', getTodos);
    app.post('/todo', addTodo);
    app.patch('/todo/:id', updateTodo);
    app.delete('/todo/:id', deleteTodo);
    app.delete('/todo', deleteAllTodos);

    app.get('/user/:id', getUserById);
    app.get('/user', getUsers);
    app.post('/user', addUser);
    app.patch('/user/:id', updateUser);
    app.delete('/user/:id', deleteUser);
    app.delete('/user', deleteAllUsers);

    app.put('/user/:id/:todo_id', assignTodoToUser);
    app.delete('/user/:id/:todo_id', unassignTodoFromUser);
}

function setupStaticRoutes() {
    app.get('/', sendIndexHtml);
    app.use(express.static(__dirname));
    app.use(express.static(path.join(__dirname, 'build')));
}

function startServer() {
    app.listen(PORT, (err) => {
        if (err) {
            console.log('could no start server: ', err);
            process.exit(1);
        }
        console.log('server listening at port ' + PORT);
    });
}

// Request handlers

function sendIndexHtml(req, res) {
    res.sendFile('./index.html', {root: __dirname});
}

function getTodos(req, res) {
    database.getTodos()
        .then(todos => res.json({todos}))
        .catch(err => res.status(400).json(err));
}

function getTodoById(req, res) {
    if (!req.params.id) {
        res.status(400).send('id parameter is required');
        return;
    }
    database.getTodoById(req.params.id)
        .then(todo => {
            return database.getUsers()
                .then(users => {
                    todo.allUsers = users;
                    res.json(todo);
                });
        })
        .catch(err => res.status(400).json(err));
}

function addTodo(req, res) {
    let todo = req.body;
    if (!todo.text) {
        res.status(400).send('no text specified');
        return;
    }
    database.addTodo(todo)
        .then(() => database.getTodos())
        .then(todos => res.json({todos}))
        .catch(err => res.status(400).send(err.message));
}

function deleteTodo(req, res) {
    if (!req.params.id) {
        res.status(400).send('id parameter is required');
        return;
    }
    database.deleteTodo(req.params.id)
        .then(() => database.getTodos())
        .then(todos => res.json({todos}))
        .catch(err => res.status(400).send(err.message));
}

function updateTodo(req, res) {
    if (!req.params.id) {
        res.status(400).send('id parameter is required');
        return;
    }

    let todo = req.body;
    if (!todo.text) {
        res.status(400).send('no text specified');
        return;
    }

    database.updateTodo(req.params.id, todo)
        .then(() => res.sendStatus(204))
        .catch(err => res.status(400).send(err.message));
}

function deleteAllTodos(req, res) {
    database.deleteAllTodos()
        .then(() => res.sendStatus(204))
        .catch(err => res.status(400).send(err.message));
}

function getUsers(req, res) {
    database.getUsers()
        .then(users => res.json({users}))
        .catch(err => res.status(400).json(err));
}

function getUserById(req, res) {
    if (!req.params.id) {
        res.status(400).send('id parameter is required');
        return;
    }
    database.getUserById(req.params.id)
        .then(user => {
            return database.getTodos()
                .then(todos => {
                    user.allTodos = todos;
                    res.json(user);
                });
        })
        .catch(err => res.status(400).json(err));
}

function addUser(req, res) {
    let user = req.body;
    if (!user.name) {
        res.status(400).send('no name specified');
        return;
    }
    database.addUser(user)
        .then(() => database.getUsers())
        .then(users => res.json({users}))
        .catch(err => res.status(400).send(err.message));
}

function deleteUser(req, res) {
    if (!req.params.id) {
        res.status(400).send('id parameter is required');
        return;
    }
    database.deleteUser(req.params.id)
        .then(() => database.getUsers())
        .then(users => res.json({users}))
        .catch(err => res.status(400).send(err.message));
}

function updateUser(req, res) {
    if (!req.params.id) {
        res.status(400).send('id parameter is required');
        return;
    }
    let user = req.body;
    if (!user.name) {
        res.status(400).send('no name specified');
        return;
    }
    database.updateUser(req.params.id, user)
        .then(() => res.sendStatus(204))
        .catch(err => res.status(400).send(err.message));
}

function deleteAllUsers(req, res) {
    database.deleteAllUsers()
        .then(() => res.sendStatus(204))
        .catch(err => res.status(400).send(err.message));
}

function assignTodoToUser(req, res) {
    if (!req.params.id) {
        res.status(400).send('id parameter is required');
        return;
    }
    if (!req.params.todo_id) {
        res.status(400).send('todo_id parameter is required');
        return;
    }
    database.assignUserToTodo(req.params.id, req.params.todo_id)
        .then(user => res.json(user))
        .catch(err => res.status(400).json(err));
}

function unassignTodoFromUser(req, res) {
    if (!req.params.id) {
        res.status(400).send('id parameter is required');
        return;
    }
    if (!req.params.todo_id) {
        res.status(400).send('todo_id parameter is required');
        return;
    }
    database.unassignUserFromTodo(req.params.id, req.params.todo_id)
        .then(user => res.json(user))
        .catch(err => res.status(400).json(err));
}

module.exports = {
    dbname: dbname
}