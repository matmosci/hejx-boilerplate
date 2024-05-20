const express = require('express');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const app = express();
const port = 9090;
const authRouter = require('./routers/auth.router');
const hxRouter = require('./routers/hx.router');
const pagesRouter = require('./routers/pages.router');
const user = require("./middleware/user.middleware");

app.set('views', './src/views');
app.set('view engine', 'ejs');

const store = new MongoDBStore({
    uri: process.env.MONGODB_URI,
    collection: 'sessions'
});

store.on('error', error => {
    console.log(error);
});

app.use(session({
    secret: global.config.SESSION_SECRET,
    store,
    resave: true,
    saveUninitialized: true,
    cookie: {
        secure: global.config.NODE_ENV !== 'development',
        maxAge: global.config.SESSION_MAX_AGE
    }
}));

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(user);
app.use('/hx', hxRouter);
app.use('/auth', authRouter);
app.use('/', pagesRouter);

app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`);
});
