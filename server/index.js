const express = require('express');
const path = require('path');

// Feel free to move or copy/paste the line below 
// where db queries are required
const db = require('../database');

const app = express();

app.use('/', express.static(path.join(__dirname, '../client/dist')));

app.listen(3000, () => { console.log('Listening on port 3000'); });
