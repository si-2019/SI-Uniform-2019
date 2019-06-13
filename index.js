var express = require('express');
var path = require('path');
var fs = require('fs');
var pug = require('pug');
var bodyParser = require('body-parser');
var upload = require('express-fileupload');
var cors = require('cors');
const db = require('./models/db.js');
var axios=require('axios');
const swagger_document=require('./swagger-document.js');
var PORT = process.env.PORT || 31920;

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
    var isTrueSet = (req.params.ispit.toString() == 'true');
    
    db.zabiljeska.findOne({where:{idZabiljeska:newID,naziv:req.params.Zabiljeska,idStudent:req.params.idStudent}}).then(function(kd){
        if(kd==null)
        {  
             
    
    db.zabiljeska.create({idZabiljeska:newID,naziv:req.params.Zabiljeska,idStudent:req.params.idStudent}).then(function(k){            
          
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
                }).catch(function(){
                    res.writeHead(200, {'Content-Type': 'application/json'});        
                    res.end(JSON.stringify({success:false}));
                })
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
                }).catch(function(){
                    res.writeHead(200, {'Content-Type': 'application/json'});        
                    res.end(JSON.stringify({success:false}));
                }); 
                               
            }           
        }).catch(function(){
            res.writeHead(200, {'Content-Type': 'application/json'});        
            res.end(JSON.stringify({success:false}));
        });
    }
    else
    {
        axios({
            method:'get',
            url:'http://si2019uniform.herokuapp.com/updateZabiljeska'+'/'+req.params.Zabiljeska+'/'+req.params.idStudent+'/'+req.params.idGrupaTermina+'/'+req.params.ispit,
            responseType:'json'
          })
            .then(function (response) {
              res.writeHead(200, {'Content-Type': 'application/json'});        
              res.end(JSON.stringify(response));
             }).catch(function(){
                res.writeHead(200, {'Content-Type': 'application/json'});        
                res.end(JSON.stringify({success:false}));
            });
            
    }
    
    }).catch(function(){
        res.writeHead(200, {'Content-Type': 'application/json'});        
        res.end(JSON.stringify({success:false}));
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
                if(linkovaneZabiljeskeStudent && linkovaneZabiljeskeIspit && linkovaneZabiljeskeStudent.length>0 && linkovaneZabiljeskeIspit.length>0)
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
                                }).catch(function(){
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
                if(linkovaneZabiljeskeGrupa && linkovaneZabiljeskeStudent && linkovaneZabiljeskeStudent.length>0 && linkovaneZabiljeskeGrupa.length>0)
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
                                }).catch(function(){
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
                if(linkovaneZabiljeskeStudent && linkovaneZabiljeskeIspit && linkovaneZabiljeskeStudent.length>0 && linkovaneZabiljeskeIspit.length>0)
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
                                }).catch(function(){
                                    res.writeHead(200, {'Content-Type': 'application/json'});        
                                    res.end(JSON.stringify(jsonString));
                                })
                                ;
                                
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
                if(linkovaneZabiljeskeGrupa && linkovaneZabiljeskeStudent && linkovaneZabiljeskeStudent.length>0 && linkovaneZabiljeskeGrupa.length>0)
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
                                }).catch(function(){
                                    res.writeHead(200, {'Content-Type': 'application/json'});        
                                    res.end(JSON.stringify({success:false}));
                                })
                                ;
                                
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



app.get('/getStudentTermini/:idStudenta',function(req,res)
{
    //ruta vraca sedmicne termine za odredjenog studenta

    // pretpostavljamo da je id studenta 1
    // kad se sredi autorizacija i autentikacija promijenicemo
    var idStudenta = 1;

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
                                    db.predmet_student.findAll({where:{idStudent:idStudenta,idPredmet:linkaniPredmetTermin.id,ocjena:null,datum_upisa:null}}).then(function(linkPredmetStudent){
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
                                        if(linkPredmetStudent && linkPredmetStudent.length>0)
                                        {
                                            jsonString.push(
                                                { 
                                                    id:termin.idGrupaTermina,
                                                    title:termin.naziv,
                                                    predmet:linkaniPredmetTermin.naziv,
                                                    datum:datumce,
                                                    vrijeme:termin.vrijeme,
                                                    sala:linkovaniKabinet.naziv,
                                                    trajanje:termin.trajanje,
                                                    predavac:linkovaniPredavac.ime + ' ' + linkovaniPredavac.prezime,
                                                    biljeska:biljeskica,
                                                    ispit:false
                                                }
                                            );
                                        }
                                        
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
            });    
        }            
    });    
});

