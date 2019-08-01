'use strict';
const express = require('express');
const serverless = require('serverless-http');

const app = express();
const enableWs = require('express-ws')
const cors = require('cors')({credentials: true, origin:true})

var http = require("http");
var ShareDB = require("sharedb");
var connect = require("connect");
var ShareDBMingoMemory = require('sharedb-mingo-memory');
var WebSocketJSONStream = require('@teamwork/websocket-json-stream');
var WebSocket = require('ws');

// Start ShareDB
var share = ShareDB({db: new ShareDBMingoMemory()});

const router = express.Router();

app.use(cors)
enableWs(app)

app.ws('/socket', (ws, req) => {
	  var stream = new WebSocketJSONStream(ws);
	  share.listen(stream);
	  share.use('query', (request, done) => {
	     console.log('listening on....', request.collection)
	     done()
	  })
	  share.use('op', (request, done) => {
	     console.log('OP happened', request.collection)
	     done()
	  })
})

var connection = share.connect();
connection.createFetchQuery('players', {}, {}, function(err, results) {
  if (err) { throw err; }

  if (results.length === 0) {
    var names = ["Ada Lovelace", "Grace Hopper", "Marie Curie",
                 "Carl Friedrich Gauss", "Nikola Tesla", "Claude Shannon"];

    names.forEach(function(name, index) {
      var doc = connection.get('players', ''+index);
      var data = {name: name, score: Math.floor(Math.random() * 10) * 5, created: 0 };
      doc.create(data);
    });
  }
})

router.get('/', (req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.write('<h1>Hello from Express.js!!!!</h1>');
  res.end();
});

app.use('/.netlify/functions/server', router);  // path must route to lambda

module.exports = app;
module.exports.handler = serverless(app);
