var express = require('express');
var path = require('path');
var fs = require('fs');
var pug = require('pug');
var bodyParser = require('body-parser');
var upload = require('express-fileupload');
var cors = require('cors');

var app = express();
app.use(upload());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('views',path.join(__dirname+"/public/",'views'));
app.set('view engine', 'pug');


app.get('/getTermini',function(req,res)
{
    var spisakTermina=[
        {
            id:  1,
            title:'Predavanje',
            predmet:'Projektovanje informacionih sistema',
            datum:'2019/04/08', 
            vrijeme:'12:00',
            sala:'MA',
            trajanje:'120'
        },
        {
            id:  2,
            title:'Tutorijal',
            predmet:'Projektovanje informacionih sistema',
            datum:'2019/04/08', 
            vrijeme:'17:00',
            sala:'MA',
            trajanje:'60'
        },
        {
            id:  3,
            title:'Predavanje',
            predmet:'Softver Inzinjering',
            datum:'2019/04/09', 
            vrijeme:'09:00',
            sala:'S1',
            trajanje:'180'
        },
        {
            id:  4,
            title:'Vjezbe',
            predmet:'Projektovanje informacionih sistema',
            datum:'2019/04/10', 
            vrijeme:'18:00',
            sala:'S5',
            trajanje:'120'
        },
        {
          id:  5,
          title:'Predavanje',
          predmet:'Administracija racunarskih mreza',
          datum:'2019/04/11', 
          vrijeme:'09:00',
          sala:'S5',
          trajanje:'180'
        },
        {
          id:  6,
          title:'Predavanje',
          predmet:'Vjestacka inteligencija',
          datum:'2019/04/11', 
          vrijeme:'15:00',
          sala:'S1',
          trajanje:'120'
        },
        {
          id:  7,
          title:'Vjezbe',
          predmet:'Vjestacka inteligencija',
          datum:'2019/04/11', 
          vrijeme:'20:00',
          sala:'1-02',
          trajanje:'60'
        },
        {
          id:  8,
          title:'Vjezbe',
          predmet:'Administracija racunarskih mreza',
          datum:'2019/04/12', 
          vrijeme:'09:00',
          sala:'1-03',
          trajanje:'120'
        }
    ]
   
    

    var vel=spisakTermina.length;
    var jsonContent="[";
    if(vel!=0)
    {
        jsonContent+="{\n";
        jsonContent+="\"id\": ";
        jsonContent+="\"";
        jsonContent+=spisakTermina[0].id;
        jsonContent+="\",";
        jsonContent+="\n\"title\": ";
        jsonContent+="\"";
        jsonContent+=spisakTermina[0].title;
        jsonContent+="\",";
        jsonContent+="\n\"predmet\": ";
        jsonContent+="\"";
        jsonContent+=spisakTermina[0].predmet;
        jsonContent+="\",";
        jsonContent+="\n\"datum\": ";
        jsonContent+="\"";
        jsonContent+=spisakTermina[0].datum;
        jsonContent+="\",";
        jsonContent+="\n\"vrijeme\": ";
        jsonContent+="\"";
        jsonContent+=spisakTermina[0].vrijeme;
        jsonContent+="\",";
        jsonContent+="\n\"sala\": ";
        jsonContent+="\"";
        jsonContent+=spisakTermina[0].sala;
        jsonContent+="\",";
        jsonContent+="\n\"trajanje\": ";
        jsonContent+="\"";
        jsonContent+=spisakTermina[0].trajanje;
        jsonContent+="\"";
        jsonContent+="}";    
    }
     for(let i=1;i<vel;i++)
    {
        jsonContent+=",{\n";
        jsonContent+="\"id\": ";
        jsonContent+="\"";
        jsonContent+=spisakTermina[i].id;
        jsonContent+="\",";
        jsonContent+="\n\"title\": ";
        jsonContent+="\"";
        jsonContent+=spisakTermina[i].title;
        jsonContent+="\",";
        jsonContent+="\n\"predmet\": ";
        jsonContent+="\"";
        jsonContent+=spisakTermina[i].predmet;
        jsonContent+="\",";
        jsonContent+="\n\"datum\": ";
        jsonContent+="\"";
        jsonContent+=spisakTermina[i].datum;
        jsonContent+="\",";
        jsonContent+="\n\"vrijeme\": ";
        jsonContent+="\"";
        jsonContent+=spisakTermina[i].vrijeme;
        jsonContent+="\",";
        jsonContent+="\n\"sala\": ";
        jsonContent+="\"";
        jsonContent+=spisakTermina[i].sala;
        jsonContent+="\",";
        jsonContent+="\n\"trajanje\": ";
        jsonContent+="\"";
        jsonContent+=spisakTermina[i].trajanje;
        jsonContent+="\"";
        jsonContent+="}";
    }
    jsonContent+="]";
    res.writeHead(200, {'Content-Type': 'application/json'});        
    res.end(jsonContent);  
});

app.get('/getIspiti',function(req,res)
{
    var spisakIspita=[
        /*{
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
        }*/
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

app.listen(3001);
console.log("Server running on localhost:3001");




