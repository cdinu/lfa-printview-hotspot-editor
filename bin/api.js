const express = require('express');
const wrapAPI = require('./api-wrap');
const filewalker = require('filewalker');
const when = require('when');
const path = require('path');

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

  router.use('/files', express.static(projectPath));

  return router;
};
