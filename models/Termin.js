/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Termin', {
    idTermin: {
      type: DataTypes.INTEGER(10),
      allowNull: false,
      primaryKey: true
    },
    idGrupe: {
      type: DataTypes.INTEGER(10),
      allowNull: false,
      references: {
        model: 'GrupaTermina',
        key: 'idgrupe'
      }
    },
    idKabinet: {
      type: DataTypes.INTEGER(10),
      allowNull: false,
      references: {
        model: 'Kabinet',
        key: 'idkabinet'
      }
    },
    naziv: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    danUSedmici: {
      type: DataTypes.INTEGER(10),
      allowNull: true
    },
    vrijeme: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    trajanje: {
      type: DataTypes.INTEGER(10),
      allowNull: true
    }
  }, {
    tableName: 'Termin'
  });  
};
