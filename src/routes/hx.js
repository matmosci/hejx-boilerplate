const express = require("express");
const router = express.Router();

router.get('/test', (req, res) => {
    res.send("Test response " + Math.random())
});
router.post('/form', (req, res) => {
    const { name, email, password } = req.body;
    if (!(name && email && password)) return res.sendStatus(400);
    res.send(`
        <h2>Form submitted</h2>
        <div>Name: ${name}</div>
        <div>Email: ${email}</div>
        <div>Password: ${password}</div>`);
});

module.exports = router;