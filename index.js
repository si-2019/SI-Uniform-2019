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

const sljedeciDan = (datum) =>// funkcija vraca datum sljedeceg dana
{
  var today = new Date(datum);
  var tomorrow = new Date();
  tomorrow.setDate(today.getDate()+1);
  
  var dd = String(tomorrow.getDate()).padStart(2, '0');
  var mm = String(tomorrow.getMonth() + 1).padStart(2, '0'); //Januar je 0!
  var yyyy = tomorrow.getFullYear();
  datum = yyyy + '/' + mm + '/' + dd;
  
  return datum;
}

const prethodniDan = (datum) =>// funkcija vraca datum prethodnog dana
  {
    var today = new Date(datum);
    var yesterday = new Date();
    yesterday.setDate(today.getDate()-1);
    
    var dd = String(yesterday.getDate()).padStart(2, '0');
    var mm = String(yesterday.getMonth() + 1).padStart(2, '0'); //Januar je 0!
    var yyyy = yesterday.getFullYear();
    datum = yyyy + '/' + mm + '/' + dd;
    
    return datum;
    
  }

const prviDanuSedmici = (datum) => //funkcija vraca prvi dan u sedmici u kojo je taj datum
  {
    let datumNovi = new Date(datum);
    let brojIteracija = datumNovi.getDay()-1;  
    if(brojIteracija==-1)
    brojIteracija=6;
    while(brojIteracija!=0)
    {
      datum=prethodniDan(datum);
      brojIteracija--;
    }
    return datum;
  }

app.get('/addZabiljeska/:Zabiljeska/:idStudent/:idGrupaTermina/:ispit',function(req,res)
{    
    var newID = parseInt(new Date().getTime().toString().substring(4));

    db.zabiljeska.findOne({idZabiljeska:newID,naziv:req.params.Zabiljeska,idStudent:req.params.idStudent}).then(function(kd){
        if(kd==null)
        {            
    
    db.zabiljeska.create({idZabiljeska:newID,naziv:req.params.Zabiljeska,idStudent:req.params.idStudent}).then(function(k){            
        console.log(req.params.ispit); 
        var isTrueSet = (req.params.ispit == 'true');  
        if(isTrueSet)
            {
                db.ispitZabiljeska.create({idIspitZabiljeska:newID,idIspit:req.params.idGrupaTermina,idZabiljeska:k.idZabiljeska}).then(function(link){
                    var jsonString;
                    if(k!=null && link!=null)
                    {
                        jsonString=
                        {
                            success:true
                        }            
                    }
                    else
                    {
                        jsonString=
                        {
                            success:false
                        }
                    }
                    res.writeHead(200, {'Content-Type': 'application/json'});        
                    res.end(JSON.stringify(jsonString));                    
                });
            }
            else
            {
                db.grupaZabiljeska.create({idGrupaZabiljeska:newID,idGrupaTermina:req.params.idGrupaTermina,idZabiljeska:k.idZabiljeska}).then(function(link){
                    
                    var jsonString;
                    if(k!=null && link!=null)
                    {
                        jsonString=
                        {
                            success:true
                        }            
                    }
                    else
                    {
                        jsonString=
                        {
                            success:false
                        }
                    }
                    res.writeHead(200, {'Content-Type': 'application/json'});        
                    res.end(JSON.stringify(jsonString));
                });                
            }           
        });
    }
    else
    {
        axios({
            method:'get',
            url:'http://localhost:3001/updateZabiljeska'+'/'+req.params.Zabiljeska+'/'+req.params.idStudent+'/'+req.params.idGrupaTermina+'/'+req.params.ispit,
            responseType:'json'
          })
            .then(function (response) {
              res.writeHead(200, {'Content-Type': 'application/json'});        
              res.end(JSON.stringify(response));
              console.log(response);
             }); 
    }
    });   
})


