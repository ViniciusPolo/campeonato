const express = require('express');
const { Sequelize } = require('sequelize');
const app = express();
const port = 3000;

// Configuração do Sequelize
const sequelize = new Sequelize('postgres://user:password@db:5432/mydb');

// Testa a conexão com o banco
sequelize.authenticate()
  .then(() => {
    console.log('PostgreSQL Connected');
  })
  .catch(err => {
    console.error('PostgreSQL Connection Error:', err);
  });

app.get('/', (req, res) => {
  res.send('Server Running!');
});

app.listen(port, () => {
  console.log(`Server listenig on port ${port}`);
});
