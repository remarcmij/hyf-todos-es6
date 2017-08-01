'use strict';
const mysql = require('mysql');

let connection;
let databaseOpened = false;

function openDatabase(dbname, password) {
    connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: password,
        database: dbname
    });
    return connectToDatabase()
        .then(() => createTables());
}

function connectToDatabase() {
    return new Promise((resolve, reject) => {
        connection.connect(err => {
            if (err) {
                console.log('Could not connect to MySQL database...');
                reject(err);
            } else {
                console.log('Connected to MySQL database...');
                databaseOpened = true;
                resolve();
            }
        });
    });
}

function createTables() {
    const createTodoTableSql =
        `CREATE TABLE IF NOT EXISTS todos (
            _id INTEGER PRIMARY KEY AUTO_INCREMENT,
            text VARCHAR(255) NOT NULL,
            done TINYINT NOT NULL
        )`;
    const createUserTableSql =
        `CREATE TABLE IF NOT EXISTS users (
            _id INTEGER PRIMARY KEY AUTO_INCREMENT,
            name VARCHAR(255) NOT NULL
        )`;
    const createLinkTableSql =
        `CREATE TABLE IF NOT EXISTS todo_user_links (
            todo_id INTEGER NOT NULL,
            user_id INTEGER NOT NULL,
            FOREIGN KEY(todo_id) REFERENCES todos(_id),
            FOREIGN KEY(user_id) REFERENCES users(_id)
        )`;

    return execQuery(createTodoTableSql)
        .then(() => execQuery(createUserTableSql))
        .then(() => execQuery(createLinkTableSql))
}

// Todo operations

function getTodos() {
    return execQuery('SELECT _id, text, done FROM todos ORDER BY _id')
        .then(results => {
            return results.map(todo => ({
                _id: todo._id,
                text: todo.text,
                done: todo.done !== 0
            }));
        });
}

function addTodo(todo) {
    return execQuery('INSERT INTO todos (text, done) VALUES(?,?)', [todo.text, todo.done ? 1 : 0])
        .then(result => result.insertId);
}

function updateTodo(id, todo) {
    return execQuery('UPDATE todos SET text=?, done=? WHERE _id=?', [todo.text, todo.done ? 1 : 0, id]);
}

function deleteTodo(id) {
    return execQuery('DELETE FROM todo_user_links WHERE todo_id=?', [id])
        .then(() => execQuery('DELETE FROM todos WHERE _id=?', [id]));
}

function deleteAllTodos() {
    return execQuery('DELETE FROM todo_user_links')
        .then(() => execQuery('DELETE FROM todos'));
}

function getTodoById(id) {
    const usersForTodoSql =
        `SELECT _id FROM users
         LEFT JOIN todo_user_links ON todo_user_links.user_id = users._id
         WHERE todo_user_links.todo_id=?`;

    return execQuery('SELECT _id, text, done FROM todos WHERE _id=?', [id])
        .then(todos => {
            if (todos.length < 1) {
                throw new Error('no todo found with id ' + id);
            }
            let todo = {
                _id: todos[0]._id,
                text: todos[0].text,
                done: todos[0].done !== 0
            };
            return execQuery(usersForTodoSql, [id])
                .then(users => {
                    todo.assignedUsers = users.map(user => user._id);
                    return todo;
                });
        });
}

// User operations

function getUsers() {
    return execQuery('SELECT _id, name FROM users ORDER BY name')
        .then(result => result.insertId);
}

function addUser(user) {
    return execQuery('INSERT INTO users (name) VALUES(?)', [user.name]);
}

function updateUser(id, user) {
    return execQuery('UPDATE users SET name=? WHERE _id=?', [user.name, id]);
}

function deleteUser(id) {
    return execQuery('DELETE FROM todo_user_links WHERE user_id=?', [id])
        .then(() => execQuery('DELETE FROM users WHERE _id=?', [id]));
}

function deleteAllUsers() {
    return execQuery('DELETE FROM todo_user_links')
        .then(() => execQuery('DELETE FROM users'));
}

function getUserById(id) {
    const todosForUserSql =
        `SELECT _id FROM todos
         LEFT JOIN todo_user_links ON todo_user_links.todo_id = todos._id
         WHERE todo_user_links.user_id=?`;

    return execQuery('SELECT _id, name FROM users WHERE _id=?', [id])
        .then(users => {
            if (users.length < 1) {
                throw new Error(`no todo found with id #${id}`);
            }
            let user = users[0];
            return execQuery(todosForUserSql, id)
                .then(todos => {
                    user.assignedTodos = todos.map(todo => todo._id);
                    return user;
                });
        });
}

function assignUserToTodo(userId, todoId) {
    return execQuery('SELECT COUNT(*) as count FROM todo_user_links WHERE user_id=? AND todo_id=?', [userId, todoId])
        .then(result => {
            if (result[0].count === 0) {
                return execQuery('INSERT INTO todo_user_links (user_id, todo_id) VALUES(?,?)', [userId, todoId]);
            }
        });
}

function unassignUserFromTodo(userId, todoId) {
    return execQuery('DELETE FROM todo_user_links WHERE user_id=? AND todo_id=?', [userId, todoId]);
}

function execQuery(sql, args = []) {
    return new Promise((resolve, reject) => {
        connection.query(sql, args, (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
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
}