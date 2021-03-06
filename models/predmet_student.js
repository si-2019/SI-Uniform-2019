/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('predmet_student', {
    id: {
      type: DataTypes.INTEGER(10),
      allowNull: false,
      primaryKey: true
    },
    idStudent: {
      type: DataTypes.INTEGER(10),
      allowNull: true,
      references: {
        model: 'Korisnik',
        key: 'idkorisnik'
      }
    },
    idPredmet: {
      type: DataTypes.INTEGER(10),
      allowNull: true,
      references: {
        model: 'Predmet',
        key: 'idpredmet'
      }
    },
    ocjena: {
      type: DataTypes.INTEGER(2),
      allowNull: true
    },
    datum_upisa: {
      type: DataTypes.DATEONLY,
      allowNull: true
    }
  }, {
    tableName: 'predmet_student'
  });
};
