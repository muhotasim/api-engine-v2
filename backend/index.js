const express = require('express');
const config = require('./config');
const port = 9008;
const path = require('path');
const app = express();
// const oauthserver = require('oauth2-server');

app.use(express.urlencoded());
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));
const onListen = () => {
  console.log(`server is running at http://localhost:${port}`);
};
app.listen(port, onListen);

require('./server')(app);
