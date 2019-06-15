const express = require("express");
const port = process.env.PORT || 31920; 
const app = express();

app.get('/',function(req,res)
{
    var jsonString = "";
    res.writeHead(200, {'Content-Type': 'application/json'});        
    res.end(JSON.stringify(jsonString));
})

app.listen(port, function(){ console.log('server successfully started on port '+port); });

