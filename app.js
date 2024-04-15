const express = require('express');
const app = express();
const port = 9090;

const hx = require('./src/routes/hx.js');

app.set('view engine', 'ejs');

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
    req.isHx = req.headers['hx-request'] === 'true';
    next();
});

app.use('/hx', hx);

app.get('/', (req, res) => { getPage(req, res, "home") });
app.get('/query', (req, res) => { getPage(req, res, "query") });
app.get('/get', (req, res) => { getPage(req, res, "get") });
app.get('/form', (req, res) => { getPage(req, res, "form") });

app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`);
});

function getPage(req, res, pageName) {
    const content = `pages/${pageName}`;
    const { query } = req;
    req.isHx ? res.render(content, { query }) : res.render("index", { content, query });
}
