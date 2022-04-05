function runcraft(){

username=document.getElementById("name").value
sel=document.getElementById("ver").selectedIndex
forge=document.getElementById("forge").checked
var cmd=(fs.readFileSync("template.bat").toString().replace("edwinlau",username))
switch(sel){
case 0:
if(!forge){
var cmd=(fs.readFileSync("oldver.bat").toString().replace("edwinlau",username))
fs.writeFileSync("./mcfiles/sss.bat",cmd);
cp.exec("cd /d .\\mcfiles&sss.bat");
}
else{
for (var sssss=0;sssss<100;sssss++)
var cmd=((fs.readFileSync("forge.bat").toString().replace("edwinlau",username)).toString().replace("pppppppppaaaaaaattttttthhhhhhh",process.cwd()+"\\mcfiles\\"))
fs.writeFileSync("./mcfiles/sss.bat",cmd);
cp.exec("cd /d .\\mcfiles&sss.bat");
}
break;
case 1:
if(!forge){
var cmd=(fs.readFileSync("oldver.bat").toString().replace("edwinlau",username))
for (var sssss=0;sssss<100;sssss++)
cmd=cmd.replace("1.7.10","1.12.2");
fs.writeFileSync("./mcfiles/sss.bat",cmd);
cp.exec("cd /d .\\mcfiles&sss.bat");
}
else{
for (var sssss=0;sssss<100;sssss++)
cmd=cmd.replace("1.7.10-Forge10.13.4.1614-1.7.10","vvvvvvvvveeeeeeeerrrrrrrr");
for (var sssss=0;sssss<100;sssss++)
cmd=cmd.replace("1.7.10","veerr");
for (var sssss=0;sssss<100;sssss++)
cmd=cmd.replace("vvvvvvvvveeeeeeeerrrrrrrr","1.12.2-forge1.12.2-14.23.1.2555");
for (var sssss=0;sssss<100;sssss++)
cmd=cmd.replace("veerr","1.12.2");
fs.writeFileSync("./mcfiles/sss.bat",cmd);
cp.exec("cd /d .\\mcfiles&sss.bat");
}
break;

case 2:
if(forge)
alert("No Forge!")
fs.writeFileSync("./mcfiles/sss.bat",cmd);
cp.exec("cd /d .\\mcfiles&sss.bat");
break;
case 3:
if(forge)
alert("No Forge!")
for (var sssss=0;sssss<100;sssss++)
cmd=cmd.replace("20w10a","20w14infinite");
fs.writeFileSync("./mcfiles/sss.bat",cmd);
cp.exec("cd /d .\\mcfiles&sss.bat");
break;
}

//cp.exec(cmd)
}





global.lib=window.lib=function(u,p){
return new Promise(function(ok,fall){


if(u.indexOf("lwjgl")>=0){
console.info(`lib("${u}","${p}");`)
}
if(localStorage["api"]=="bmcl"){
u=u.replace("https://libraries.minecraft.net","https://bmclapi2.bangbang93.com/maven");
}
console.warn("U:"+u+"\nP:"+p);
$("#logs").innerHTML+=`Loading Libraries:${p}<br />`;
d_lib_list[u]=1;
(window.ar_s)++;
if(fs.existsSync(path.join(__dirname,`./mcfiles/.minecraft/libraries/${p}`))){
$("#logs").innerHTML+=`ALREADY Downloaded ${p} Module<br />`;
c++;
d_lib_list[u]=0;
ok(c);
return;
}
console.log(`./mcfiles/.minecraft/libraries/${p}`)

var prop=u.indexOf("https")==0?https:http;
var curagent=u.indexOf("https")==0?https_agent:http_agent;
prop.get(u,{agent:curagent},function(ccc){
console.log(ccc)
if(ccc.statusCode==200){
ccc.on('error',async function(){await lib(u,p);});
ccc.on('end',function(){
d_lib_list[u]=0;
console.log((window.c)++);
$("#logs").innerHTML+=`Downloaded ${c} Modules<br />`;
$("process").value++;
ok(c);
});
console.log( "Lib::::::::"+path.dirname(path.join(__dirname,`./mcfiles/.minecraft/libraries/${p}`))  )
try{
dirs.mkdirsSync(path.dirname(path.join(__dirname,`./mcfiles/.minecraft/libraries/${p}`)));
}catch(e){
console.log(e)
}
var wristr=fs.createWriteStream(path.join(__dirname,`./mcfiles/.minecraft/libraries/${p}`));
wristr.on("pipe",function(){
console.log("Pipeing")
});
ccc.pipe(wristr)

}
if(ccc.statusCode==301||ccc.statusCode==302){
ok(301000);
lib(ccc.headers.location,p);
}
});
});
};


