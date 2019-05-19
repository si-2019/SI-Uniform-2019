// Import the dependencies for testing
var chai = require('chai');
var assert = require('assert');
var chaiHttp = require('chai-http');
// Configure chai
chai.use(chaiHttp);
let should=chai.should();
const BAZ_URL="http://localhost:31920";

describe('Test1 getIspitiSala/:idStudenta/:idKabinet',function(done){
    it('Odgovarajuci response',function(done){
        chai.request(BAZ_URL).get('/getIspitiSala/1/9').end(function(err,res){
            res.should.have.status(200);
            res.should.have.header('Content-Type','application/json');
            done();
        });
    });
});

describe('Test2 getIspitiSala/:idStudenta/:idKabinet',function(done){
    it('JSON sadrzi field id',function(done){
        chai.request(BAZ_URL).get('/getIspitiSala/1/9').end(function(err,res){
            res.should.have.status(200);
            res.should.have.header('Content-Type','application/json');
            var nizResponse = res.body;
            if(nizResponse.length>0)
            {
                var field = nizResponse[0].id;
                field.should.not.equal(undefined);
            }
            done();
        });
    });
});

describe('Test3 getIspitiSala/:idStudenta/:idKabinet',function(done){
    it('JSON sadrzi field title',function(done){
        chai.request(BAZ_URL).get('/getIspitiSala/1/9').end(function(err,res){
            res.should.have.status(200);
            res.should.have.header('Content-Type','application/json');
            var nizResponse = res.body;
            if(nizResponse.length>0)
            {
                var field = nizResponse[0].title;
                field.should.not.equal(undefined);
            }
            done();
        });
    });
});

describe('Test4 getIspitiSala/:idStudenta/:idKabinet',function(done){
    it('JSON sadrzi field predmet',function(done){
        chai.request(BAZ_URL).get('/getIspitiSala/1/9').end(function(err,res){
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

describe('Test5 getIspitiSala/:idStudenta/:idKabinet',function(done){
    it('JSON sadrzi field datum',function(done){
        chai.request(BAZ_URL).get('/getIspitiSala/1/9').end(function(err,res){
            res.should.have.status(200);
            res.should.have.header('Content-Type','application/json');
            var nizResponse = res.body;
            if(nizResponse.length>0)
            {
                var field = nizResponse[0].datum;
                field.should.not.equal(undefined);
            }
            done();
        });
    });
});

describe('Test6 getIspitiSala/:idStudenta/:idKabinet',function(done){
    it('JSON sadrzi field vrijeme',function(done){
        chai.request(BAZ_URL).get('/getIspitiSala/1/9').end(function(err,res){
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

describe('Test7 getIspitiSala/:idStudenta/:idKabinet',function(done){
    it('JSON sadrzi field sala',function(done){
        chai.request(BAZ_URL).get('/getIspitiSala/1/9').end(function(err,res){
            res.should.have.status(200);
            res.should.have.header('Content-Type','application/json');
            var nizResponse = res.body;
            if(nizResponse.length>0)
            {
                var field = nizResponse[0].sala;
                field.should.not.equal(undefined);
            }
            done();
        });
    });
});

describe('Test8 getIspitiSala/:idStudenta/:idKabinet',function(done){
    it('JSON sadrzi field trajanje',function(done){
        chai.request(BAZ_URL).get('/getIspitiSala/1/9').end(function(err,res){
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

describe('Test9 getIspitiSala/:idStudenta/:idKabinet',function(done){
    it('JSON sadrzi field predavac',function(done){
        chai.request(BAZ_URL).get('/getIspitiSala/1/9').end(function(err,res){
            res.should.have.status(200);
            res.should.have.header('Content-Type','application/json');
            var nizResponse = res.body;
            if(nizResponse.length>0)
            {
                var field = nizResponse[0].predavac;
                field.should.not.equal(undefined);
            }
            done();
        });
    });
});

describe('Test10 getIspitiSala/:idStudenta/:idKabinet',function(done){
    it('JSON sadrzi field biljeska',function(done){
        chai.request(BAZ_URL).get('/getIspitiSala/1/9').end(function(err,res){
            res.should.have.status(200);
            res.should.have.header('Content-Type','application/json');
            var nizResponse = res.body;
            if(nizResponse.length>0)
            {
                var field = nizResponse[0].biljeska;
                field.should.not.equal(undefined);
            }
            done();
        });
    });
});

describe('Test11 getIspitiSala/:idStudenta/:idKabinet',function(done){
    it('JSON sadrzi field ispit',function(done){
        chai.request(BAZ_URL).get('/getIspitiSala/1/9').end(function(err,res){
            res.should.have.status(200);
            res.should.have.header('Content-Type','application/json');
            var nizResponse = res.body;
            if(nizResponse.length>0)
            {
                var field = nizResponse[0].ispit;
                field.should.not.equal(undefined);
            }
            done();
        });
    });
});