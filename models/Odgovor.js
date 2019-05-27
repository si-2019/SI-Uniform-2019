/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Odgovor', {
    
    idPitanje: {
      type: DataTypes.INTEGER(10),
      allowNull: false,
      references: {
        model: 'Pitanje',
        key: 'idpitanja'
      }
    },
    idPonudjeniOdgovor: {
      type: DataTypes.INTEGER(10),
      allowNull: false,
      references: {
        model: 'PonudjeniOdgovor',
        key: 'idponudjeniodgovor'
      }
    },
    tekstOdgovora: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    tableName: 'Odgovor'
  });
};
