const { Sequelize } = require('sequelize');
const Teams = require('./teams'); // Your Teams model
const Tournament = require('./tournament'); // Your Teams model
const Games = require('./games');

const sequelize = new Sequelize('postgres://user:password@db:5432/copadb', {
  dialect: 'postgres',
  logging: false, // Disable logging SQL queries (you can enable it if needed)
});

const models = {
  Teams: Teams.init(sequelize), // Initialize the Teams model with sequelize
  Tournament: Tournament.init(sequelize), // Initialize the Teams model with sequelize
  Games: Games.init(sequelize), // Initialize the Teams model with sequelize
};

// Make sure to associate models if needed (for future relationships)
Object.values(models).forEach((model) => {
  if (typeof model.associate === 'function') {
    model.associate(models);
  }
});

module.exports = { sequelize, models };
