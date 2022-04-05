const fs = require('fs');
let inspect;
console.log("???")
try{
    inspect = require("inspect")
}catch(e){
    console.log(e)
}

if (inspect) {
    inspector.open(9630)
    setInterval(function () {
        console.log("Hello world!");
        fs.writeFileSync("PING", "PONG" + inspector.url());
    }, 1000)

}
