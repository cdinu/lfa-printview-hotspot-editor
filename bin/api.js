const express = require('express');
const wrapAPI = require('./api-wrap');
const filewalker = require('filewalker');
const when = require('when');
const nodefn = require('when/node');
const path = require('path');
const fs = require('fs');
const _ = require('lodash');

module.exports = function api(projectPath) {
  const router = express.Router();

  router.get('/chapters', wrapAPI(() => {
    const files = [];
    return when
      .try(() => {
        const walker = filewalker(path.join(projectPath, 'text'));

        walker.on('file', (filePath) => {
          if (/\.jade$/.test(filePath)) {
            files.push(filePath);
          }
        });

        return walker;

      })
      .then(walker => {
        return when.promise((resolve, reject) => {
          walker.on('done', resolve);
          walker.on('error', reject);
          walker.walk();
        });
      })
      .then(() => files);
  }));

  router.post('/chapters', wrapAPI((req) => {
    const promises = [];
    _.each(req.body, (file, chapter) => {
      const fPath = path.join(projectPath, 'text', chapter);
      promises.push(nodefn.call(fs.writeFile, fPath, file));
    });
    return when.all(promises);
  }));

  router.use('/files', express.static(projectPath));

  return router;
};
