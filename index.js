var express = require('express');
var path = require('path');
var fs = require('fs');
var pug = require('pug');
var bodyParser = require('body-parser');
var upload = require('express-fileupload');
var cors = require('cors');
const db = require('./models/db.js');
var axios=require('axios');

db.sequelize.sync().then(function(){
   console.log("Uspjesno povezano sa bazom");
}).catch(function(err){
    console.log("Nije uspjesno povezano sa bazom");
    console.log(err);

 });



var app = express();
app.use(upload());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('views',path.join(__dirname+"/public/",'views'));
app.set('view engine', 'pug');

app.post('/addTermin',function(req,res)
{
    /*db.termin.create({naziv:"Predavanje",danUSedmici:"2",datum:new Date(),trajanje:"90"}).then(function(k){
        return new Promise(function(resolve,reject){resolve(k);});
    })*/
      






})

app.get('/getTermini/:idStudenta',function(req,res)
{
    // pretpostavljamo da je id studenta 1
    var jsonString=new Array();
    db.termin.findAll().then(function(spisakTerminaDB){
        var velicina=spisakTerminaDB.length-1;
        var iVar=-1;
        spisakTerminaDB.forEach(termin => { 
            
            db.predmet.findOne({where:{id:termin.idPredmet}}).then(function(linkaniPredmet){
                db.zabiljeska.findOne
                jsonString.push(
                    {
                        id:termin.idTermin,
                        title:termin.naziv,
                        predmet:linkaniPredmet.naziv,
                        datum:termin.datum,
                        vrijeme:termin.datum,
                        sala:termin.idKabinet,
                        trajanje:termin.trajanje
                    }
                );
                iVar++; 
                if(iVar==velicina)
                {
                    res.writeHead(200, {'Content-Type': 'application/json'});        
                    res.end(JSON.stringify(jsonString));
                }
            });             
        });        
    });    
});

app.get('/getIspiti',function(req,res)
{
    var spisakIspita=[
        {
            id:  1,
            title:'Usmeni ispit',
            predmet:'Administracija racunarskih mreza',
            datum:'2019/04/11', 
            vrijeme:'14:30',
            sala:'S10',
            trajanje:'120'
        },
        {
            id:  2,
            title:'Prvi parcijalni ispit',
            predmet:'Softver Inzinjering',
            datum:'2019/04/11', 
            vrijeme:'13:00',
            sala:'MA',
            trajanje:'90'
        },
        {
            id:  3,
            title:'Usmeni ispit',
            predmet:'Tehnike programiranja',
            datum:'2019/04/11', 
            vrijeme:'17:30',
            sala:'S9',
            trajanje:'30'
        },
        {
            id:  4,
            title:'Prvi parcijalni ispit',
            predmet:'Linearna algebra i geometrija',
            datum:'2019/04/11', 
            vrijeme:'09:30',
            sala:'VA',
            trajanje:'180'
        },
        {
            id:  5,
            title:'Drugi parcijalni ispit',
            predmet:'Objektno orijentisana analiza i dizajn',
            datum:'2019/04/12', 
            vrijeme:'14:30',
            sala:'S8',
            trajanje:'120'
        }
    ]
    
    var vel=spisakIspita.length;

     
    var jsonContent="[";
    if(vel!=0)
    {
        jsonContent+="{\n";
        jsonContent+="\"id\": ";
        jsonContent+="\"";
        jsonContent+=spisakIspita[0].id;
        jsonContent+="\",";
        jsonContent+="\n\"title\": ";
        jsonContent+="\"";
        jsonContent+=spisakIspita[0].title;
        jsonContent+="\",";
        jsonContent+="\n\"predmet\": ";
        jsonContent+="\"";
        jsonContent+=spisakIspita[0].predmet;
        jsonContent+="\",";
        jsonContent+="\n\"datum\": ";
        jsonContent+="\"";
        jsonContent+=spisakIspita[0].datum;
        jsonContent+="\",";
        jsonContent+="\n\"vrijeme\": ";
        jsonContent+="\"";
        jsonContent+=spisakIspita[0].vrijeme;
        jsonContent+="\",";
        jsonContent+="\n\"sala\": ";
        jsonContent+="\"";
        jsonContent+=spisakIspita[0].sala;
        jsonContent+="\",";
        jsonContent+="\n\"trajanje\": ";
        jsonContent+="\"";
        jsonContent+=spisakIspita[0].trajanje;
        jsonContent+="\"";
        jsonContent+="}";    
    }
     for(let i=1;i<vel;i++)
    {
        jsonContent+=",{\n";
        jsonContent+="\"id\": ";
        jsonContent+="\"";
        jsonContent+=spisakIspita[i].id;
        jsonContent+="\",";
        jsonContent+="\n\"title\": ";
        jsonContent+="\"";
        jsonContent+=spisakIspita[i].title;
        jsonContent+="\",";
        jsonContent+="\n\"predmet\": ";
        jsonContent+="\"";
        jsonContent+=spisakIspita[i].predmet;
        jsonContent+="\",";
        jsonContent+="\n\"datum\": ";
        jsonContent+="\"";
        jsonContent+=spisakIspita[i].datum;
        jsonContent+="\",";
        jsonContent+="\n\"vrijeme\": ";
        jsonContent+="\"";
        jsonContent+=spisakIspita[i].vrijeme;
        jsonContent+="\",";
        jsonContent+="\n\"sala\": ";
        jsonContent+="\"";
        jsonContent+=spisakIspita[i].sala;
        jsonContent+="\",";
        jsonContent+="\n\"trajanje\": ";
        jsonContent+="\"";
        jsonContent+=spisakIspita[i].trajanje;
        jsonContent+="\"";
        jsonContent+="}";
    }
    jsonContent+="]";
    res.writeHead(200, {'Content-Type': 'application/json'});        
    res.end(jsonContent);  
});

/********************************************************************** */

//   TUDJE RUTE



app.get('/getPredmet/:predmetID',function(req,res)
{
    
    db.predmet.findOne({where:{id:req.params.predmetID}}).then(function(predmet)
    {
        if(predmet==null)
        {
            console.log("Ne postoji predmet sa id-em " + req.params.predmetID)                    
        }
        else
        {
            res.writeHead(200, {'Content-Type': 'application/json'});
            var jsonPredmet = 
            {
                id:predmet.id.toString(),
                idAsistent:predmet.idAsistent.toString(),
                idProfesor:predmet.idProfesor.toString(),
                naziv:predmet.naziv.toString(),
                ects:predmet.ects.toString(),
                brojPredavanja:predmet.brojPredavanja.toString(),
                brojVjezbi:predmet.brojVjezbi.toString(),
                opis:predmet.opis.toString()
            };                 
            res.end(JSON.stringify(jsonPredmet));  
        }                
    });
})

// Treba mi ruta koja vraca predmet za dati id
// Treba mi ruta koja vraca korisnika za dati id



app.listen(3001);
console.log("Server running on localhost:3001");




