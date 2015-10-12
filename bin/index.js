#!/usr/bin/env node
'use strict';

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const open = require('open');

const api = require('./api');

const DEBUG = process.env.NODE_ENV !== 'production';

const app = express();
const publicPath = path.resolve(__dirname, '../build');

const projectPath = process.argv[2] || process.cwd();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

if (DEBUG) {
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
  });
}

app.use('/api', api(projectPath));

app.use(express.static(publicPath));

app.get('*', (req, res, next) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});

const port = process.env.PORT || 3000;
app.listen(port, 'localhost', () => {
  const url = 'http://localhost:' + port;
  console.log('App running on ' + url);
  open(url);
});
