import { expect } from "chai";
import mongoose from "mongoose";
import User from "../models/UserModel.js";

const testUser = {
    name: 'Test User',
    email: 'aJ9oH@example.com',
    password: 'testpassword'
};

describe('User Controller', function () {
    before(async function() {

        await mongoose.connect('mongodb://localhost:27017/test', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
    });

    after(async function() {

        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
    });

    it('should register a new user', async function () {
        const user = new User(testUser);
        await user.save();
        expect(user).to.be.ok;
        expect(user).to.have.property('_id');
        expect(user.email).to.equal(testUser.email);
    });
});
