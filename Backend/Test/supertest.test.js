import chai from 'chai';
import supertest from 'supertest';


const expect = chai.expect;
const request = supertest('http://localhost:8081');
const testUser = {
    name: 'Test User',
    email: 'aJ9oH@example.com',
    password: 'testpassword'
};
describe('User Controller', function () {

    it('POST /api/auth/register', async function () {
        const { status, body } = await request.post('/api/auth/register').send(testUser);
        expect(status.error).to.be.undefined;
        expect(body.payload).to.be.ok('User created successfully');
    });

})

it('POST /api/auth/login', async function () {
    const { status, body } = await request.post('/api/auth/login').send(testUser);
    expect(status.error).to.be.undefined;
    expect(body.payload).to.be.ok('User logged in successfully');
})


it('', async function () {
    
})

