global.config = {
    NODE_ENV: process.env.NODE_ENV,
    BASE_URL: process.env.BASE_URL,
    MONGODB_URI: process.env.MONGODB_URI,
    SESSION_SECRET: process.env.SESSION_SECRET,
    SESSION_MAX_AGE: 1000 * 60 * 60 * 24 * 7,
    LOGIN_TOKEN_EXPIRATION: 1000 * 60 * 15,
    LOCALES: ["en", "pl", "ua"],
    CONTACTS: {
        admin: {
            email: process.env.CONTACT_ADMIN_EMAIL,
            phone: process.env.CONTACT_ADMIN_PHONE,
        },
    },
    MAILER: {
        host: process.env.MAILER_HOST,
        port: process.env.MAILER_PORT,
        auth: {
            user: process.env.MAILER_USER,
            pass: process.env.MAILER_PASS,
        },
    },
    PAYU: {
        pos_id: process.env.PAYU_POS_ID,
        second_key: process.env.PAYU_MD5,
        client_id: process.env.PAYU_CLIENT_ID,
        client_secret: process.env.PAYU_CLIENT_SECRET,
    },
    TRUST_PROXY: process.env.TRUST_PROXY ? Number(process.env.TRUST_PROXY) : false
};
