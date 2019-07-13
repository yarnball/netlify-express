'use strict';
const express = require('express');
const serverless = require('serverless-http');
const app = express();
const cors = require('cors')({credentials: true, origin:true})

app.use(cors)
app.get('/', (req, res) => {
	res.status(200).send('Server running at!')
})
app.get('/log', (req, res) => {
	console.log(req)
	res.status(200).json(req.headers)
})
module.exports = app;
module.exports.handler = serverless(app);
