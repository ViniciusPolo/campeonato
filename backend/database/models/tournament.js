const { Model, DataTypes} = require('sequelize');
class Tournament extends Model {
  static init(sequelize) {
    super.init({
      name: DataTypes.STRING,
      winner: DataTypes.STRING
    }, {
        sequelize,
        tableName: "tournaments",
        modelName: "tournament"
    })
    return this 
  }
  static associate(models) {
  }
}
module.exports = Tournament
