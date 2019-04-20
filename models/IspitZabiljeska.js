/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('IspitZabiljeska', {
    idIspitZabiljeska: {
      type: DataTypes.INTEGER(10),
      allowNull: false,
      primaryKey: true
    },
    idIspit: {
      type: DataTypes.INTEGER(10),
      allowNull: true,
      references: {
        model: 'Ispit',
        key: 'idispit'
      }
    },
    idZabiljeska: {
      type: DataTypes.INTEGER(10),
      allowNull: true,
      references: {
        model: 'Zabiljeska',
        key: 'idzabiljeska'
      }
    }
  }, {
    tableName: 'IspitZabiljeska'
  });
};
