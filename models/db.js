
const Sequelize = require("sequelize");
const sequelize = new Sequelize("TYQcLL35gV","TYQcLL35gV","BLysSj9ZrP",{host:'37.59.55.185',dialect:"mysql",logging:false,  port: 3306,define: {
    timestamps: false
}
});
const db = {}
db.Sequelize = Sequelize;  
db.sequelize = sequelize;

//import modela
db.termin = sequelize.import(__dirname+'/Termin.js');
db.zabiljeska = sequelize.import(__dirname+'/Zabiljeska.js');
db.kabinet = sequelize.import(__dirname+'/Kabinet.js');
db.predmet = sequelize.import(__dirname+'/Predmet.js');
db.korisnik = sequelize.import(__dirname+'/Korisnik.js');

//relacije

db.predmet.hasMany(db.termin,{as:'termini',foreignKey:'idPredmet'});
db.kabinet.hasMany(db.termin,{as:'termini',foreignKey:'idKabinet'});
db.korisnik.hasMany(db.termin,{as:'termini',foreignKey:'idPredavac'});

// Veza n-m 
db.termin_zabiljeska = db.zabiljeska.belongsToMany(db.termin,{as:'termini',through:'TerminZabiljeska',foreignKey:'idZabiljeska'});
db.termin.belongsToMany(db.zabiljeska,{as:'zabiljeske',through:'TerminZabiljeska',foreignKey:'idTermin'});

/*
// Veza n-m 
db.vjezba_zadatak = db.zadatak.belongsToMany(db.vjezba,{as:'vjezbe',through:'vjezba_zadatak',foreignKey:'idzadatak'});
db.vjezba.belongsToMany(db.zadatak,{as:'zadaci',through:'vjezba_zadatak',foreignKey:'idvjezba'});

*/

module.exports=db;