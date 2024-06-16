require("dotenv").config();
require("../../src/config/app.config");
const mongoose = require("mongoose");
const service = require("../../src/services/auth.service");

beforeAll(async () => {
    await mongoose.connect(global.config.MONGODB_URI);
});

afterAll(async () => {
    await mongoose.connection.close();
});

const testUser = {
    _id: new mongoose.Types.ObjectId(),
    email: 'test@example.com'
};

test('createLoginToken should create a login token and hash', async () => {
    const credentials = await service.createLoginToken(testUser.email);
    expect(credentials.token).toBeDefined();
    expect(credentials.hash).toBeDefined();
    Object.assign(testUser, credentials);
});

test('getUserByLoginToken should return a user by login token', async () => {
    const user = await service.getUserByLoginToken(testUser._id, testUser.email, testUser.token);
    expect(user).toBeDefined();
});

test('createLoginToken should create another login token and hash', async () => {
    const credentials = await service.createLoginToken(testUser.email);
    expect(credentials.token).toBeDefined();
    expect(credentials.hash).toBeDefined();
    Object.assign(testUser, credentials);
});

test('getUserByLoginHash should return a user by login hash', async () => {
    const user = await service.getUserByLoginHash(null, testUser.hash);
    testUser._id = user._id;
    expect(user).toBeDefined();
});

test('removeAnonymusUser should remove an anonymous user', async () => {
    const result = await service.removeAnonymusUser(testUser._id);
    expect(result).toBeDefined();
});

// test('sendLoginToken should send a login token email', () => {
//     const credentials = {
//         token: testUser.token,
//         hash: testUser.hash
//     };
//     expect(() => service.sendLoginToken(testUser.email, credentials)).not.toThrow();
// });
