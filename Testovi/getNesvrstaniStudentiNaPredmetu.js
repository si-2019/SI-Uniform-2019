// Import the dependencies for testing
var chai = require('chai');
var assert = require('assert');
var chaiHttp = require('chai-http');
// Configure chai
chai.use(chaiHttp);
let should=chai.should();
const BAZ_URL="http://localhost:31920";

describe('Test1 /getNesvrstaniStudentiNaPredmetu/:idPredmet',function(done){
    it('Odgovarajuci response',function(done){
        chai.request(BAZ_URL).get('/getNesvrstaniStudentiNaPredmetu/4').end(function(err,res){
            res.should.have.status(200);
            res.should.have.header('Content-Type','application/json');
            done();
        });
    });
});

describe('Test2 /getNesvrstaniStudentiNaPredmetu/:idPredmet',function(done){
    it('JSON sadrzi field idStudent',function(done){
        chai.request(BAZ_URL).get('/getNesvrstaniStudentiNaPredmetu/4').end(function(err,res){
            res.should.have.status(200);
            res.should.have.header('Content-Type','application/json');
            var nizResponse = res.body;
            if(nizResponse.length>0)
            {
                var field = nizResponse[0].idStudent;
                field.should.not.equal(undefined);
            }
            done();
        });
    });
});

describe('Test3 /getNesvrstaniStudentiNaPredmetu/:idPredmet',function(done){
    it('JSON sadrzi field imePrezime',function(done){
        chai.request(BAZ_URL).get('/getNesvrstaniStudentiNaPredmetu/4').end(function(err,res){
            res.should.have.status(200);
            res.should.have.header('Content-Type','application/json');
            var nizResponse = res.body;
            if(nizResponse.length>0)
            {
                var field = nizResponse[0].imePrezime;
                field.should.not.equal(undefined);
            }
            done();
        });
    });
});