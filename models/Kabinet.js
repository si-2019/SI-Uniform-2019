/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Kabinet', {
    idKabinet: {
      type: DataTypes.INTEGER(10),
      allowNull: false,
      primaryKey: true
    },
    kapacitet: {
      type: DataTypes.INTEGER(4),
      allowNull: true
    },
    naziv: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    namjena: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    }
  }, {
    tableName: 'Kabinet'
  });
};
