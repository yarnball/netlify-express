'use strict';
const express = require('express');
const serverless = require('serverless-http');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors')({credentials: true, origin:true})

const router = express.Router();
router.get('/', (req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.write('<h1>Hello from Express.js!</h1>');
  res.end();
});
router.get('/log', (req, res) => {
	console.log("LLLLLLLLLLLOG", req.headers)
    res.status(200).json({ resssp: req.headers })
  })
router.post('/', (req, res) => res.status(200).json({ head: req.headers }));

app.use(cors)
app.use(bodyParser.json());
app.use('/.netlify/functions/server', router);  // path must route to lambda

module.exports = app;
module.exports.handler = serverless(app);