app.get('/updateZabiljeska/:Zabiljeska/:idStudent/:idGrupaTermina/:ispit',function(req,res)
{
    var isTrueSet = (req.params.ispit == 'true'); 
    var jsonString={};
    jsonString=
    {
       success:false
    }  
    if(isTrueSet)
    {
        db.ispitZabiljeska.findAll({where:{idIspit:req.params.idGrupaTermina}}).then(function(linkovaneZabiljeskeIspit){
            db.zabiljeska.findAll({where:{idStudent:req.params.idStudent}}).then(function(linkovaneZabiljeskeStudent){
                var trazeniID="";
                if(linkovaneZabiljeskeStudent && linkovaneZabiljeskeIspit)
                {
                    for(var iii=0;iii<linkovaneZabiljeskeStudent.length;iii++)
                    {
                        for(var jjj=0;jjj<linkovaneZabiljeskeIspit.length;jjj++)
                        {
                            if(linkovaneZabiljeskeStudent[iii].idZabiljeska==linkovaneZabiljeskeIspit[jjj].idZabiljeska)
                            {   
                                db.zabiljeska.update({
                                    naziv: req.params.Zabiljeska,
                                }, {
                                    where: {
                                        idZabiljeska:linkovaneZabiljeskeStudent[iii].idZabiljeska
                                      }
                                    }
                                ).then(function(zabiljeska){
                                    if(zabiljeska.naziv==req.params.Zabiljeska)
                                    {
                                      jsonString=
                                      {
                                         success:true
                                      } 
                                    }
                                    res.writeHead(200, {'Content-Type': 'application/json'});        
                                    res.end(JSON.stringify(jsonString));
                                });
                                
                                iii=linkovaneZabiljeskeStudent.length;
                                jjj=linkovaneZabiljeskeIspit.length;
                            }  
                        } 
                    }
                }
                else
                {
                    res.writeHead(200, {'Content-Type': 'application/json'});        
                    res.end(JSON.stringify(jsonString));
                }
            });
        });
    }
    else
    {
        db.grupaZabiljeska.findAll({where:{idGrupaTermina:req.params.idGrupaTermina}}).then(function(linkovaneZabiljeskeGrupa){
            db.zabiljeska.findAll({where:{idStudent:req.params.idStudent}}).then(function(linkovaneZabiljeskeStudent){
                var biljeskica="";
                if(linkovaneZabiljeskeGrupa && linkovaneZabiljeskeStudent)
                {                    
                    for(var iii=0;iii<linkovaneZabiljeskeStudent.length;iii++)
                    {
                        for(var jjj=0;jjj<linkovaneZabiljeskeGrupa.length;jjj++)
                        {
                            if(linkovaneZabiljeskeStudent[iii].idZabiljeska==linkovaneZabiljeskeGrupa[jjj].idZabiljeska)
                            {   
                                db.zabiljeska.update({
                                    naziv: req.params.Zabiljeska,
                                }, {
                                    where: {
                                        idZabiljeska:linkovaneZabiljeskeStudent[iii].idZabiljeska
                                      }
                                    }
                                ).then(function(zabiljeska){
                                    if(zabiljeska.naziv==req.params.Zabiljeska)
                                    {
                                      jsonString=
                                      {
                                         success:true
                                      } 
                                    }
                                    res.writeHead(200, {'Content-Type': 'application/json'});        
                                    res.end(JSON.stringify(jsonString));
                                });                                
                                iii=linkovaneZabiljeskeStudent.length;
                                jjj=linkovaneZabiljeskeGrupa.length;
                            }   
                        } 
                    }    
                }
                else
                {
                    res.writeHead(200, {'Content-Type': 'application/json'});        
                    res.end(JSON.stringify(jsonString));
                }
            });
        });
    }
})
app.get('/deleteZabiljeska/:idStudent/:idGrupaTermina/:ispit',function(req,res){
    var isTrueSet = (req.params.ispit == 'true'); 
    var jsonString={};
    jsonString=
    {
       success:false
    }  
    if(isTrueSet)
    {
        db.ispitZabiljeska.findAll({where:{idIspit:req.params.idGrupaTermina}}).then(function(linkovaneZabiljeskeIspit){
            db.zabiljeska.findAll({where:{idStudent:req.params.idStudent}}).then(function(linkovaneZabiljeskeStudent){
                var trazeniID="";
                if(linkovaneZabiljeskeStudent && linkovaneZabiljeskeIspit)
                {
                    for(var iii=0;iii<linkovaneZabiljeskeStudent.length;iii++)
                    {
                        for(var jjj=0;jjj<linkovaneZabiljeskeIspit.length;jjj++)
                        {
                            if(linkovaneZabiljeskeStudent[iii].idZabiljeska==linkovaneZabiljeskeIspit[jjj].idZabiljeska)
                            {   
                                db.zabiljeska.update({
                                    naziv: "",
                                }, {
                                    where: {
                                        idZabiljeska:linkovaneZabiljeskeStudent[iii].idZabiljeska
                                      }
                                    }
                                ).then(function(zabiljeska){
                                    if(zabiljeska.naziv=="")
                                    {
                                      jsonString=
                                      {
                                         success:true
                                      } 
                                    }
                                    res.writeHead(200, {'Content-Type': 'application/json'});        
                                    res.end(JSON.stringify(jsonString));
                                });
                                
                                iii=linkovaneZabiljeskeStudent.length;
                                jjj=linkovaneZabiljeskeIspit.length;
                            }  
                        } 
                    }
                }
                else
                {
                    res.writeHead(200, {'Content-Type': 'application/json'});        
                    res.end(JSON.stringify(jsonString));
                }
            });
        });
    }
    else
    {
        db.grupaZabiljeska.findAll({where:{idGrupaTermina:req.params.idGrupaTermina}}).then(function(linkovaneZabiljeskeGrupa){
            db.zabiljeska.findAll({where:{idStudent:req.params.idStudent}}).then(function(linkovaneZabiljeskeStudent){
                var biljeskica="";
                if(linkovaneZabiljeskeGrupa && linkovaneZabiljeskeStudent)
                {                    
                    for(var iii=0;iii<linkovaneZabiljeskeStudent.length;iii++)
                    {
                        for(var jjj=0;jjj<linkovaneZabiljeskeGrupa.length;jjj++)
                        {
                            if(linkovaneZabiljeskeStudent[iii].idZabiljeska==linkovaneZabiljeskeGrupa[jjj].idZabiljeska)
                            {   
                                db.zabiljeska.update({
                                    naziv: "",
                                }, {
                                    where: {
                                        idZabiljeska:linkovaneZabiljeskeStudent[iii].idZabiljeska
                                      }
                                    }
                                ).then(function(zabiljeska){
                                    if(zabiljeska.naziv=="")
                                    {
                                      jsonString=
                                      {
                                         success:true
                                      } 
                                    }
                                    res.writeHead(200, {'Content-Type': 'application/json'});        
                                    res.end(JSON.stringify(jsonString));
                                });
                                
                                iii=linkovaneZabiljeskeStudent.length;
                                jjj=linkovaneZabiljeskeGrupa.length;
                            }   
                        } 
                    }    
                }
                else
                {
                    res.writeHead(200, {'Content-Type': 'application/json'});        
                    res.end(JSON.stringify(jsonString));
                }
            });
        });       
    }

});
/*
app.post('/deleteZabiljeska/:idTermin/:idStudent',function(req,res)
{
   
})

app.get('/getTermini/:idStudent',function(req,res)
{
    Radi se
})

app.get('/getGrupe',function(req,res)
{
   
})

app.post('/deleteGrupa/:idGrupe',function(req,res)
{
   
})

*/


