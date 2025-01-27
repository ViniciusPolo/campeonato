const express = require('express');
const { sequelize } = require('./database/models/index'); // Import sequelize instance
const app = express();
const http = require('http');

app.use(express.json());

// Configuração do Sequelize
// const sequelize = new Sequelize('postgres://user:password@db:5432/copadb');

// Testa a conexão com o banco
sequelize.authenticate()
  .then(() => {
    console.log('PostgreSQL Connected');
    return sequelize.sync();
  })
  .catch(err => {
    console.error('PostgreSQL Connection Error:', err);
  });

// app.get('/', (req, res) => {
//   res.send('Server Running!');
// });

// app.listen(port, () => {
//   console.log(`Server listenig on port ${port}`);
// });

const teamsRoutes = require('./routes/teamsRoutes')
const tournamentRoutes = require('./routes/tournamentRoutes')
const gamesRoutes = require('./routes/gamesRoutes')

app.use(teamsRoutes)
app.use(tournamentRoutes)
app.use(gamesRoutes)

app.set('url', 'http://localhost:');
app.set('port', 3000);

http.createServer(app).listen(app.get('port'), function(){
    console.log('Server started on '+ app.get('url') + app.get('port'))
})

module.exports = app
