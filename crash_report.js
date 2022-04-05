const http=require("http")
http.createServer(function(req,res){
let data="";
req.on("data",function(chunk){data+=chunk;})
req.on("end",function(){console.log(data)})
}).listen(5283);