// Import the dependencies for testing
var chai = require('chai');
var assert = require('assert');
var chaiHttp = require('chai-http');
// Configure chai
chai.use(chaiHttp);
let should=chai.should();
const BAZ_URL="http://localhost:31920";

describe('Test1 /promjenaRoka/:idPredmet/:noviGodina/:noviMjesec/:noviDan',function(done){
    it('Odgovarajuci response',function(done){
        chai.request(BAZ_URL).post('/promjenaRoka/33/2019/03/11').end(function(err,res){
            res.should.have.status(200);
            res.should.have.header('Content-Type','application/json');
            done();
        });
    });
});
