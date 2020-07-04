module.exports = function (app, prefix) {
  app.get(prefix, function (req, res) {
    res.send('hello world');
  });

  // create
  app.post(prefix + '/create', function (req, res) {
    res.send('create');
  });

  // get user
  app.post(prefix + '/get', function (req, res) {
    res.send('get user');
  });

  // get user
  app.post(prefix + '/get', function (req, res) {
    res.send('update user');
  });

  // update user
  app.post(prefix + '/delete', function (req, res) {
    res.send('delete user');
  });
};
