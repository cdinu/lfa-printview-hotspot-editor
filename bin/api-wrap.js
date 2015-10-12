const when = require('when');
const nodefn = require('when/node');
//const MongoClient = require('mongodb').MongoClient;

//const mongoURL = process.env.MONGODB_URL || ('mongodb://localhost/' + require('../package.json').name);
//const dbPromise = nodefn.call(MongoClient.connect.bind(MongoClient), mongoURL);

module.exports = function wrapAPI(opts, f) {
  if (typeof opts !== 'object') {
    f = opts;
    opts = {};
  }
  return (req, res) => {
    //(opts.db ? dbPromise : when())
    when()
      .then(f.bind(null, req, res))
      .then(data => {
        const json = JSON.stringify(data);
        res.setHeader('Content-Type', 'application/json');
        res.end(json);
      })
      .catch(err => {
        if (err.stack) {
          console.error(err.stack);
        } else {
          console.error(err);
        }
        const json = JSON.stringify({ 
          message: err.message || err.description || err.toString()
        });
        res.status(err.httpStatusCode || 500);
        res.setHeader('Content-Type', 'application/json');
        res.end(json);
      });
  };
};
