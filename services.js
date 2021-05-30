const http=require("http");
const https=require("https");
const fs=require("fs")
//const fsp=require("fs/promises")
const util=require("util");
const os=require("os");
const path=require("path");
const cp=require("child_process")
const dirs=require("./lib/dirs/index")
const compressing=require("compressing")
const nfetch = require('node-fetch');
const __dirname=process.cwd();
const rule_parsing=require("./rule.js")
const x64=JSON.parse(require("child_process").execSync("sysbit.exe")).bit=="64";
let global_error=[];
let __minecraft=path.join(__dirname,"./mcfiles/.minecraft");
let window={};
let functions={};
let fall_download_libraries=[];
let fall_download_assets=[];
let finish_list=[];
let lib_natives=[];
let per_lib=0;
let per_lib_p=0;
let pleasure=[];
let progress_lib_count={};
let started_lib_run=0;
let LIb=0;
let global_resource={};
//process.nextTick=function(e,...arr){setTimeout(e,0,arr);};
let __main=function(){
	
function push_log(logs){
/*
window.download_log=$("#logs");
download_log.innerHTML+=(logs);
*/
postMessage(JSON.stringify({type:"log",value:logs}));
}
function push_interval(s=20){
/*
window.download_log=$("#logs");
download_log.innerHTML+=(logs);
*/
postMessage(JSON.stringify({type:"interval",value:s}));
}
function push_failed(type,xo,yo,zo){
/*
window.download_log=$("#logs");
download_log.innerHTML+=(logs);
*/
postMessage(JSON.stringify({type:type,value:{x:xo,y:yo,z:zo}}));
}
const progressStream = require('progress-stream');
//const streamToPromise = require('stream-to-promise');
const streamToPromise = require('promising-a-stream');
const crypto = require('crypto');
async function gen_sha1(path){
	return new Promise(function(resolve,reject){
    

    var md5sum = crypto.createHash('sha1');
    var stream = fs.createReadStream(path);
    stream.on('data', function(chunk) {
        md5sum.update(chunk);
    });
    stream.on('end', function() {
        let str = md5sum.digest('hex').toLowerCase();
		console.log("sha1:"+str)
		resolve(str)
    });
});
}


async function download_multi_p(_hash,u,p,async_f,cb,ac_cb,failed_cb){
if(fs.existsSync(p)){
	if(await gen_sha1(p)==_hash)
	return true;
}
else
return new Promise(function(_resolve,_reject){
	
//下载 的文件 地址
let fileURL = u;
//下载保存的文件路径
let fileSavePath = p;
//缓存文件路径
let tmpFileSavePath = fileSavePath + ".tmp";
//下载进度信息保存文件
let cfgFileSavePath = fileSavePath + ".cfg.json";

let downCfg = {
    rh: {},//请求头
    percentage: 0,//进度
    transferred: 0,//已完成
    length: 0,//文件大小
    remaining: 0,//剩余
    first: true//首次下载
};
let tmpFileStat = { size: 0 };
//判断文件缓存 与 进度信息文件是否存在 
if (fs.existsSync(tmpFileSavePath) && fs.existsSync(cfgFileSavePath)) {
    tmpFileStat = fs.statSync(tmpFileSavePath);
    downCfg = JSON.parse(fs.readFileSync(cfgFileSavePath, 'utf-8').trim());
    downCfg.first = false;
    //设置文件
    downCfg.transferred = tmpFileStat.size;
}

//创建写入流
let writeStream = null;

//请求头
let fetchHeaders = {
    'Content-Type': 'application/octet-stream',
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
    Pragma: "no-cache",
};
//追加请求范围
if (downCfg.length != 0) {
    fetchHeaders.Range = "bytes=" + downCfg.transferred + "-" + downCfg.length;//71777113
}
if (downCfg.rh["last-modified"]) {
    fetchHeaders["last-modified"] = downCfg.rh["last-modified"];
}
//校验文件头
const checkHerder = [
    "last-modified",//文件最后修改时间
    "server",//服务器
    // "content-length",//文件大小
    "content-type",//返回类型
    "etag",//文件标识
];
console.log(fileURL)
nfetch(fileURL, {
    method: 'GET',
    headers: fetchHeaders,
    // timeout: 100,    
}).then(res => {
    let h = {};
    res.headers.forEach(function (v, i, a) { h[i.toLowerCase()] = v; });
    // console.log(h);
    //文件是否发生变化
    let fileIsChange = false;
    //是否首次下载
    if (downCfg.first) {
        //记录相关信息
        for (let k of checkHerder) downCfg.rh[k] = h[k];
        downCfg.length = h["content-length"];
    } else {
        //比较响应变化
        for (let k of checkHerder) {
            if (downCfg.rh[k] != h[k]) {
                fileIsChange = true;
                break;
            }
        }
        //是否运行范围下载
        downCfg.range = res.headers.get("content-range") ? true : false;
    }
    //创建文件写入流
    writeStream = fs.createWriteStream(tmpFileSavePath, { 'flags': !downCfg.range || fileIsChange ? 'w' : 'a' })
        .on('error', function (e) {
            console.error('error==>', e)
			console.warn(e);
			if(failed_cb)failed_cb(e);
				_resolve(false);
        }).on('ready', function () {
            console.log("开始下载:", fileURL);
        }).on('finish', function () {
            //下载完成后重命名文件
			try{
			fs.renameSync(tmpFileSavePath, fileSavePath);
            fs.unlinkSync(cfgFileSavePath);	
			}catch(e){
				console.warn(e);
				failed_cb(e);
				_resolve(false);
				return ;
			}
            
            console.log('文件下载完成:', fileSavePath);
			if(cb)cb(100);
			if(ac_cb)ac_cb(true);
			_resolve(true);
			finish_list.push(u);
        });

    //写入信息文件
    fs.writeFileSync(cfgFileSavePath, JSON.stringify(downCfg));
    //获取请求头中的文件大小数据
    let fsize = h["content-length"];
    //创建进度
    let str = progressStream({
        length: fsize,
        time: 400 /* ms */
    });
    //创建进度对象
    str.on('progress', function (progressData) {
        //不换行输出
        let percentage = Math.round(progressData.percentage) + '%';
        console.log(fileURL+":"+percentage);
		if(cb)cb(progressData.percentage);
        //     console.log(`
        //     进度 ${progressData.percentage}
        //     已完成 ${progressData.transferred}
        //     文件大小 ${progressData.length}
        //     剩余 ${progressData.remaining}
        //         ${progressData.eta}
        //     运行时 ${progressData.runtime}
        //         ${ progressData.delta}
        //    速度 ${ progressData.speed}
        //             `);
        // console.log(progress);
        /*
        {
            percentage: 9.05,
            transferred: 949624,
            length: 10485760,
            remaining: 9536136,
            eta: 42,
            runtime: 3,
            delta: 295396,
            speed: 949624
        }
        */
    });
    res.body.pipe(str).pipe(writeStream);
    res.headers.forEach(function (v, i, a) {
        console.log(i + " : " + v);
    })
}).catch(e => {
    //自定义异常处理
    console.warn(e);
	failed_cb(e);
	resolve(false);
	return false;
});
});
}

async function download_multi(_hash,u,p,async_f,cb,ac_cb,failed_cb){
if(fs.existsSync(p)){
	if(await gen_sha1(p)==_hash)
	return true;
}

//下载 的文件 地址
let fileURL = u;
//下载保存的文件路径
let fileSavePath = p;
//缓存文件路径
let tmpFileSavePath = fileSavePath + ".tmp";
//创建写入流
const fileStream = fs.createWriteStream(tmpFileSavePath).on('error', function (e) {
    console.warn('error==>', e)
	//push_log("下载失败，请重新安装")
	failed_cb(e);
	ac_cb(false);
	}).on('ready', function () {
    console.log("开始下载:", fileURL);
}).on('finish', function () {
    //下载完成后重命名文件
	try{
		fs.renameSync(tmpFileSavePath, fileSavePath);
	}catch(e){
		console.warn(e);
		failed_cb(e);
		return ;
	}
    
    console.log('文件下载完成:', fileSavePath);
	if(cb)cb(100);
	if(ac_cb)ac_cb(true);
	finish_list.push(u);
});
//请求文件
nfetch(fileURL, {
    method: 'GET',
    headers: { 'Content-Type': 'application/octet-stream' },
    timeout: 60000,    
}).then(res => {
    //获取请求头中的文件大小数据
    let fsize = res.headers.get("content-length");
    //创建进度
    let str = progressStream({
        length: fsize,
        time: 300 /* ms */
    });
    // 下载进度 
    str.on('progress', function (progressData) {
        //不换行输出
        let percentage = Math.round(progressData.percentage) + '%';
        console.log(fileURL+":"+percentage);
		if(cb)cb(progressData.percentage);
        // process.stdout.write('\033[2J'+);
        // console.log(progress);
        /*
        {
            percentage: 9.05,
            transferred: 949624,
            length: 10485760,
            remaining: 9536136,
            eta: 42,
            runtime: 3,
            delta: 295396,
            speed: 949624
        }
        */
    });
    res.body.pipe(str).pipe(fileStream);
}).catch(e => {
    //自定义异常处理
    console.warn(e);
	failed_cb(e);
});
return async_f?(Promise.race([streamToPromise(fileStream,"finish"),new Promise(function(resolve,reject){setTimeout(function(err){if((finish_list.indexOf(u)===-1)&&failed_cb)failed_cb(err);resolve(err);},60000,new Error("Time out"))})])):(true);
};
	let c=0,asset=0,ar_s=0;
let processss=0,process_all_show="0%",part_processs=0;

Object.defineProperty(this,'processs',{get:function(){return processss;},set:function(v){processss=v;postMessage(JSON.stringify({type:"process",value:(Math.floor(v))}));}});
Object.defineProperty(this,'part_process',{get:function(){return part_processs;},set:function(v){part_processs=v;postMessage(JSON.stringify({type:"part_process",value:(Math.floor(v))}));}});
console.log("Debug");
let d_lib_list ={};
const assets_https_agent=new https.Agent({timeout:60*1000,keepAlive:true});
const assets_http_agent=new http.Agent({timeout:60*1000,keepAlive:true});

async function wait_tick(){
	return new Promise(function(ok,cancel){
		setTimeout(ok,10);
	});
}
window.$=function(cd){return document.querySelector(cd);}
try{
exports.ccc=1;
fs.writeFileSync("D:\\mcin\\services.txt","success");
}catch(e){
	
	
}
process.on('uncaughtException', function (err) {
global_error.push(err)
console.log(err);
	return false;
});
let https_agent=new https.Agent({timeout:(localStorage['wait']?Number(localStorage['wait']):(1000*60))});
let  http_agent=new http .Agent({timeout:(localStorage['wait']?Number(localStorage['wait']):(1000*60))});
let lib=async function(_hash,u,p,size){
console.log(_hash)
let failed=false;
if(u.indexOf("lwjgl")>=0){
console.info(`lib("${u}","${p}");`)
}
if(localStorage["api"]=="bmcl"){
u=u.replace("https://libraries.minecraft.net","https://bmclapi2.bangbang93.com/maven");
}
if(localStorage["api"]=="mcbbs"){
u=u.replace("https://libraries.minecraft.net","https://download.mcbbs.net/maven");
}
if(localStorage["api"]=="custom"){
u=u.replace("https://libraries.minecraft.net",localStorage["libraries"]);
}
progress_lib_count[u]=0;
console.warn("U:"+u+"\nP:"+p);
push_log(`Loading Libraries:${p}<br />`);
d_lib_list[u]=1;
(ar_s)++;

if(fs.existsSync(path.join(__minecraft,`./libraries/${p}`))){
	console.log(_hash)
	if(_hash)
	if((await gen_sha1(path.join(__minecraft,`./libraries/${p}`)))==_hash){
		push_log(`ALREADY Downloaded ${p} Module<br />`);
		LIb++;
		d_lib_list[u]=0;
		processs=started_lib_run+LIb/(pleasure.length)*20;
		part_process=LIb/(pleasure.length)*100;
		global_resource[u]=2;
		console.log("OAO")
		return true;
	}
	else{
		console.log(await gen_sha1(path.join(__minecraft,`./libraries/${p}`)),_hash)
	}
	
}
console.log(`./mcfiles/.minecraft/libraries/${p}`)
try{
dirs.mkdirsSync(path.dirname(path.join(__minecraft,`./libraries/${p}`)));
}catch(e){
console.log(e)
}
/*
var prop=u.indexOf("https")==0?https:http;
var curagent=u.indexOf("https")==0?https_agent:http_agent;
var req_lib=await prop.get(u,{agent:curagent},async function(ccc){
	//debugger;
console.log(ccc)
if(ccc.statusCode==200){
console.log( "Lib::::::::"+path.dirname(path.join(__dirname,`./mcfiles/.minecraft/libraries/${p}`))  )
try{
dirs.mkdirsSync(path.dirname(path.join(__dirname,`./mcfiles/.minecraft/libraries/${p}`)));
}catch(e){
console.log(e)
}
var wristr=fs.createWriteStream(path.join(__dirname,`./mcfiles/.minecraft/libraries/${p}`),{highWaterMark:size});
ccc.on("data",function(chunk){
	console.log("Get Data from",p);
	wristr.write(chunk);
});
ccc.on('error',async function(e){console.warn("-----wwwww-----wwwww-----wwwww"+e);failed=true;fall_download_libraries.push({u:u,p:p,size:size});fall();});
ccc.on('end',function(){
	//debugger;
d_lib_list[u]=0;
wristr.end();
console.log((c)++);
push_log(`Downloaded ${c} Modules<br />`);

//debugger;

return;
});


}
if(ccc.statusCode==301||ccc.statusCode==302){

lib(ccc.headers.location,p);
}

});
req_lib.on("error",function(e){console.warn("-----wwwww-----wwwww-----wwwww"+e);failed=true;fall_download_libraries.push({u:u,p:p,size:size});fall();})
req_lib.end();
let up=path.join(__dirname,`./mcfiles/.minecraft/libraries/${p}`);
while(1){
	try{
	var info2=fs.statSync(up);
	}catch(e){}
	info2=(info2)?(info2):({size:0});
	if(size==info2.size)break;
	if(failed)break;
	await wait_tick(); 
}

let return_v=new Promise(async function(ok,fall){
	ok();
});
*/
push_interval()
return download_multi_p(_hash,u,path.join(__minecraft,`./libraries/${p}`),true,function(prog){},function(prog){
	
if(prog){
LIb++;
processs=started_lib_run+LIb/(pleasure.length)*20;
part_process=LIb/(pleasure.length)*100;
global_resource[u]=2;
}

},function(){
	push_failed("failed_libraries",path.win32.basename(p),p,u);
});
};


let main_url=async function(_hash,u,v,size){
if(localStorage["api"]=="bmcl"){
u=u.replace("https://launcher.mojang.com","https://bmclapi2.bangbang93.com");
}
if(localStorage["api"]=="mcbbs"){
u=u.replace("https://launcher.mojang.com","https://download.mcbbs.net");
}
if(localStorage["api"]=="custom"){
u=u.replace("https://launcher.mojang.com",localStorage["main"]);
}
let p=path.join(__minecraft,`./versions/${v}/${v}.jar`);
dirs.mkdirsSync(path.dirname(p))
/*
console.log("inside main_url",u)
let failed=false;

console.info("Main_url Start"+u+"\n"+v);

try{
if(fs.existsSync(p)){
var info3=fs.statSync(p);
if(size==info3.size)return true;	
}
}catch(e){
	
}

var curagent=u.indexOf("https")==0?https_agent:http_agent;
var cos=u.indexOf("https")==0?https:http;

dirs.mkdirsSync(path.dirname(p));
cos.get(u,{agent:curagent},function(ress){
console.log(ress);
var writestream=fs.createWriteStream(p,{highWaterMark:size});
ress.on('data',function(chunk){writestream.write(chunk);console.log("got data");});
ress.on('error',async function(){console.log("Bugs");failed=true;await main_url(u,v);});
ress.on("end",function(){
	writestream.end();
console.info("Succeed Download Main");
push_log(`Downloaded Main<br />`);
});
console.log(p)


});
let process=0;
while(1){
	if(failed)break;
	try{
	var info2=fs.statSync(p);
	if(size==info2.size)break;
	
	console.log(size);
	part_process=(info2.size/size);
	process=(10+40*info2.size/size);
	}catch(e){
		console.log("Haven't load"+e)
	}
	await wait_tick(); 
}
part_process=0;
return Promise.resolve("OK");
*/
return download_multi_p(_hash,u,p,true,function(sz){part_process=(sz),processs=(10+40*sz/100);},function(){},false);

};
functions.main_url=main_url;
let download_asset=async function(f,hash,size,cb){
let u=assets_root+"/"+f+"/"+hash;
let p=path.join(__minecraft,`./assets/objects/${f}/${hash}`);
if(fs.existsSync(p)){
	if(await gen_sha1(p)==hash){
		console.log("already downloaded");
		cb(100);
		return true;
	}
	
}

console.warn("Asset Start:\n"+hash);
/*
let failed=false;
return new Promise(async function(ok,fall){
	//debugger;
var curagent=assets_root.indexOf("https")==0?assets_https_agent:assets_http_agent;


https.get(u,{agent:curagent,headers:{"connection":"keep-Alive"}},async function(ress){
	let writestream=fs.createWriteStream(path.join(__dirname,`./mcfiles/.minecraft/assets/objects/${f}/${hash}`));
	ress.on("data",function(d){writestream.write(d);})
ress.on("end",function(){writestream.end();console.warn("Succeed Download Asset");asset++;ok(asset);});
ress.on('error',async function(){failed=true;fall_download_assets.push({f:f,hash:hash,size:size});console.log("Crashed x2");fall();});


}).on("error",function(){failed=true;fall_download_assets.push({f:f,hash:hash,size:size});console.log("Crashed x2");fall();});
while(1){
	if(failed)break;
	try{
	var info2=fs.statSync(p);
	if(size==info2.size)break;
	}catch(e){
		console.log("Haven't load"+e)
	}
	await wait_tick(); 
}
for (var s=0;s<10000;s++)await wait_tick(); 
});
*/
return Promise.race([new Promise(function(resolve,reject){
	setTimeout(resolve,30000,"超时");
	push_interval();
	}),
	new Promise(function(resolve,reject){
		download_multi_p(hash,u,p,true,
		function(){},
		function(){cb(hash);resolve()},
		function(){
		if(global_resource[hash]==1){
		push_failed("failed_assets",hash,`./minecraft/assets/objects/${f}/${hash}`,u);resolve();}})})
		]
	);
};
functions.download_asset=download_asset;
//download_assets("https://launchermeta.mojang.com/v1/packages/e022240e3d70866f41dd88a3b342cf842a7b31bd/1.17.json","1.17")

let assets_finish=async function(v){
	console.info("Succeed Download Assets");
	await wait_tick();
	var obj;
	try{
	obj=JSON.parse(fs.readFileSync(path.join(__minecraft,`./assets/indexes/${v}.json`)));
	}catch(e){
		await wait_tick();
		await assets_finish(v);
		return;
	}
		
		var ob=obj.objects,keys=Object.keys(ob),values=Object.values(ob);
		console.info(ob)
		let per_asset_a=100/keys.length;
		let per_asset_b=20/keys.length;
		let assets_promise_list=[];
		for (var s=0;s<keys.length;s++){
		var f=values[s].hash.slice(0,2);
		global_resource[values[s].hash]=1;
/*
setTimeout(async function(f,hash_s){
console.log(`./mcfiles/.minecraft/assets/objects/${f}`)
console.log(asset)
dirs.mkdirsSync(path.join(__dirname,`./mcfiles/.minecraft/assets/objects/${f}`))
await download_asset(f,hash_s)
},10*s,f,values[s].hash);
*/
		console.log(`./mcfiles/.minecraft/assets/objects/${f}`)
		//dirs.mkdirsSync(path.join(__dirname,`./mcfiles/.minecraft/assets/objects/${f}`))
		try{
			dirs.mkdirsSync(path.join(__minecraft,`./assets/objects/${f}`))
		}catch(e){
			console.warn(e)
		}
		try{
			
			if(localStorage["special"]){
			postMessage(JSON.stringify({type:"create_worker",value:`
				let workerb=new Worker("./services.js");
				workerb.postMessage(JSON.stringify({
				main_exec:false,
				ver_arr:ver_arr,
				url_arr:url_arr,
				d_num:d_num,
				assets_root:assets_root,
				localStorage:localStorage,
				args:["${f}","${values[s].hash}",${ob[keys[s]].size}]
				}));
				branch_worker.push(workerb);
			`}));
			}
			else
			assets_promise_list.push(download_asset(f,values[s].hash,ob[keys[s]].size,function(hashes){
			global_resource[hashes]=2;
			asset++;
			processs=80+asset*per_asset_b;
			part_process=per_asset_a*asset;
			}));
			
		}catch(e){
			console.log("assets crashed"+e)
		}
		if(localStorage["multi_count"]&&(localStorage["multi_count"]>0))//s,not i
			if(s%localStorage["multi_count"]==0)try{
				await Promise.all(assets_promise_list)
			}catch(e){console.warn("AKLJHGFD",e)}
		else if(!localStorage["multi_count"]){
			if(s%20==0)try{
				await Promise.all(assets_promise_list)
			}catch(e){console.warn("AKLJHGFD",e)}
		}
	}
}
let download_assets=async function(u,v,info){
console.info("Assets Start");
if(localStorage["api"]=="bmcl"){
u=u.replace("https://launchermeta.mojang.com","https://bmclapi2.bangbang93.com");
}
if(localStorage["api"]=="mcbbs"){
u=u.replace("https://launchermeta.mojang.com","https://download.mcbbs.net");
}
if(localStorage["api"]=="custom"){
u=u.replace("https://launchermeta.mojang.com",localStorage["assets"]);
}
window.asset=0;
var curagent=u.indexOf("https")==0?https_agent:http_agent;
let jvp=path.join(__minecraft,`./assets/indexes/${v}.json`);
try{
dirs.mkdirsSync(path.dirname(jvp))
}catch(e){console.log(e);}
var headers = ({
    "accept": "application/json" ,
	"user-agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.92 Safari/537.36"
});
let data_json=await (
fetch(u, {
    method: "GET",
    headers: headers,
    cache: 'no-cache',
})
.then(function(res){return res.text();}));
fs.writeFileSync(jvp,data_json);
await assets_finish(v);
return true;
}


window.download_assets=download_assets;
console.log(download_assets);
let test=function(testtt){
	
	console.log("TESTING:"+testtt);
}
let get_json=async function(curagent,url,target,self_s,num,size){

	var headers = ({
    "accept": "application/json" ,
	"user-agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.92 Safari/537.36"
	});
	let data_json=await (
	fetch(url, {
    method: "GET",
    headers: headers,
    cache: 'no-cache',
	})
	.then(function(res){return res.text();}));
	fs.writeFileSync(path.join(__minecraft,`./versions/${ver_arr[num]}/${ver_arr[num]}.json`),data_json);
	return true;
}

let d=async function(num){

console.log("Started:"+ver_arr[num]);
//var forge=document.getElementById("forge_d").checked;
console.log((path.join(__minecraft,`.//versions/${ver_arr[num]}`)));
dirs.mkdirsSync((path.join(__minecraft,`.//versions/${ver_arr[num]}`)));
window.c=0;
var curagent=url_arr[num].indexOf("https")==0?https_agent:http_agent;
if(localStorage["api"]=="bmcl")url_arr[num]=url_arr[num].replace("https://launchermeta.mojang.com","https://bmclapi2.bangbang93.com");
if(localStorage["api"]=="mcbbs")url_arr[num]=url_arr[num].replace("https://launchermeta.mojang.com","https://download.mcbbs.net");
if(localStorage["api"]=="custom")url_arr[num]=url_arr[num].replace("https://launchermeta.mojang.com",localStorage["json"]);
await get_json(curagent,url_arr[num],path.join(__minecraft,`./versions/${ver_arr[num]}/${ver_arr[num]}.json`),d,num);
await wait_tick();
processs+=(10);
//debugger;
console.log("Get "+ver_arr[num])
let obj;
while(1){
await wait_tick();
try{
	obj=JSON.parse(fs.readFileSync(path.join(__minecraft,`./versions/${ver_arr[num]}/${ver_arr[num]}.json`)));
}catch(e){console.log(e);continue;}
break;
}
console.info(obj)
var downloads=obj.downloads;
if(localStorage["api"]=="bmcl")url_arr[num]=url_arr[num].replace("https://launcher.mojang.com","https://bmclapi2.bangbang93.com");
if(localStorage["api"]=="mcbbs")url_arr[num]=url_arr[num].replace("https://launchermeta.mojang.com","https://download.mcbbs.net");
if(localStorage["api"]=="custom")url_arr[num]=url_arr[num].replace("https://launcher.mojang.com",localStorage["files"]);
console.info("Client:"+downloads.client.url);
await main_url(downloads.client.sha1,downloads.client.url,obj.id,downloads.client.size);
processs=(50);
started_lib_run=processs;
var libraries=obj.libraries;
var libss=[];

var lib_len=libraries.length;
let current_works=0;

part_process=0;
for (var s=0;s<lib_len;s++){
var o=libraries[s];

if(o["downloads"]["artifact"]){
current_works++;
}

if(o.downloads.classifiers){
if(o.downloads.classifiers["natives-windows"]){
current_works++;
}
else{
var x64=(os.arch().indexOf("64"))>0;
if(x64&&(o.downloads.classifiers["natives-windows-64"]&&o.downloads.classifiers["natives-windows-64"]["url"]&&o.downloads.classifiers["natives-windows-64"]["path"])){
current_works++;
}
else if(o.downloads.classifiers["natives-windows-32"]&&o.downloads.classifiers["natives-windows-32"]["url"]&&o.downloads.classifiers["natives-windows-32"]["path"]){
current_works++;
}
}
}
}
console.log(current_works)
per_lib=20/current_works,per_lib_p=100/current_works;
console.log(per_lib,per_lib_p)
for (var s=0;s<lib_len;s++){
var o=libraries[s];
var u,p,size_s;
console.log(pleasure)
//console.log(o.downloads.artifact.url)
//
if(o.downloads.artifact){
u=o.downloads.artifact.url;
p=o.downloads.artifact.path;
size_s=o.downloads.artifact.size;
//console.warn(o.downloads.artifact)
if(libss.indexOf(u)==-1){
console.log(u);
global_resource[u]=1;
//await lib(u,p,size_s);
console.warn(o.downloads.artifact)
pleasure.push(lib(o.downloads.artifact.sha1,u,p,size_s));
libss.push(u);
global_resource[u]=1;
}
}

if(o.downloads.classifiers){
if(o.downloads.classifiers["natives-windows"]){
u=o.downloads.classifiers["natives-windows"].url;
p=o.downloads.classifiers["natives-windows"].path;
size_s=o.downloads.classifiers["natives-windows"].size;
if(libss.indexOf(u)==-1){
console.log(u);
global_resource[u]=1;
try{
//await lib(u,p,size_s);	
pleasure.push(lib(o.downloads.classifiers["natives-windows"].sha1,u,p,size_s));
}catch(e){
	console.log("Crashed x1");
}
lib_natives.push(path.join(__minecraft,`./libraries/${p}`));
libss.push(u)
}
}
else{

if(x64&&(o.downloads.classifiers["natives-windows-64"]&&o.downloads.classifiers["natives-windows-64"]["url"]&&o.downloads.classifiers["natives-windows-64"]["path"])){
u=o.downloads.classifiers["natives-windows-64"].url;
p=o.downloads.classifiers["natives-windows-64"].path;
size_s=o.downloads.classifiers["natives-windows-64"].size;
if(libss.indexOf(u)==-1){
console.log(u);
global_resource[u]=1;
try{
//await lib(u,p,size_s);	
pleasure.push(lib(o.downloads.classifiers["natives-windows-64"].sha1,u,p,size_s));

}catch(e){
	console.log("Crashed x1");
}
lib_natives.push(path.join(__minecraft,`./libraries/${p}`));
libss.push(u)
}
}
else if(o.downloads.classifiers["natives-windows-32"]&&o.downloads.classifiers["natives-windows-32"]["url"]&&o.downloads.classifiers["natives-windows-32"]["path"]){
u=o.downloads.classifiers["natives-windows-32"].url;
p=o.downloads.classifiers["natives-windows-32"].path;
size_s=o.downloads.classifiers["natives-windows-32"].size;
if(libss.indexOf(u)==-1){
console.log(u);
global_resource[u]=1;
try{
//await lib(u,p,size_s);	
pleasure.push(lib(o.downloads.classifiers["natives-windows-32"].sha1,u,p,size_s));
}catch(e){
	console.log("Crashed x1");
}
lib_natives.push(path.join(__minecraft,`./libraries/${p}`));
libss.push(u)
}
}
}
}


console.log("continue")

if(localStorage["multi_count"]&&(localStorage["multi_count"]>0))//s,not i
	if(s%(Math.floor(localStorage["multi_count"]/2))==0)try{
		await Promise.all(pleasure)
	}catch(e){console.warn("AKLJHGFD",e)}
	else if(!localStorage["multi_count"]){
		if(s%10==0)try{
			await Promise.all(pleasure)
			}catch(e){console.warn("AKLJHGFD",e)}
		}
}
await Promise.all(pleasure);
processs=70;
/*
if(fall_download_libraries.length>0)
for (let o=0;o<fall_download_libraries.length;o++){
	await lib(fall_download_libraries[o].u,fall_download_libraries[o].p,fall_download_libraries[o].size);
}
else
push_log("NOTHING TO FIX")
*/

part_process=0;
let per_o1=10/lib_natives.length,per_o2=100/lib_natives.length;
dirs.mkdirsSync(path.join(__minecraft,`./versions/${obj.id}/${obj.id}-natives`));
let jar_path=path.join(__dirname,".\\jre8-"+(x64?"32":"32"),"bin","jar.exe");
importScripts(path.join(__dirname,"./natives.js"));
await jar_natives(path.join(__minecraft,`./versions/${obj.id}/${obj.id}-natives`),...lib_natives);
debugger;
processs=80;
part_process=0;
if(localStorage["api"]=="bmcl")obj.assetIndex.url=obj.assetIndex.url.replace("https://launchermeta.mojang.com","https://bmclapi2.bangbang93.com");
if(localStorage["api"]=="mcbbs")obj.assetIndex.url=obj.assetIndex.url.replace("https://launchermeta.mojang.com","https://download.mcbbs.net");
if(localStorage["api"]=="custom")obj.assetIndex.url=obj.assetIndex.url.replace("https://launchermeta.mojang.com",localStorage["json"]);
console.log(obj.assetIndex.url);
await download_assets(obj.assetIndex.url,ver_arr[num],obj.assetIndex);
if(fall_download_assets.length>0)
for (let o=0;o<fall_download_assets.length;o++){
	await download_asset(fall_download_assets[o].f,fall_download_assets[o].hash,fall_download_assets[o].size);
}
else
push_log("NOTHING TO FIX")
processs=100;

//dirs.checkDirectory("./mcfiles/natives",`./mcfiles/.minecraft/versions/${obj.id}/${obj.id}-natives`,window.copy_dirs);


};
functions.d=d;
}

onmessage=async function(e){
	let obj=JSON.parse(e.data);
	Object.assign(this,obj);
	Object.assign(window,obj);
	console.log(obj)
	if(__minecraft)__minecraft=obj.__minecraft;
	__main();
	if(obj.main_exec)
	{functions.d(obj.d_num);}
	else
	{
		console.log("init MULTI");
		console.log(functions)
		await functions.download_asset(...obj.args);
		self.close();
	}
	
}