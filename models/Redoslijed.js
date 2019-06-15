/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Redoslijed', {
    id: {
      type: DataTypes.INTEGER(10),
      allowNull: false,
      primaryKey: true
    },
    naziv: {
      type: DataTypes.STRING(10),
      allowNull: false
    }
  }, {
    tableName: 'Redoslijed'
  });
};
