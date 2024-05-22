global.config = {
    NODE_ENV: process.env.NODE_ENV,
    MONGODB_URI: process.env.MONGODB_URI,
    SESSION_SECRET: process.env.SESSION_SECRET,
    SESSION_MAX_AGE: 1000 * 60 * 60 * 24 * 7,
    LOGIN_TOKEN_EXPIRATION: 1000 * 60 * 15,
    LOCALES: ['en', 'pl', 'ua']
};
