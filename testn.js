let launch = require("./new-launch.js")
/*fetch("https://api.mojang.com/profiles/minecraft",{headers: {
      'user-agent': 'Mozilla/4.0 MDN Example',
      'content-type': 'application/json'
    },method:"POST",body:JSON.stringify(["Dream"])}).then(e=>e.json()).then(console.log)*/
let pf = {
    settings: {
        username: "NUU",
        uuid: "ec70bcaf702f4bb8b48d276fa52a780c"
    },
    'java_path': "./jre8-64/bin/javaw.exe",
    '.minecraft': "C:\\Users\\Edwinlau.WWW\\.minecraft",
    // "version": "1.7.10-Forge10.13.0.1151"
    // "version": "1.16.1"
    "version": "1.7.10"
};
let value = (launch.v2(pf));
console.log(value)
try {
    let result = require("child_process").execSync(value)
    require("iconv-lite").decode(result, 'cp936')
} catch (e) {
    require("iconv-lite").decode(JSON.stringify(e), 'cp936')
}