app.get('/getTermini/sala/:idSale',function(req,res)
{
    var idSale= parseInt(req.params.idSale);
    idSale = 1;

    
    var jsonString=new Array();
    db.grupaTermina.findAll().then(function(spisakTerminaDB){
        var velicinaTermina=spisakTerminaDB.length-1;
        var iVarTermin=-1;
        if(spisakTerminaDB.length==0)
        {
            res.writeHead(200, {'Content-Type': 'application/json'});        
            res.end(JSON.stringify(jsonString));             
        }
        else
        {
            spisakTerminaDB.forEach(termin => {                 
                db.predmet.findOne({where:{id:termin.idPredmet}}).then(function(linkaniPredmetTermin){
                    db.korisnik.findOne({where:{id:termin.idPredavac}}).then(function(linkovaniPredavac){ 
                        db.kabinet.findOne({where:{idKabinet:termin.idKabinet}}).then(function(linkovaniKabinet){ 
                            db.grupaZabiljeska.findAll({where:{idGrupaTermina:termin.idGrupaTermina}}).then(function(linkovaneZabiljeskeGrupa){
                                db.zabiljeska.findAll({where:{idStudent:idStudenta}}).then(function(linkovaneZabiljeskeStudent){
                                    var biljeskica="";
                                    if(linkovaneZabiljeskeGrupa && linkovaneZabiljeskeStudent)
                                    {
                                        
                                        for(var iii=0;iii<linkovaneZabiljeskeStudent.length;iii++)
                                        {
                                            for(var jjj=0;jjj<linkovaneZabiljeskeGrupa.length;jjj++)
                                            {
                                                if(linkovaneZabiljeskeStudent[iii].idZabiljeska==linkovaneZabiljeskeGrupa[jjj].idZabiljeska)
                                                {
                                                    
                                                    biljeskica=linkovaneZabiljeskeStudent[iii].naziv;
                                                    iii=linkovaneZabiljeskeStudent.length;
                                                    jjj=linkovaneZabiljeskeGrupa.length;
                                                }  
                                            } 
                                        }

                                    }
                                    


                                    var datumce = new Date();
                                    var dd = String(datumce.getDate()).padStart(2, '0');
                                    var mm = String(datumce.getMonth() + 1).padStart(2, '0'); //Januar je 0!
                                    var yyyy = datumce.getFullYear();
                                    datumce = yyyy + '/' + mm + '/' + dd;
                                    datumce = prviDanuSedmici(datumce);
                                    for(var ii=1;ii<termin.danUSedmici;ii++)
                                    {
                                        datumce=sljedeciDan(datumce);
                                    }
                
                                    jsonString.push(
                                        {
                                            id:termin.idGrupaTermina,
                                            title:termin.naziv,
                                            predmet:linkaniPredmetTermin.naziv,
                                            datum:datumce,
                                            vrijeme:termin.vrijeme,
                                            sala:linkovaniKabinet.namjena,
                                            trajanje:termin.trajanje,
                                            predavac:linkovaniPredavac.ime + ' ' + linkovaniPredavac.prezime,
                                            biljeska:biljeskica,
                                            ispit:false
                                        }
                                    );
                                    iVarTermin++; 
                                    if(iVarTermin==velicinaTermina)
                                    {
                                        res.writeHead(200, {'Content-Type': 'application/json'});        
                                        res.end(JSON.stringify(jsonString));                         
                                    }
                                });
                            });
                        });
                    });
                });                                       
            });    
        }            
    });    

    res.writeHead(200, {'Content-Type': 'application/json'});        
    res.end(JSON.stringify(jsonString));  
});

