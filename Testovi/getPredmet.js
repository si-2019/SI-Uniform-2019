// Import the dependencies for testing
var chai = require('chai');
var assert = require('assert');
var chaiHttp = require('chai-http');
// Configure chai
chai.use(chaiHttp);
let should=chai.should();
const BAZ_URL="http://localhost:31920";

describe('Test1 getPredmet',function(done){
    it('Odgovarajuci response',function(done){
        chai.request(BAZ_URL).get('/getPredmet/4').end(function(err,res){
            res.should.have.status(200);
            res.should.have.header('Content-Type','application/json');
            done();
        });
    });
});

describe('Test2 getPredmet',function(done){
    it('JSON sadrzi field id',function(done){
        chai.request(BAZ_URL).get('/getPredmet/4').end(function(err,res){
            res.should.have.status(200);
            res.should.have.header('Content-Type','application/json');
            var nizResponse = res.body;
            if(nizResponse)
            {
                var field = nizResponse.id;
                field.should.not.equal(undefined);
            }
            done();
        });
    });
});

describe('Test3 getPredmet',function(done){
    it('JSON sadrzi field idAsistent',function(done){
        chai.request(BAZ_URL).get('/getPredmet/4').end(function(err,res){
            res.should.have.status(200);
            res.should.have.header('Content-Type','application/json');
            var nizResponse = res.body;
            if(nizResponse)
            {
                var field = nizResponse.idAsistent;
                field.should.not.equal(undefined);
            }
            done();
        });
    });
});

describe('Test4 getPredmet',function(done){
    it('JSON sadrzi field idProfesor',function(done){
        chai.request(BAZ_URL).get('/getPredmet/4').end(function(err,res){
            res.should.have.status(200);
            res.should.have.header('Content-Type','application/json');
            var nizResponse = res.body;
            if(nizResponse>0)
            {
                var field = nizResponse.idProfesor;
                field.should.not.equal(undefined);
            }
            done();
        });
    });
});

describe('Test5 getPredmet',function(done){
    it('JSON sadrzi field naziv',function(done){
        chai.request(BAZ_URL).get('/getPredmet/4').end(function(err,res){
            res.should.have.status(200);
            res.should.have.header('Content-Type','application/json');
            var nizResponse = res.body;
            if(nizResponse>0)
            {
                var field = nizResponse.naziv;
                field.should.not.equal(undefined);
            }
            done();
        });
    });
});

describe('Test6 getPredmet',function(done){
    it('JSON sadrzi field ects',function(done){
        chai.request(BAZ_URL).get('/getPredmet/4').end(function(err,res){
            res.should.have.status(200);
            res.should.have.header('Content-Type','application/json');
            var nizResponse = res.body;
            if(nizResponse>0)
            {
                var field = nizResponse.ects;
                field.should.not.equal(undefined);
            }
            done();
        });
    });
});

describe('Test7 getPredmet',function(done){
    it('JSON sadrzi field brojPredavanja',function(done){
        chai.request(BAZ_URL).get('/getPredmet/4').end(function(err,res){
            res.should.have.status(200);
            res.should.have.header('Content-Type','application/json');
            var nizResponse = res.body;
            if(nizResponse>0)
            {
                var field = nizResponse.brojPredavanja;
                field.should.not.equal(undefined);
            }
            done();
        });
    });
});

describe('Test8 getPredmet',function(done){
    it('JSON sadrzi field brojVjezbi',function(done){
        chai.request(BAZ_URL).get('/getPredmet/4').end(function(err,res){
            res.should.have.status(200);
            res.should.have.header('Content-Type','application/json');
            var nizResponse = res.body;
            if(nizResponse>0)
            {
                var field = nizResponse.brojVjezbi;
                field.should.not.equal(undefined);
            }
            done();
        });
    });
});

describe('Test9 getPredmet',function(done){
    it('JSON sadrzi field opis',function(done){
        chai.request(BAZ_URL).get('/getPredmet/4').end(function(err,res){
            res.should.have.status(200);
            res.should.have.header('Content-Type','application/json');
            var nizResponse = res.body;
            if(nizResponse>0)
            {
                var field = nizResponse.opis;
                field.should.not.equal(undefined);
            }
            done();
        });
    });
});
