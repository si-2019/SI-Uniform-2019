/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Privilegija', {
 
    privilegija: {
      type: DataTypes.STRING(50),
      allowNull: true
    }
  }, {
    tableName: 'Privilegija'
  });
};
