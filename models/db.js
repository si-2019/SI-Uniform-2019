
const Sequelize = require("sequelize");
const sequelize = new Sequelize("TYQcLL35gV","TYQcLL35gV","BLysSj9ZrP",{host:'37.59.55.185',dialect:"mysql",logging:false,  port: 3306,define: {
    timestamps: false
}
});
const db = {}
db.Sequelize = Sequelize;  
db.sequelize = sequelize;

//import modela
db.zabiljeska = sequelize.import(__dirname+'/Zabiljeska.js');
db.kabinet = sequelize.import(__dirname+'/Kabinet.js');
db.predmet = sequelize.import(__dirname+'/Predmet.js');
db.korisnik = sequelize.import(__dirname+'/Korisnik.js');
db.grupaTermina = sequelize.import(__dirname+'/GrupaTermina.js');
db.ispit = sequelize.import(__dirname+'/Ispit.js');
db.grupaZabiljeska = sequelize.import(__dirname+'/GrupaZabiljeska.js');
db.ispitZabiljeska = sequelize.import(__dirname+'/IspitZabiljeska.js');



module.exports=db;