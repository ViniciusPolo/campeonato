const { Model, DataTypes} = require('sequelize');
class Games extends Model {
  static init(sequelize) {
    super.init({
      local_team: DataTypes.STRING,
      visitor_team: DataTypes.STRING,
      local_goals: DataTypes.INTEGER,
      visitor_goals: DataTypes.INTEGER,
      penalities: DataTypes.BOOLEAN,
      local_penalty_goals: DataTypes.INTEGER,
      visitor_penalty_goals: DataTypes.INTEGER,
      winner: DataTypes.STRING,
      eliminated: DataTypes.STRING,
      local_points: DataTypes.INTEGER,
      visitor_points: DataTypes.INTEGER,
      tournament: DataTypes.STRING,
      round_of: DataTypes.STRING
    }, {
      sequelize,
      tableName: "games",
      modelName: 'Games', 
  });
    return this 
  }
  static associate(models) {
  }
}
module.exports = Games
 