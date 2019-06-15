var express = require('express');
const port = process.env.PORT || 3000; 
var app = express();

app.get('/',function(req,res)
{
    var jsonString = "";
    res.writeHead(200, {'Content-Type': 'application/json'});        
    res.end(JSON.stringify(jsonString));
})

app.listen(port, function(){ console.log('server successfully started on port '+PORT); });

