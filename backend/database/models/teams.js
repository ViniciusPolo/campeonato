const { Model, DataTypes } = require('sequelize')

class Teams extends Model {
  static init(sequelize) {
      super.init({
          name: DataTypes.STRING,
      }, {
          sequelize,
          tableName: "teams",
          modelName: "teams"
      })
      return this 
  }
  static associate(models) {
  }
}
module.exports = Teams