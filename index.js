const express = require('express');
const _ = require('lodash');
const moment = require('moment');

const app = express();

app.get('/', (req, res) => {
  const now = moment().format('YYYY-MM-DD HH:mm:ss');
  const data = _.merge({}, { greeting: 'Hello from vuln-demo-app' }, { time: now });
  res.json(data);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`vuln-demo-app listening on port ${PORT}`);
});
