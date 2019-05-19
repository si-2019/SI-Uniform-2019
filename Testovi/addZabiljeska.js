// Import the dependencies for testing
var chai = require('chai');
var assert = require('assert');
var chaiHttp = require('chai-http');
// Configure chai
chai.use(chaiHttp);
let should=chai.should();
const BAZ_URL="http://localhost:31920";

describe('Test1 /addZabiljeska/:Zabiljeska/:idStudent/:idGrupaTermina/:ispit',function(done){
    it('Odgovarajuci response',function(done){
        chai.request(BAZ_URL).get('/addZabiljeska/Digitron/1/1/true').end(function(err,res){
            res.should.have.status(200);
            res.should.have.header('Content-Type','application/json');
            done();
        });
    });
});

describe('Test2 /addZabiljeska/:Zabiljeska/:idStudent/:idGrupaTermina/:ispit',function(done){
    it('Sadrzi success field',function(done){
        chai.request(BAZ_URL).get('/addZabiljeska/Digitron/1/1/true').end(function(err,res){
            res.should.have.status(200);
            res.should.have.header('Content-Type','application/json');
            var json = res.body;
            var success = json.success;
            success.should.not.equal(undefined);
            done();
        });
    });
});