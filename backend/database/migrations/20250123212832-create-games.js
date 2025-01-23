'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Games', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      local_team: {
        type: Sequelize.STRING
      },
      visitor_team: {
        type: Sequelize.STRING
      },
      local_goals: {
        type: Sequelize.INTEGER
      },
      visitor_goals: {
        type: Sequelize.INTEGER
      },
      local_points: {
        type: Sequelize.INTEGER
      },
      visitor_points: {
        type: Sequelize.INTEGER
      },
      penalties: {
        type: Sequelize.BOOLEAN
      },
      penalties_local_goals: {
        type: Sequelize.INTEGER
      },
      penalties_visitor_goals: {
        type: Sequelize.INTEGER
      },
      winner: {
        type: Sequelize.STRING
      },
      eliminated: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Games');
  }
};