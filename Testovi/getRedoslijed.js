// Import the dependencies for testing
var chai = require('chai');
var assert = require('assert');
var chaiHttp = require('chai-http');
// Configure chai
chai.use(chaiHttp);
let should=chai.should();
const BAZ_URL="http://localhost:31920";

describe('Test1 /getRedoslijed',function(done){
    it('Odgovarajuci response',function(done){
        chai.request(BAZ_URL).get('/getRedoslijed').end(function(err,res){
            res.should.have.status(200);
            res.should.have.header('Content-Type','application/json');
            done();
        });
    });
});

describe('Test2 /getRedoslijed',function(done){
    it('Sadrzi id field',function(done){
        chai.request(BAZ_URL).get('/getRedoslijed').end(function(err,res){
            res.should.have.status(200);
            res.should.have.header('Content-Type','application/json');            
            var json = res.body;
            var id = json.id;
            id.should.not.equal(undefined);
            done();
        });
    });
});

describe('Test3 /getRedoslijed',function(done){
    it('Sadrzi naziv field',function(done){
        chai.request(BAZ_URL).get('/getRedoslijed').end(function(err,res){
            res.should.have.status(200);
            res.should.have.header('Content-Type','application/json');            
            var json = res.body;
            var naziv = json.naziv;
            naziv.should.not.equal(undefined);
            done();
        });
    });
});