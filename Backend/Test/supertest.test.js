import { expect } from 'chai';
import supertest from 'supertest';

const request = supertest('http://localhost:8081');

const testUser = {
    name: 'Test User',
    email: 'aJ9oH@example.com',
    password: 'testpassword'
};

describe('User Controller', function () {

    it('POST /api/auth/register - should register a new user', async function () {
        this.timeout(10000);
        const { status, body } = await request.post('/api/auth/register').send(testUser);
        expect(status).to.equal(201);
        expect(body.payload).to.be.ok; 
        // expect(body.message).to.equal('User created successfully');

    });

    it('POST /api/auth/login - should log in the user', async function () {
        const { status, body } = await request.post('/api/auth/login').send(testUser);
        expect(status).to.equal(200); 
        expect(body.message).to.equal('User logged in successfully');

    });
});
