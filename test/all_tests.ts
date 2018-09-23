import * as chai from "chai"
import chaiHttp = require('chai-http');
import mocha = require('mocha');

let server = require('../dist/app');
import { userSchemaModel } from "../dist/models/user";
import { userData } from "./data/user";
let expect = chai.expect;
let should = chai.should;

chai.use(chaiHttp);

//Clean
userSchemaModel.deleteMany({}).exec((data) => { });

let errorConvert = (err) => {
    let text = JSON.parse(err.response.error.text);
    return text;
}

let user_id, token;

describe('User', () => {
    it('create new user should fail', (done) => {
        chai.request(server)
            .post('/user')
            .send()
            .end(function(err, res) {
                let error = errorConvert(err);
                expect(error.isError).to.be.true;
                expect(err).to.have.status(400);
                done();
            });
    });
    it('create new user', (done) => {
        chai.request(server)
            .post('/user')
            .send(userData)
            .end(function(err, res) {
                expect(res.body.result).to.be.equal('OK');
                expect(res.body.isError).to.be.false;
                expect(res).to.have.status(200);
                user_id = res.body.id;
                done();
            });
    });
    it('get user public info', (done) => {
        chai.request(server)
            .get('/user/' + user_id)
            .end(function(err, res) {
                expect(res.body.result.firstName).to.be.equal(userData.firstName);
                expect(res.body.isError).to.be.false;
                expect(res).to.have.status(200);
                done();
            });
    });
    it('auth', (done) => {
        chai.request(server)
            .post('/user/auth')
            .send({ login: userData.login, password: userData.password })
            .end(function(err, res) {
                should(res.body.token).not.empty;
                expect(res.body.isError).to.be.false;
                expect(res).to.have.status(200);
                token = res.body.token;
                done();
            });
    });
    it('update with auth token', (done) => {
        let test_user = JSON.parse(JSON.stringify(userData));
        test_user.firstName = "testNameInTestCase";
        chai.request(server)
            .put('/user')
            .send(test_user)
            .set('Authorization', 'Bearer ' + token)
            .end(function(err, res) {
                should(res.body.result).not.empty;
                expect(res.body.result.firstName).to.be.equal(test_user.firstName);
                expect(res.body.isError).to.be.false;
                expect(res).to.have.status(200);
                done();
            });
    });

    it('delete with auth token and password', (done) => {
        chai.request(server)
            .delete('/user')
            .send({ password: userData.password })
            .set('Authorization', 'Bearer ' + token)
            .end(function(err, res) {
                expect(res.body.result).to.be.true;
                expect(res.body.isError).to.be.false;
                expect(res).to.have.status(200);
                done();
            });
    });
    it('logout', (done) => {
        chai.request(server)
            .get('/user/logout')
            .set('Authorization', 'Bearer ' + token)
            .end(function(err, res) {
                expect(res.body.result).to.be.true;
                expect(res.body.isError).to.be.false;
                expect(res).to.have.status(200);
                done();
            });
    });

    after(()=>{ process.exit(); })
});