app.get('/getIspiti/sala/:idSale',function(req,res)
{
    var jsonString=new Array();

    res.writeHead(200, {'Content-Type': 'application/json'});        
    res.end(JSON.stringify(jsonString));     

});



app.get('/getTermini/:idStudenta',function(req,res)
{
    //ruta vraca sedmicne termine za odredjenog studenta

    // pretpostavljamo da je id studenta 1
    // kad se sredi autorizacija i autentikacija promijenicemo
    var idStudenta = parseInt(req.params.idStudenta);
    idStudenta = 1;

    var jsonString=new Array();
    db.grupaTermina.findAll().then(function(spisakTerminaDB){
        var velicinaTermina=spisakTerminaDB.length-1;
        var iVarTermin=-1;
        if(spisakTerminaDB.length==0)
        {
            res.writeHead(200, {'Content-Type': 'application/json'});        
            res.end(JSON.stringify(jsonString));             
        }
        else
        {
            spisakTerminaDB.forEach(termin => {                 
                db.predmet.findOne({where:{id:termin.idPredmet}}).then(function(linkaniPredmetTermin){
                    db.korisnik.findOne({where:{id:termin.idPredavac}}).then(function(linkovaniPredavac){ 
                        db.kabinet.findOne({where:{idKabinet:termin.idKabinet}}).then(function(linkovaniKabinet){ 
                            db.grupaZabiljeska.findAll({where:{idGrupaTermina:termin.idGrupaTermina}}).then(function(linkovaneZabiljeskeGrupa){
                                db.zabiljeska.findAll({where:{idStudent:idStudenta}}).then(function(linkovaneZabiljeskeStudent){
                                    var biljeskica="";
                                    if(linkovaneZabiljeskeGrupa && linkovaneZabiljeskeStudent)
                                    {
                                        
                                        for(var iii=0;iii<linkovaneZabiljeskeStudent.length;iii++)
                                        {
                                            for(var jjj=0;jjj<linkovaneZabiljeskeGrupa.length;jjj++)
                                            {
                                                if(linkovaneZabiljeskeStudent[iii].idZabiljeska==linkovaneZabiljeskeGrupa[jjj].idZabiljeska)
                                                {
                                                    
                                                    biljeskica=linkovaneZabiljeskeStudent[iii].naziv;
                                                    iii=linkovaneZabiljeskeStudent.length;
                                                    jjj=linkovaneZabiljeskeGrupa.length;
                                                }  
                                            } 
                                        }

                                    }
                                    


                                    var datumce = new Date();
                                    var dd = String(datumce.getDate()).padStart(2, '0');
                                    var mm = String(datumce.getMonth() + 1).padStart(2, '0'); //Januar je 0!
                                    var yyyy = datumce.getFullYear();
                                    datumce = yyyy + '/' + mm + '/' + dd;
                                    datumce = prviDanuSedmici(datumce);
                                    for(var ii=1;ii<termin.danUSedmici;ii++)
                                    {
                                        datumce=sljedeciDan(datumce);
                                    }
                
                                    jsonString.push(
                                        {
                                            id:termin.idGrupaTermina,
                                            title:termin.naziv,
                                            predmet:linkaniPredmetTermin.naziv,
                                            datum:datumce,
                                            vrijeme:termin.vrijeme,
                                            sala:linkovaniKabinet.namjena,
                                            trajanje:termin.trajanje,
                                            predavac:linkovaniPredavac.ime + ' ' + linkovaniPredavac.prezime,
                                            biljeska:biljeskica,
                                            ispit:false
                                        }
                                    );
                                    iVarTermin++; 
                                    if(iVarTermin==velicinaTermina)
                                    {
                                        res.writeHead(200, {'Content-Type': 'application/json'});        
                                        res.end(JSON.stringify(jsonString));                         
                                    }
                                });
                            });
                        });
                    });
                });                                       
            });    
        }            
    });    
});

