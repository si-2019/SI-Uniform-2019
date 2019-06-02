/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('PonudjeniOdgovor', {
    
    idPitanja: {
      type: DataTypes.INTEGER(10),
      allowNull: false,
      references: {
        model: 'Pitanje',
        key: 'idpitanja'
      }
    },
    tekstOdgovora: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    tableName: 'PonudjeniOdgovor'
  });
};