app.get('/getStudentIspiti/:idStudenta',function(req,res)
{
    var idStudenta = 1;

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
                                db.predmet_student.findAll({where:{idStudent:idStudenta,idPredmet:linkaniPredmetIspit.id,ocjena:null,datum_upisa:null}}).then(function(linkPredmetStudent){
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
                                    var datumce;
                                    var a;
                                   
                                    var vrijemeSati;
                                    if(ispit.termin)
                                    {
                                        datumce = ispit.termin;
                                        var dd = String(datumce.getDate()).padStart(2, '0');
                                        var mm = String(datumce.getMonth() + 1).padStart(2, '0'); //Januar je 0!
                                        var yyyy = datumce.getFullYear();
                                        datumce = yyyy + '/' + mm + '/' + dd;
                                        a = ispit.termin;
                                       
                                        
                                        vrijemeSati = String(a.getHours()-2).padStart(2, '0')+':'+ String(a.getMinutes()).padStart(2, '0');
                                    }
                                    else
                                    {
                                        datumce = new Date();
                                        var dd = String(datumce.getDate()).padStart(2, '0');
                                        var mm = String(datumce.getMonth() + 1).padStart(2, '0'); //Januar je 0!
                                        var yyyy = datumce.getFullYear();
                                        datumce = yyyy + '/' + mm + '/' + dd;
    
                                        vrijemeSati='00:00';
                                    }
    
                                    var tipIspita=ispit.tipIspita;
                                    var sala=ispit.sala;
                                    var trajanje=ispit.vrijemeTrajanja;
                                    if(!tipIspita)
                                    tipIspita="";
                                    if(!sala)
                                    sala="";
                                    if(!trajanje)
                                    trajanje="";

                                    if(linkPredmetStudent && linkPredmetStudent.length>0)
                                    {
                                        jsonString.push(
                                            {
                                                id:ispit.idIspit,
                                                title:tipIspita,
                                                predmet:linkaniPredmetIspit.naziv,
                                                datum:datumce,
                                                vrijeme:vrijemeSati,
                                                sala:sala,
                                                trajanje:trajanje,
                                                predavac:linkovaniPredavac.ime + ' ' + linkovaniPredavac.prezime,
                                                biljeska:biljeskica,
                                                ispit:true    
                                            }
                                        );
                                    }
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
            });   
        }             
    });  
});

