'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class tournament extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  tournament.init({
    name: DataTypes.STRING,
    winner: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'tournament',
  });
  return tournament;
};