'use strict';
const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
chai.use(chaiHttp);

const apiEndPoint = 'http://localhost:8080';

describe('todo tests', () => {

    let _id;

    beforeEach(done => {
        // delete all todos and than add 2 todos
        chai.request(apiEndPoint)
            .delete('/todo')
            .then(() => {
                return chai.request(apiEndPoint)
                    .post('/todo')
                    .send({text: 'Go to the opera', done: 0})
            })
            .then(res => {
                expectTodoListResponse(res, 1);
                _id = res.body.todos[0]._id;
                return chai.request(apiEndPoint)
                    .post('/todo')
                    .send({text: 'Go to the theater', done: 1})
            })
            .then(res => {
                expectTodoListResponse(res, 2);
                done();
            })
            .catch(err => {

            });
    });

    it('should retrieve the todo list', done => {
        chai.request(apiEndPoint)
            .get('/todo')
            .end((err, res) => {
                expect(err).to.be.null;
                expectTodoListResponse(res, 2);
                expect(res.body.todos[0]).to.have.property('_id').equal(_id);
                expect(res.body.todos[0]).to.have.property('text').equal('Go to the opera');
                expect(res.body.todos[0]).to.have.property('done').equal(0);
                done();
            });
    });

    it('should add a todo', done => {
        chai.request(apiEndPoint)
            .post('/todo')
            .send({text: 'Go to the movies', done: 0})
            .end((err, res) => {
                expect(err).to.be.null;
                expectTodoListResponse(res, 3);
                done();
            });
    });

    it('should update a todo', done => {
        chai.request(apiEndPoint)
            .put('/todo/' + _id)
            .send({text: 'Go to the movies', done: 1})
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.status(200);
                chai.request(apiEndPoint)
                    .get('/todo')
                    .end((err, res) => {
                        expectTodoListResponse(res, 2);
                        expect(res.body.todos[0]).to.have.property('_id').equal(_id);
                        expect(res.body.todos[0]).to.have.property('text').equal('Go to the movies');
                        expect(res.body.todos[0]).to.have.property('done').equal(1);
                        done();
                    });
            });
    });

    it('should delete a todo', done => {
        chai.request(apiEndPoint)
            .delete('/todo/' + _id)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.status(200);
                expectTodoListResponse(res, 1);
                done();
            });
    });
});

describe('user tests', () => {

    let _id;

    beforeEach(done => {
        // delete all users and than add 2 users
        chai.request(apiEndPoint)
            .delete('/user')
            .then(() => chai.request(apiEndPoint)
                .post('/user')
                .send({name: 'James Brown'}))
            .then(res => {
                _id = res.body.users[0]._id;
                return chai.request(apiEndPoint)
                    .post('/user')
                    .send({name: 'Aretha Franklin'})
            })
            .then(() => done());
    });

    it('should retrieve the user list', done => {
        chai.request(apiEndPoint)
            .get('/user')
            .end((err, res) => {
                expect(err).to.be.null;
                expectUserListResponse(res, 2);
                expect(res.body.users[0]).to.have.property('_id').equal(_id);
                expect(res.body.users[0]).to.have.property('name').equal('James Brown');
                done();
            });
    });

    it('should add a user', done => {
        chai.request(apiEndPoint)
            .post('/user')
            .send({name: 'Wilson Picket'})
            .end((err, res) => {
                expect(err).to.be.null;
                expectUserListResponse(res, 3);
                done();
            });
    });

    it('should update a user', done => {
        chai.request(apiEndPoint)
            .put('/user/' + _id)
            .send({name: 'Jim Brown'})
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.status(200);
                chai.request(apiEndPoint)
                    .get('/user')
                    .end((err, res) => {
                        expectUserListResponse(res, 2);
                        expect(res.body.users[0]).to.have.property('_id').equal(_id);
                        expect(res.body.users[0]).to.have.property('name').equal('Jim Brown');
                        done();
                    });
            });
    });

    it('should delete a user', done => {
        chai.request(apiEndPoint)
            .delete('/user/' + _id)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.status(200);
                expectUserListResponse(res, 1);
                done();
            });
    });
});

describe('assignment tests', () => {

    let todo_id;
    let user_id;

    beforeEach(done => {
        // delete all users and than add 2 users
        chai.request(apiEndPoint)
            .delete('/todo')
            .then(() => {
                return chai.request(apiEndPoint)
                    .post('/todo')
                    .send({text: 'Go to the movies', done: 0})
                    .then(res => {
                        todo_id = res.body.todos[0]._id;
                    });
            })
            .then(() => chai.request(apiEndPoint)
                .delete('/user'))
            .then(() => {
                return chai.request(apiEndPoint)
                    .post('/user')
                    .send({name: 'James Brown'})
                    .then(res => {
                        user_id = res.body.users[0]._id;
                    });
            })
            .then(() => done());
    });

    it('should assign and unassign a user to/from a todo', done => {
        chai.request(apiEndPoint)
            .put(`/user/${user_id}/${todo_id}`)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.status(200);

                chai.request(apiEndPoint)
                    .delete(`/user/${user_id}/${todo_id}`)
                    .end((err, res) => {
                        expect(err).to.be.null;
                        expect(res).to.have.status(200);
                        done();
                    });
            });
    });
});

function expectTodoListResponse(res, len) {
    expect(res).to.have.status(200);
    expect(res).to.be.json;
    expect(res.body.todos).to.be.an('array');
    expect(res.body.todos.length).to.equal(len);
    expect(res.body.todos[0]).to.have.property('_id');
}

function expectUserListResponse(res, len) {
    expect(res).to.have.status(200);
    expect(res).to.be.json;
    expect(res.body.users).to.be.an('array');
    expect(res.body.users.length).to.equal(len);
    expect(res.body.users[0]).to.have.property('_id');
}