app.get('/getProfesorTermini/:idProfesor',function(req,res)
{
    //ruta vraca sedmicne termine za odredjenog profesora

    // pretpostavljamo da je id profesora 41
    // kad se sredi autorizacija i autentikacija promijenicemo
    var idProfesora = 41; //Marina Milicevic

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
                                db.zabiljeska.findAll({where:{idStudent:idProfesora}}).then(function(linkovaneZabiljeskeStudent){
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

                                    if(termin.idPredavac==idProfesora)
                                    {
                                        jsonString.push(
                                            { 
                                                id:termin.idGrupaTermina,
                                                title:termin.naziv,
                                                predmet:linkaniPredmetTermin.naziv,
                                                datum:datumce,
                                                vrijeme:termin.vrijeme,
                                                sala:linkovaniKabinet.naziv,
                                                trajanje:termin.trajanje,
                                                predavac:linkovaniPredavac.ime + ' ' + linkovaniPredavac.prezime,
                                                biljeska:biljeskica,
                                                ispit:false
                                            }
                                        );
                                    }
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

app.get('/getProfesorIspiti/:idStudenta',function(req,res)
{
    var idProfesora = 41; //Marina Milicevic

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
                            db.zabiljeska.findAll({where:{idStudent:idProfesora}}).then(function(linkovaneZabiljeskeStudent){
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
                                var datumce;
                                var a;
                               
                                var vrijemeSati;
                                if(ispit.termin)
                                {
                                    datumce = ispit.termin;
                                    var dd = String(datumce.getDate()).padStart(2, '0');
                                    var mm = String(datumce.getMonth() + 1).padStart(2, '0'); //Januar je 0!
                                    var yyyy = datumce.getFullYear();
                                    datumce = yyyy + '/' + mm + '/' + dd;
                                    a = ispit.termin;                                    
                                    vrijemeSati = String(a.getHours()-2).padStart(2, '0')+':'+ String(a.getMinutes()).padStart(2, '0');
                                }
                                else
                                {
                                    datumce = new Date();
                                    var dd = String(datumce.getDate()).padStart(2, '0');
                                    var mm = String(datumce.getMonth() + 1).padStart(2, '0'); //Januar je 0!
                                    var yyyy = datumce.getFullYear();
                                    datumce = yyyy + '/' + mm + '/' + dd;

                                    vrijemeSati='00:00';
                                }

                                var tipIspita=ispit.tipIspita;
                                var sala=ispit.sala;
                                var trajanje=ispit.vrijemeTrajanja;
                                if(!tipIspita)
                                tipIspita="";
                                if(!sala)
                                sala="";
                                if(!trajanje)
                                trajanje="";

                                if(linkaniPredmetIspit.idAsistent==idProfesora || linkaniPredmetIspit.idProfesor==idProfesora)
                                {
                                    jsonString.push(
                                    {
                                        id:ispit.idIspit,
                                        title:tipIspita,
                                        predmet:linkaniPredmetIspit.naziv,
                                        datum:datumce,
                                        vrijeme:vrijemeSati,
                                        sala:sala,
                                        trajanje:trajanje,
                                        predavac:linkovaniPredavac.ime + ' ' + linkovaniPredavac.prezime,
                                        biljeska:biljeskica,
                                        ispit:true    
                                    }
                                );
                                    
                                }
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

app.get('/getTerminiSala/:idStudent/:idKabinet',function(req,res)
{
    //ruta vraca sedmicne termine za odredjenog studenta

    // pretpostavljamo da je id studenta 1
    // kad se sredi autorizacija i autentikacija promijenicemo
    var idStudenta = 1;

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
                                            if(linkovaniKabinet.idKabinet==req.params.idKabinet)
                                            {
                                                jsonString.push(
                                                    { 
                                                        id:termin.idGrupaTermina,
                                                        title:termin.naziv,
                                                        predmet:linkaniPredmetTermin.naziv,
                                                        datum:datumce,
                                                        vrijeme:termin.vrijeme,
                                                        sala:linkovaniKabinet.naziv,
                                                        trajanje:termin.trajanje,
                                                        predavac:linkovaniPredavac.ime + ' ' + linkovaniPredavac.prezime,
                                                        biljeska:biljeskica,
                                                        ispit:false
                                                    }
                                                );
                                            }
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

app.get('/getIspitiSala/:idStudent/:idKabinet',function(req,res)
{
    var idStudenta = 1;

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
                db.kabinet.findOne({where:{naziv:ispit.sala}}).then(function(kabinett){
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
                                        var datumce;
                                        var a;
                                       
                                        var vrijemeSati;
                                        if(ispit.termin)
                                        {
                                            datumce = ispit.termin;
                                            var dd = String(datumce.getDate()).padStart(2, '0');
                                            var mm = String(datumce.getMonth() + 1).padStart(2, '0'); //Januar je 0!
                                            var yyyy = datumce.getFullYear();
                                            datumce = yyyy + '/' + mm + '/' + dd;
                                            a = ispit.termin;
                                           
                                            
                                            vrijemeSati = String(a.getHours()-2).padStart(2, '0')+':'+ String(a.getMinutes()).padStart(2, '0');
                                        }
                                        else
                                        {
                                            datumce = new Date();
                                            var dd = String(datumce.getDate()).padStart(2, '0');
                                            var mm = String(datumce.getMonth() + 1).padStart(2, '0'); //Januar je 0!
                                            var yyyy = datumce.getFullYear();
                                            datumce = yyyy + '/' + mm + '/' + dd;
        
                                            vrijemeSati='00:00';
                                        }
        
                                        var tipIspita=ispit.tipIspita;
                                        var sala=ispit.sala;
                                        var trajanje=ispit.vrijemeTrajanja;
                                        if(!tipIspita)
                                        tipIspita="";
                                        if(!sala)
                                        sala="";
                                        if(!trajanje)
                                        trajanje="";
                                        

                                        if(kabinett!=null && kabinett!=undefined && kabinett.idKabinet==req.params.idKabinet)
                                            {
                                                jsonString.push(
                                                    {
                                                        id:ispit.idIspit,
                                                        title:tipIspita,
                                                        predmet:linkaniPredmetIspit.naziv,
                                                        datum:datumce,
                                                        vrijeme:vrijemeSati,
                                                        sala:sala,
                                                        trajanje:trajanje,
                                                        predavac:linkovaniPredavac.ime + ' ' + linkovaniPredavac.prezime,
                                                        biljeska:biljeskica,
                                                        ispit:true    
                                                    }
                                                );
                                            }
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
            });   
        }             
    });  
});

/////////////////////////////////////////////////////////////////////////////////////////////////

app.get('/getGrupeAbeceda/:idPredmet',function(req,res)
{
    var jsonString=[];
    db.grupaTermina.findAll({where:{idPredmet:req.params.idPredmet}}).then(function(grupe){
        
        if(grupe && grupe.length>0)
        {
            grupe.forEach(grupa => {
                db.kabinet.findOne({where:{idKabinet:grupa.idKabinet}}).then(function(kabinet){
                    db.grupaTermin_student.findAll({where:{idGrupaTermina:grupa.idGrupaTermina}}).then(function(studentiLinkovi){
                        var studentiIndex = 0;
                        
                        var studentiLista=[];
                        if(studentiLinkovi && studentiLinkovi.length>0)
                        {
                            studentiLinkovi.forEach(studentLink => {
                                db.korisnik.findOne({where:{id:studentLink.idStudent}}).then(function(student){
                                   studentiIndex++;
                                   studentiLista.push(
                                   {
                                        idStudent:student.id,
                                        imePrezime:student.ime+" "+student.prezime,
                                        datumPrijave: studentLink.datumPrijave
                                   });
                                   if(studentiIndex==studentiLinkovi.length)
                                   {   
                                        studentiLista.sort(function compare( a, b ) {
                                            if ( a.imePrezime < b.imePrezime ){
                                              return -1;
                                            }
                                            if ( a.imePrezime > b.imePrezime ){
                                              return 1;
                                            }
                                            return 0;
                                        })                                     
                                        jsonString.push(
                                            {
                                                idGrupaTermina:grupa.idGrupaTermina,
                                                kabinet:kabinet.naziv,
                                                naziv:grupa.naziv,
                                                danUSedmici:grupa.danUSedmici,
                                                vrijeme:grupa.vrijeme,
                                                trajanje:grupa.trajanje,
                                                kapacitet:kabinet.kapacitet,
                                                studenti:studentiLista,
                                                rokPrijave: grupa.rokPrijave 
                                            }                                            
                                        );
                                        if(grupe.length==jsonString.length)
                                        {
                                            jsonString.sort(function compare( a, b ) {
                                                if ( a.idGrupaTermina < b.idGrupaTermina ){
                                                  return -1;
                                                }
                                                if ( a.idGrupaTermina > b.idGrupaTermina ){
                                                  return 1;
                                                }
                                                return 0;
                                            })
                                            res.writeHead(200, {'Content-Type': 'application/json'});        
                                            res.end(JSON.stringify(jsonString));
                                        }
                                   }
                                });
                            })
                        }
                        else
                        {
                            jsonString.push(
                                {
                                    idGrupaTermina:grupa.idGrupaTermina,
                                    kabinet:kabinet.naziv,
                                    naziv:grupa.naziv,
                                    danUSedmici:grupa.danUSedmici,
                                    vrijeme:grupa.vrijeme,
                                    trajanje:grupa.trajanje,
                                    kapacitet:kabinet.kapacitet,
                                    studenti:[],
                                    rokPrijave: grupa.rokPrijave  
                                }                                            
                            );

                        }                                                
                    });
                });
            })
        }
        else
        {
            res.writeHead(200, {'Content-Type': 'application/json'});        
            res.end(JSON.stringify(jsonString));
        }
    });
});

app.get('/getGrupePrijavljivanje/:idPredmet',function(req,res)
{
    var jsonString=[];
    db.grupaTermina.findAll({where:{idPredmet:req.params.idPredmet}}).then(function(grupe){
        
        if(grupe && grupe.length>0)
        {
            grupe.forEach(grupa => {
                db.kabinet.findOne({where:{idKabinet:grupa.idKabinet}}).then(function(kabinet){
                    db.grupaTermin_student.findAll({where:{idGrupaTermina:grupa.idGrupaTermina}}).then(function(studentiLinkovi){
                        var studentiIndex = 0;
                        
                        var studentiLista=[];
                        if(studentiLinkovi && studentiLinkovi.length>0)
                        {
                            studentiLinkovi.forEach(studentLink => {
                                db.korisnik.findOne({where:{id:studentLink.idStudent}}).then(function(student){
                                   studentiIndex++;
                                   studentiLista.push(
                                   {
                                        idStudent:student.id,
                                        imePrezime:student.ime+" "+student.prezime,
                                        datumPrijave: studentLink.datumPrijave
                                   });
                                   if(studentiIndex==studentiLinkovi.length)
                                   {   
                                        studentiLista.sort(function compare( a, b ) {
                                            if ( a.datumPrijave < b.datumPrijave ){
                                              return -1;
                                            }
                                            if ( a.datumPrijave > b.datumPrijave ){
                                              return 1;
                                            }
                                            return 0;
                                        })                                     
                                        jsonString.push(
                                            {
                                                idGrupaTermina:grupa.idGrupaTermina,
                                                kabinet:kabinet.naziv,
                                                naziv:grupa.naziv,
                                                danUSedmici:grupa.danUSedmici,
                                                vrijeme:grupa.vrijeme,
                                                trajanje:grupa.trajanje,
                                                kapacitet:kabinet.kapacitet,
                                                studenti:studentiLista,
                                                rokPrijave: grupa.rokPrijave 
                                            }                                            
                                        );
                                        if(grupe.length==jsonString.length)
                                        {
                                            jsonString.sort(function compare( a, b ) {
                                                if ( a.idGrupaTermina < b.idGrupaTermina ){
                                                  return -1;
                                                }
                                                if ( a.idGrupaTermina > b.idGrupaTermina ){
                                                  return 1;
                                                }
                                                return 0;
                                            })
                                            res.writeHead(200, {'Content-Type': 'application/json'});        
                                            res.end(JSON.stringify(jsonString));
                                        }
                                   }
                                });
                            })
                        }
                        else
                        {
                            jsonString.push(
                                {
                                    idGrupaTermina:grupa.idGrupaTermina,
                                    kabinet:kabinet.naziv,
                                    naziv:grupa.naziv,
                                    danUSedmici:grupa.danUSedmici,
                                    vrijeme:grupa.vrijeme,
                                    trajanje:grupa.trajanje,
                                    kapacitet:kabinet.kapacitet,
                                    studenti:[],
                                    rokPrijave: grupa.rokPrijave  
                                }                                            
                            );

                        }                                                
                    });
                });
            })
        }
        else
        {
            res.writeHead(200, {'Content-Type': 'application/json'});        
            res.end(JSON.stringify(jsonString));
        }
    });
});

app.post('/addStudentToGroup/:idLogovanogStudenta/:idGrupaTermina',function(req,res)
{
    var newID = parseInt(new Date().getTime().toString().substring(4));
    var json={
        success:true
    }
    db.grupaTermin_student.create({idGrupaTerminaStudent:newID,idGrupaTermina:req.params.idGrupaTermina,idStudent:req.params.idLogovanogStudenta,datumPrijave:new Date()}).then(function(k){
        res.writeHead(200, {'Content-Type': 'application/json'});        
        res.end(JSON.stringify(json));
    }).catch(function(k){
        res.writeHead(200, {'Content-Type': 'application/json'});        
        res.end(JSON.stringify(json));
    });
});

app.post('/removeStudentFromGroup/:idLogovanogStudenta/:idGrupaTermina',function(req,res)
{
    
    db.grupaTermin_student.destroy({where:{idGrupaTermina:req.params.idGrupaTermina,
        idStudent:req.params.idLogovanogStudenta}}).then(function(k){
            res.writeHead(200, {'Content-Type': 'application/json'});        
            res.end(JSON.stringify(""));    
         
    }).catch(function(k){
        res.writeHead(200, {'Content-Type': 'application/json'});        
        res.end(JSON.stringify(""));    
     
    }); 
});

app.post('/promjenaRoka/:idPredmet/:noviGodina/:noviMjesec/:noviDan',function(req,res)
{
    db.grupaTermina.update({
        rokPrijave: req.params.noviGodina+'-'+req.params.noviMjesec+'-'+req.params.noviDan
    }, {
        where: {
            idPredmet:req.params.idPredmet
          }
        }
    ).then(function(s){
        res.writeHead(200, {'Content-Type': 'application/json'});        
        res.end(JSON.stringify(""));
    }).catch(function(greska){
        res.writeHead(200, {'Content-Type': 'application/json'});        
        res.end(JSON.stringify(""));
    })
});

app.get('/getRedoslijed',function(req,res)
{
    db.redoslijed.findOne({where:{id:"1"}}).then(function(redoslijedic){
        res.writeHead(200, {'Content-Type': 'application/json'});  
        res.end(JSON.stringify(redoslijedic));         
    }); 
});

app.post('/promjenaRedoslijeda',function(req,res)
{
    db.redoslijed.findOne({where:{id:"1"}}).then(function(redoslijedic){
        if(redoslijedic.naziv=="Redoslijed abecede")
        {
            db.redoslijed.update({
                naziv: "Redoslijed prijavljivanja",
            }, {where:{id:"1"}}
            ).then(function(xx){
                res.writeHead(200, {'Content-Type': 'application/json'});        
                res.end(JSON.stringify(""));
            }) 
        }
        if(redoslijedic.naziv=="Redoslijed prijavljivanja")
        {
            db.redoslijed.update({
                naziv: "Redoslijed abecede",
            }, {where:{id:"1"}}
            ).then(function(xx){
                res.writeHead(200, {'Content-Type': 'application/json'});        
                res.end(JSON.stringify(""));
            }) 
        }
               
    }); 
});

app.get('/getPredmet/:idPredmet',function(req,res)
{
    db.predmet.findOne({where:{id:req.params.idPredmet}}).then(function(predmet){
        res.writeHead(200, {'Content-Type': 'application/json'});  
        res.end(JSON.stringify(predmet));         
    }); 
});

app.get('/getNesvrstaniStudentiNaPredmetu/:idPredmet',function(req,res)
{
    var studentiLista=[];    
    db.predmet_student.findAll({where:{idPredmet:req.params.idPredmet,ocjena:null,datum_upisa:null}}).then(function(predmetLinkovi)
    {
        var index=0;
        if(predmetLinkovi && predmetLinkovi.length>0)
        {
            var predmetLinkIndex = 0;
            predmetLinkovi.forEach(predmetLink =>
            {        
                db.korisnik.findOne({where:{id:predmetLink.idStudent}}).then(function(student)            
                {
                    db.grupaTermin_student.findAll({where:{idStudent:predmetLink.idStudent}}).then(function(grupeLinkovi)
                    {                        
                        if(!grupeLinkovi || grupeLinkovi.length==0)
                        {                            
                            studentiLista.push(
                            {
                                 idStudent:student.id,
                                 imePrezime:student.ime+" "+student.prezime
                            });
                        }                        
                        predmetLinkIndex++;
                        if(predmetLinkIndex==predmetLinkovi.length)
                        {  
                            studentiLista.sort(function compare( a, b ) {
                                if ( a.imePrezime < b.imePrezime ){
                                  return -1;
                                }
                                if ( a.imePrezime > b.imePrezime ){
                                  return 1;
                                }
                                return 0;
                            });                      
                            res.writeHead(200, {'Content-Type': 'application/json'});  
                            res.end(JSON.stringify(studentiLista));
                        } 
                    });
                })
            })    
        }
        else
        {
            res.writeHead(200, {'Content-Type': 'application/json'});  
            res.end(JSON.stringify(studentiLista));            
        }   
    }); 
});

app.post('/removeGroup/:idGrupaTermina',function(req,res)
{
    db.grupaTermin_student.destroy({where:{idGrupaTermina:req.params.idGrupaTermina}}).then(function(k){
        db.grupaTermina.destroy({where:{idGrupaTermina:req.params.idGrupaTermina}}).then(function(kk){
            
            res.writeHead(200, {'Content-Type': 'application/json'});  
            res.end(JSON.stringify("")); 
        }).catch(function(kkk){
            
            res.writeHead(200, {'Content-Type': 'application/json'});  
            res.end(JSON.stringify("")); 
        }); 
    }); 
});
app.post("/dodajStudentaRandomGroup/:idStudent",function(req,res)
{
    var json={
        success: true
    }
    db.grupaTermina.findOne({where:{}}).then(function(kk)
    {
        if(kk)
        {
            var newID = parseInt(new Date().getTime().toString().substring(4));
            db.grupaTermin_student.create({idGrupaTerminaStudent:newID,idGrupaTermina:kk.idGrupaTermina,idStudent:req.params.idStudent,datumPrijave:new Date()}).then(function(k){
                res.writeHead(200, {'Content-Type': 'application/json'});  
                res.end(JSON.stringify(json)); 
            }); 
        }
        else
        {
            res.writeHead(200, {'Content-Type': 'application/json'});  
            res.end(JSON.stringify(json));
        }
       
    })
});

swagger_document(app);

app.listen(PORT, function(){ console.log('server successfully started on port '+PORT); });