app.get('/getIspiti/:idStudenta',function(req,res)
{
    var idStudenta = parseInt(req.params.idStudenta);
    IdStudenta = 1;

    var jsonString=new Array();
    db.ispit.findAll().then(function(spisakIspitaDB){
        var velicinaIspita=spisakIspitaDB.length-1;
        var iVarIspit=-1;
        if(spisakIspitaDB.length==0)
        {
            res.writeHead(200, {'Content-Type': 'application/json'});        
            res.end(JSON.stringify(jsonString));             
        }
        else
        {
            spisakIspitaDB.forEach(ispit => { 
            
                db.predmet.findOne({where:{id:ispit.idPredmet}}).then(function(linkaniPredmetIspit){
                    db.korisnik.findOne({where:{id:ispit.idProfesor}}).then(function(linkovaniPredavac){ 
                        db.ispitZabiljeska.findAll({where:{idIspit:ispit.idIspit}}).then(function(linkovaneZabiljeskeIspit){
                            db.zabiljeska.findAll({where:{idStudent:idStudenta}}).then(function(linkovaneZabiljeskeStudent){
                                var biljeskica="";
                                if(linkovaneZabiljeskeStudent && linkovaneZabiljeskeIspit)
                                {
                                    for(var iii=0;iii<linkovaneZabiljeskeStudent.length;iii++)
                                    {
                                        for(var jjj=0;jjj<linkovaneZabiljeskeIspit.length;jjj++)
                                        {
                                            if(linkovaneZabiljeskeStudent[iii].idZabiljeska==linkovaneZabiljeskeIspit[jjj].idZabiljeska)
                                            {                                                
                                                biljeskica=linkovaneZabiljeskeStudent[iii].naziv;
                                                iii=linkovaneZabiljeskeStudent.length;
                                                jjj=linkovaneZabiljeskeIspit.length;
                                            }  
                                        } 
                                    }
                                }
                                
                                var datumce = ispit.termin;
                                var dd = String(datumce.getDate()).padStart(2, '0');
                                var mm = String(datumce.getMonth() + 1).padStart(2, '0'); //Januar je 0!
                                var yyyy = datumce.getFullYear();
                                datumce = yyyy + '/' + mm + '/' + dd;
        
                                var a = ispit.termin;
                                var vrijemeSati = a.getHours()+":"+a.getMinutes();
                                jsonString.push(
                                    {
                                        id:ispit.idIspit,
                                        title:ispit.tipIspita,
                                        predmet:linkaniPredmetIspit.naziv,
                                        datum:datumce,
                                        vrijeme:vrijemeSati,
                                        sala:ispit.sala,
                                        trajanje:ispit.vrijemeTrajanja,
                                        predavac:linkovaniPredavac.ime + ' ' + linkovaniPredavac.prezime,
                                        biljeska:biljeskica,
                                        ispit:true    
                                    }
                                );
                                iVarIspit++; 
                                if(iVarIspit==velicinaIspita)
                                {
                                    res.writeHead(200, {'Content-Type': 'application/json'});        
                                    res.end(JSON.stringify(jsonString));
                                    
                                }
                            });
                        });
                    });
                });             
            });   
        }             
    });  
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




