'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Games extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Games.init({
    local_team: DataTypes.STRING,
    visitor_team: DataTypes.STRING,
    local_goals: DataTypes.INTEGER,
    visitor_goals: DataTypes.INTEGER,
    local_points: DataTypes.INTEGER,
    visitor_points: DataTypes.INTEGER,
    penalties: DataTypes.BOOLEAN,
    penalties_local_goals: DataTypes.INTEGER,
    penalties_visitor_goals: DataTypes.INTEGER,
    winner: DataTypes.STRING,
    eliminated: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Games',
  });
  return Games;
};