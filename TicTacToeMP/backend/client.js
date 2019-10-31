const express = require('express');
const bodyParser = require('body-parser')
const cors = require('cors');
const app = express();
// const client = require('./routes/api/client');
const cliente = require('./routes/api/cliente');

app.use(bodyParser());
app.use(cors());

// app.use('/api/client', client);
app.use('/api/cliente', cliente);

const port = 1024;

app.listen(port, () => console.log(`Server do Client ouvindo na porta ${port}`));
