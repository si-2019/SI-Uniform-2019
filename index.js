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
    
})

app.get('/getTermini/:idStudenta',function(req,res)
{
    // pretpostavljamo da je id studenta 1
   var jsonString=new Array();
    
   res.writeHead(200, {'Content-Type': 'application/json'});        
   res.end(JSON.stringify(jsonString));  
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
    var jsonContent={};
    res.writeHead(200, {'Content-Type': 'application/json'});        
    res.end(jsonContent);  
});

/********************************************************************** */

//   TUDJE RUTE

app.get('/getPredmet/:predmetID',function(req,res)
{
   var jsonPredmet={};
    res.end(JSON.stringify(jsonPredmet)); 
})




app.listen(3001);
console.log("Server running on localhost:3001");




