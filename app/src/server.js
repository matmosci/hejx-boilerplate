const express = require('express');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const app = express();
const port = 9090;
const user = require('./middleware/user.middleware');
const cookieParser = require('cookie-parser');
const { I18n } = require('i18n');
require('./utils/mailer.utils').verify();

app.set('views', './src/views');
app.set('view engine', 'ejs');
app.set('trust proxy', global.config.TRUST_PROXY);

const store = new MongoDBStore({
    uri: global.config.MONGODB_URI,
    collection: 'sessions'
});

store.on('error', error => {
    console.log(error);
});

const i18n = new I18n({
    directory: './src/locales',
    locales: global.config.LOCALES,
    defaultLocale: global.config.LOCALES[0],
    cookie: 'lang'
});

app.use(session({
    secret: global.config.SESSION_SECRET,
    store,
    resave: true,
    rolling: true,
    saveUninitialized: true,
    cookie: {
        secure: global.config.NODE_ENV !== 'development',
        maxAge: global.config.SESSION_MAX_AGE
    }
}));

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(i18n.init);
app.use(user);
app.use('/', [
    require('./routers/pages.router'),
    require('./routers/json.router'),
]);
app.use('/auth', require('./routers/auth.router'));
app.use('/transaction', require('./routers/transaction.router'));
app.use('/products', require('./routers/products.router'));
app.use('/cart', require('./routers/cart.router'));

app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`);
});
