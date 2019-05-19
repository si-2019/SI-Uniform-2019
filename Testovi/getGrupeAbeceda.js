// Import the dependencies for testing
var chai = require('chai');
var assert = require('assert');
var chaiHttp = require('chai-http');
// Configure chai
chai.use(chaiHttp);
let should=chai.should();
const BAZ_URL="http://localhost:31920";

describe('Test1 getGrupeAbeceda/:idPredmet',function(done){
    it('Odgovarajuci response',function(done){
        chai.request(BAZ_URL).get('/getGrupeAbeceda/4').end(function(err,res){
            res.should.have.status(200);
            res.should.have.header('Content-Type','application/json');
            done();
        });
    });
});

describe('Test2 getGrupeAbeceda/:idPredmet',function(done){
    it('JSON sadrzi field idGrupaTermina',function(done){
        chai.request(BAZ_URL).get('/getGrupeAbeceda/4').end(function(err,res){
            res.should.have.status(200);
            res.should.have.header('Content-Type','application/json');
            var nizResponse = res.body;
            if(nizResponse.length>0)
            {
                var field = nizResponse[0].idGrupaTermina;
                field.should.not.equal(undefined);
            }
            done();
        });
    });
});

describe('Test3 getGrupeAbeceda/:idPredmet',function(done){
    it('JSON sadrzi field kabinet',function(done){
        chai.request(BAZ_URL).get('/getGrupeAbeceda/4').end(function(err,res){
            res.should.have.status(200);
            res.should.have.header('Content-Type','application/json');
            var nizResponse = res.body;
            if(nizResponse.length>0)
            {
                var field = nizResponse[0].kabinet;
                field.should.not.equal(undefined);
            }
            done();
        });
    });
});

describe('Test4 getGrupeAbeceda/:idPredmet',function(done){
    it('JSON sadrzi field predmet',function(done){
        chai.request(BAZ_URL).get('/getGrupeAbeceda/4').end(function(err,res){
            res.should.have.status(200);
            res.should.have.header('Content-Type','application/json');
            var nizResponse = res.body;
            if(nizResponse.length>0)
            {
                var field = nizResponse[0].predmet;
                field.should.not.equal(undefined);
            }
            done();
        });
    });
});

describe('Test5 getGrupeAbeceda/:idPredmet',function(done){
    it('JSON sadrzi field naziv',function(done){
        chai.request(BAZ_URL).get('/getGrupeAbeceda/4').end(function(err,res){
            res.should.have.status(200);
            res.should.have.header('Content-Type','application/json');
            var nizResponse = res.body;
            if(nizResponse.length>0)
            {
                var field = nizResponse[0].naziv;
                field.should.not.equal(undefined);
            }
            done();
        });
    });
});

describe('Test6 getGrupeAbeceda/:idPredmet',function(done){
    it('JSON sadrzi field danUSedmici',function(done){
        chai.request(BAZ_URL).get('/getGrupeAbeceda/4').end(function(err,res){
            res.should.have.status(200);
            res.should.have.header('Content-Type','application/json');
            var nizResponse = res.body;
            if(nizResponse.length>0)
            {
                var field = nizResponse[0].danUSedmici;
                field.should.not.equal(undefined);
            }
            done();
        });
    });
});

describe('Test7 getGrupeAbeceda/:idPredmet',function(done){
    it('JSON sadrzi field vrijeme',function(done){
        chai.request(BAZ_URL).get('/getGrupeAbeceda/4').end(function(err,res){
            res.should.have.status(200);
            res.should.have.header('Content-Type','application/json');
            var nizResponse = res.body;
            if(nizResponse.length>0)
            {
                var field = nizResponse[0].vrijeme;
                field.should.not.equal(undefined);
            }
            done();
        });
    });
});

describe('Test8 getGrupeAbeceda/:idPredmet',function(done){
    it('JSON sadrzi field trajanje',function(done){
        chai.request(BAZ_URL).get('/getGrupeAbeceda/4').end(function(err,res){
            res.should.have.status(200);
            res.should.have.header('Content-Type','application/json');
            var nizResponse = res.body;
            if(nizResponse.length>0)
            {
                var field = nizResponse[0].trajanje;
                field.should.not.equal(undefined);
            }
            done();
        });
    });
});

describe('Test9 getGrupeAbeceda/:idPredmet',function(done){
    it('JSON sadrzi field kapacitet',function(done){
        chai.request(BAZ_URL).get('/getGrupeAbeceda/4').end(function(err,res){
            res.should.have.status(200);
            res.should.have.header('Content-Type','application/json');
            var nizResponse = res.body;
            if(nizResponse.length>0)
            {
                var field = nizResponse[0].kapacitet;
                field.should.not.equal(undefined);
            }
            done();
        });
    });
});

describe('Test10 getGrupeAbeceda/:idPredmet',function(done){
    it('JSON sadrzi field studenti',function(done){
        chai.request(BAZ_URL).get('/getGrupeAbeceda/4').end(function(err,res){
            res.should.have.status(200);
            res.should.have.header('Content-Type','application/json');
            var nizResponse = res.body;
            if(nizResponse.length>0)
            {
                var field = nizResponse[0].studenti;
                field.should.not.equal(undefined);
            }
            done();
        });
    });
});

describe('Test11 getGrupeAbeceda/:idPredmet',function(done){
    it('JSON sadrzi field rokPrijave',function(done){
        chai.request(BAZ_URL).get('/getGrupeAbeceda/4').end(function(err,res){
            res.should.have.status(200);
            res.should.have.header('Content-Type','application/json');
            var nizResponse = res.body;
            if(nizResponse.length>0)
            {
                var field = nizResponse[0].rokPrijave;
                field.should.not.equal(undefined);
            }
            done();
        });
    });
});