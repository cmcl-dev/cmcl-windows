const nfetch = require('node-fetch');
const progressStream = require('progress-stream');
//const streamToPromise = require('stream-to-promise');
const streamToPromise = require('promising-a-stream');
const dirs=require("./lib/dirs/index");
const compressing=require("compressing");
const path=require("path")

async function download_multi(u,p,async_f,cb,retry,ps){
if(!retry)retry=0;
const fs=require("fs")

//下载 的文件 地址
let fileURL = u;
//下载保存的文件路径
let fileSavePath = p;
//缓存文件路径
let tmpFileSavePath = fileSavePath + ".tmp";
//创建写入流
const fileStream = fs.createWriteStream(tmpFileSavePath).on('error', function (e) {
    console.log('error==>', e)
}).on('ready', function () {
    console.log("开始下载:", fileURL);
}).on('finish', function () {
    //下载完成后重命名文件
	try{
		fs.renameSync(tmpFileSavePath, fileSavePath);
	}catch(e){
		console.log(e);
	}
    
    console.log('文件下载完成:', fileSavePath);
	if(cb)cb();
});
//请求文件
nfetch(fileURL, {
    method: 'GET',
    headers: { 'Content-Type': 'application/octet-stream' },
    // timeout: 100,    
}).then(res => {
    //获取请求头中的文件大小数据
    let fsize = res.headers.get("content-length");
    //创建进度
    let str = progressStream({
        length: fsize,
        time: 100 /* ms */
    });
    // 下载进度 
    str.on('progress', function (progressData) {
        //不换行输出
        let percentage = Math.round(progressData.percentage) + '%';
		if(ps)ps(progressData.percentage);
        console.log(fileURL+":"+percentage);
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
    console.log(e);
});
return async_f?(streamToPromise(fileStream,"finish")):(true);
};
let lib=async function(u,p,size){
const fs=require("fs")
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
console.warn("U:"+u+"\nP:"+p);
d_lib_list[u]=1;
(ar_s)++;
if(fs.existsSync(path.join(__dirname,`./mcfiles/.minecraft/libraries/${p}`))){
c++;
d_lib_list[u]=0;
return;
}
console.log(`./mcfiles/.minecraft/libraries/${p}`)
try{
dirs.mkdirsSync(path.dirname(path.join(__dirname,`./mcfiles/.minecraft/libraries/${p}`)));
}catch(e){
console.log(e)
}

return download_multi(u,path.join(__dirname,`./mcfiles/.minecraft/libraries/${p}`),true);
};



function download_server(ver){
const fs=require("fs")
	fetch(url_arr[ver]).then(text=>text.json()).then(function(json){
		let server_url=json.downloads.server.url;
		try{
			fs.mkdirSync(path.join(__dirname,`./serverfiles/versions/${ver_arr[ver]}`));
		}catch(e){
			
		}
		fs.writeFileSync(path.join(__dirname,`./serverfiles/versions/${ver_arr[ver]}/manifest.json`),JSON.stringify({
			version:ver_arr[ver],
			server:`${ver_arr[ver]}-server.jar`
		}));
		download_multi(server_url,path.join(__dirname,`./serverfiles/versions/${ver_arr[ver]}/${ver_arr[ver]}-server.jar`),true,false,function(){$("#server_downloading").value=100;},function(cgh){$("#server_downloading").value=cgh;});
	});
}
function download_forge(){
const fs=require("fs")
	let forge_ver=$("#forge_download_fetch").selectedOptions[0].value;
	let forge_mc_ver=$("#forge_download_fetch").selectedOptions[0].dataset["mcver"];
	let forge_url=$("#forge_download_fetch").selectedOptions[0].dataset["url"];
	dirs.mkdirsSync(path.join(__dirname,`./mcfiles/.minecraft/versions/${forge_mc_ver}-Forge${forge_ver}-tmp/uncompressed`), { recursive: true });
	download_multi(forge_url,(path.join(__dirname,`./mcfiles/.minecraft/versions/${forge_mc_ver}-Forge${forge_ver}-tmp/${forge_mc_ver}-Forge${forge_ver}-tmp.installer.jar`)),true,
	async function(){
	$("#forge_downloading").value=50;
	console.log("Start Compressing")
	await compressing.zip.uncompress(path.join(__dirname,`./mcfiles/.minecraft/versions/${forge_mc_ver}-Forge${forge_ver}-tmp/${forge_mc_ver}-Forge${forge_ver}-tmp.installer.jar`),path.join(__dirname,`./mcfiles/.minecraft/versions/${forge_mc_ver}-Forge${forge_ver}-tmp/uncompressed`))
	let forge_install_json=JSON.parse(fs.readFileSync(path.join(__dirname,`./mcfiles/.minecraft/versions/${forge_mc_ver}-Forge${forge_ver}-tmp/uncompressed/install_profile.json`)));
	let forge_current_name=forge_install_json.install.target;
	dirs.mkdirsSync(path.join(__dirname,`./mcfiles/.minecraft/versions/${forge_current_name}`), { recursive: true });
	fs.writeFileSync(path.join(__dirname,`./mcfiles/.minecraft/versions/${forge_current_name}/${forge_current_name}.json`),JSON.stringify(forge_install_json.versionInfo));
	let libraries=forge_install_json.versionInfo.libraries;
	let downloading_context=[];
	for (let s=0;s<libraries.length;s++){
		let name_arr=libraries[s].name.split(":");
		let n=`${name_arr[0].split(".").join("/")}/${name_arr[1]}/${name_arr[2]}/${name_arr[1]}-${name_arr[2]}.jar`;
		let u=`https://download.mcbbs.net/maven/`+n;
		downloading_context.push(lib(u,n,0));
	}
	let collect=Promise.all(downloading_context);
	console.log(collect)
	await collect;
	},false,
	function(cgh){
	$("#forge_downloading").value=cgh*0.5;
	});
}
function re_download_libraries(obj){
const fs=require("fs")
	console.log(obj["download_progress"])
download_multi(obj["dataset"]["url"],path.join(__dirname,`./mcfiles/.minecraft/libraries/${obj["dataset"]["path"]}`),true,async function(){obj["download_progress"].value=100;if(obj["dataset"]["path"].indexOf("natives")!==-1)await jar_natives(path.join(__dirname,`./mcfiles/.minecraft/versions/${ver_arr[d_num]}/${ver_arr[d_num]}-natives`),[path.join(__dirname,`./mcfiles/.minecraft/libraries/${obj["dataset"]["path"]}`)]);setTimeout(function(){obj.parentNode.parentNode.hidden=true;},1000);},function(cgh){obj["download_progress"].value=cgh;});
}
function re_download_assets(obj){
	const fs=require("fs")
	console.log(obj["download_progress"])
download_multi(obj["dataset"]["url"],path.join(__dirname,`./mcfiles/.minecraft/assets/objects/${obj["dataset"]["hash"].slice(0,2)}/${obj["dataset"]["hash"]}`),true,async function(){obj["download_progress"].value=100;setTimeout(function(){obj.parentNode.parentNode.hidden=true;},1000);},function(cgh){obj["download_progress"].value=cgh;});
}