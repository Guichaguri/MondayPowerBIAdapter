const express = require('express');
const fs = require('fs');
const { Client } = require('pg');

const app = express();
app.use(express.urlencoded({ extended: true }));

const db = new Client({
    connectionString: process.env.DATABASE_URL || 'postgres://postgres:123456@localhost/tests',
    //ssl: true
});

const indexHtml = fs.readFileSync('./index.html');

app.get('/', function (req, res) {
    res.set('Content-Type', 'text/html');
    res.send(indexHtml);
});

app.post('/token', require('./generateToken.js').bind(null, db));

app.get('/1/items', require('./items.js').bind(null, db));

db.connect();
app.listen(3000);

require('./database.js').setupDatabase(db);
