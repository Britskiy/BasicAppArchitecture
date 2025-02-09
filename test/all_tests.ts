import chai from 'chai';
import chaiHttp from 'chai-http';
import { Server } from 'http';
import { UserModel } from '../src/models/user';
import { userData } from './data/user';
import { createClient } from 'redis';
import mongoose from 'mongoose';

const { expect } = chai;
chai.use(chaiHttp);

describe('User API', () => {
    let server: Server;
    let userId: string;
    let token: string;
    let redisClient: any;

    before(async () => {
        const app = await import('../src/app');
        server = app.default.listen(0);
        await UserModel.deleteMany({});

        redisClient = createClient();
        await redisClient.connect();
    });

    after(async () => {
        await new Promise<void>((resolve) => server.close(() => resolve()));
        await UserModel.deleteMany({});
        await mongoose.disconnect();
        if (redisClient) {
            await redisClient.quit();
        }
    });

    describe('User Registration', () => {
        it('should fail with empty request', async () => {
            const res = await chai.request(server).post('/user').send(); // Используем server вместо URL
            expect(res).to.have.status(400);
            expect(res.body.isError).to.be.true;
        });

        it('should create new user', async () => {
            const res = await chai.request(server)
                .post('/user')
                .send(userData);

            expect(res).to.have.status(200);
            expect(res.body.result).to.equal('OK');
            expect(res.body._id).to.exist;
            userId = res.body._id;
        });
    });

    describe('User Operations', () => {
        before(async () => {
            const authRes = await chai.request(server)
                .post('/user/auth')
                .send({
                    login: userData.login,
                    password: userData.password
                });

            token = authRes.body.token;
        });

        it('should get user public info', async () => {
            const res = await chai.request(server).get(`/user/${userId}`);
            expect(res).to.have.status(200);
            expect(res.body.result.firstName).to.equal(userData.firstName);
        });

        it('should update user with auth token', async () => {
            const updatedData = {
                ...userData,
                firstName: 'testNameInTestCase'
            };

            const res = await chai.request(server)
                .put('/user')
                .set('Authorization', `Bearer ${token}`)
                .send(updatedData);

            expect(res).to.have.status(200);
            expect(res.body.result.firstName).to.equal(updatedData.firstName);
        });

        it('should delete user with auth token', async () => {
            const res = await chai.request(server)
                .delete('/user')
                .set('Authorization', `Bearer ${token}`)
                .send({ password: userData.password });

            expect(res).to.have.status(200);
            expect(res.body.result).to.be.true;
        });

        it('should logout user', async () => {
            const res = await chai.request(server)
                .get('/user/logout')
                .set('Authorization', `Bearer ${token}`);

            expect(res).to.have.status(200);
            expect(res.body.result).to.be.true;
        });
    });
});