global.main_url=window.main_url=function(u,v){
console.info("Main_url Start")
https.get(u,function(ress){
console.log(ress)
ress.on('error',async function(){await main_url(u,v);});
ress.on("end",function(){
console.info("Succeed Download Main");
$("#logs").innerHTML+=`Downloaded Main<br />`;
});
console.log(`./mcfiles/.minecraft/versions/${v}/${v}.jar`)
dirs.mkdirsSync(path.dirname(path.join(__dirname,`./mcfiles/.minecraft/versions/${v}/${v}.jar`)))
ress.pipe(fs.createWriteStream(path.join(__dirname,`./mcfiles/.minecraft/versions/${v}/${v}.jar`)));
});
};
window.download_asset=function(f,hash){
return new Promise(function(ok,fall){
console.warn("Asset Start:\n"+hash);
https.get(assets_root+"/"+f+"/"+hash,function(ress){
ress.on("end",function(){console.warn("Succeed Download Asset");asset++;ok(asset);});
ress.on('error',async function(){await download_asset(f,hash);});
try{
ress.pipe(fs.createWriteStream(path.join(__dirname,`./mcfiles/.minecraft/assets/objects/${f}/${hash}`)));
}catch(e){
console.log(e)
}

});
});
};
//download_assets("https://launchermeta.mojang.com/v1/packages/e022240e3d70866f41dd88a3b342cf842a7b31bd/1.17.json","1.17")
window.download_assets=function(u,v){
console.info("Assets Start");
asset=0;
var curagent=u.indexOf("https")==0?https_agent:http_agent;
https.get(u,{agent:curagent},function(ress){
console.log(ress)
ress.on("end",async function(){
try{
console.info("Succeed Download Assets");
var obj=JSON.parse(fs.readFileSync(path.join(__dirname,`./mcfiles/.minecraft/assets/indexes/${v}.json`)));

var ob=obj.objects,keys=Object.keys(ob),values=Object.values(ob);
console.info(ob)
for (var s=0;s<keys.length;s++){
var f=values[s].hash.slice(0,2);
/*
setTimeout(async function(f,hash_s){
console.log(`./mcfiles/.minecraft/assets/objects/${f}`)
console.log(asset)
dirs.mkdirsSync(path.join(__dirname,`./mcfiles/.minecraft/assets/objects/${f}`))
await download_asset(f,hash_s)
},10*s,f,values[s].hash);
*/
console.log(`./mcfiles/.minecraft/assets/objects/${f}`)
console.log(asset)
dirs.mkdirsSync(path.join(__dirname,`./mcfiles/.minecraft/assets/objects/${f}`))
await download_asset(f,values[s].hash)
}
}catch(e){

console.log(e)
}

});
ress.on('error',function(e){console.info(e);});
try{
dirs.mkdirsSync(path.dirname(path.join(__dirname,`./mcfiles/.minecraft/assets/indexes/${v}.json`)))
ress.pipe(fs.createWriteStream(path.join(__dirname,`./mcfiles/.minecraft/assets/indexes/${v}.json`)));
}catch(e){console.log(e);}

});
};
console.log(download_assets);
window.d=function(num){
try{
console.log("Started:"+ver_arr[num])
//var forge=document.getElementById("forge_d").checked;
console.log((path.join(__dirname,`./mcfiles/.minecraft/versions/${ver_arr[num]}`)))
dirs.mkdirsSync((path.join(__dirname,`./mcfiles/.minecraft/versions/${ver_arr[num]}`)));
alert(`./mcfiles/.minecraft/versions/${ver_arr[num]}/${ver_arr[num]}.json`)
window.c=0;
var curagent=url_arr[num].indexOf("https")==0?https_agent:http_agent;
https.get(url_arr[num],{agent:curagent},async function(res){
if(res.statusCode==301||res.statusCode==302){
url_arr[num]=(res.headers.location);
await d(num);
return;
}
res.on('error',function(){d(num);});
res.on("end",function(){
console.log("Get "+ver_arr[num])
setTimeout(async function(){
var obj=JSON.parse(fs.readFileSync(path.join(__dirname,`./mcfiles/.minecraft/versions/${ver_arr[num]}/${ver_arr[num]}.json`)));
console.info(obj)
var downloads=obj.downloads;
console.info("Client:"+downloads.client.url)
window.main_url(downloads.client.url,obj.id);
var libraries=obj.libraries;
$("progress").max=libraries.length;

var libss=[];
for (var s=0;s<libraries.length;s++){
var o=libraries[s];
var u,p;
try{
//console.log(o.downloads.artifact.url)
//
if(o.downloads.artifact){
u=o.downloads.artifact.url;
p=o.downloads.artifact.path;
}
else if(o.downloads.classifiers){
if(o.downloads.classifiers["natives-windows"]){
u=o.downloads.classifiers["natives-windows"].url;
p=o.downloads.classifiers["natives-windows"].path;
}
else{
var x64=(os.arch().indexOf("64"))>0;
if(x64){
u=o.downloads.classifiers["natives-windows-64"].url;
p=o.downloads.classifiers["natives-windows-64"].path;
}
else{
u=o.downloads.classifiers["natives-windows-32"].url;
p=o.downloads.classifiers["natives-windows-32"].path;
}
}
}

if(libss.indexOf(u)==-1){
console.log(u);
await lib(u,p);
}
copy_natives(obj);
}catch(e){console.log(e)};


}
download_assets(obj.assetIndex.url,ver_arr[num]);

//dirs.checkDirectory("./mcfiles/natives",`./mcfiles/.minecraft/versions/${obj.id}/${obj.id}-natives`,window.copy_dirs);
},1000);
});
try{
fs.mkdirSync(path.join(__dirname,`./mcfiles/.minecraft/versions/${ver_arr[num]}`));
}catch(e){

}
res.pipe(fs.createWriteStream(path.join(__dirname,`./mcfiles/.minecraft/versions/${ver_arr[num]}/${ver_arr[num]}.json`)));
});
}catch(e){

console.log(e);
global_error.push(e);
}
};
setTimeout(function(){console.log(d)},1000);

global.f3=36;
