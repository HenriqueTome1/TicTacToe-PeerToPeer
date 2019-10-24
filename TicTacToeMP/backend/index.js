const express = require('express');
const bodyParser = require('body-parser')
const cors = require('cors');
// const favicon = require('serve-favicon')
// const path = require('path')

const app = express();
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
app.use(bodyParser());
app.use(cors());

const client = require('./routes/api/client');
// const p2p = require('./routes/api/p2p')

app.use('/api/client', client);

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Server ouvindo na porta ${port}`));
