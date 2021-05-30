String.prototype.replaceAll=function(sub,target){
	let temp=this;
	while(temp.indexOf(sub)!==-1){
		temp=temp.replace(sub,target);
	}
	return temp;
}
const fs=require("fs");
const path=require("path");
const rule_parsing=require("./rule.js")

function replace_mcarg(options){
let _options={};
Object.assign(_options,{launcher:{name:"Convenient MCL",version:"v1.8"}},options)
let quot="\"";
let v2=_options.str.replace("${auth_player_name}",	quot+_options.username				 				+quot)
	.replace("${version_name}",		quot+_options.version_name												+quot)
	.replace("${version_type}",		quot+_options.launcher.name+_options.launcher.version					+quot)
	.replace("${game_directory}",	quot+_options.__minecraft									 			+quot)
	.replace("${assets_root}",		quot+(path.join(options.__minecraft,".\\assets")) 						+quot)
	.replace("${assets_index_name}",quot+_options.asset_id				 	 								+quot)
	.replace("${auth_uuid}",		quot+_options.uuid														+quot)
	.replace("${auth_access_token}",quot+_options.uuid														+quot)
	.replace("${user_properties}",	quot+"{}"																+quot)
	.replace("${user_type}",		quot+"Legacy"															+quot)
	.replace("${launcher_name}",	quot+_options.launcher.name												+quot)
	.replace("${launcher_version}",	quot+_options.launcher.version											+quot)
	.replace("${classpath}",		"")
	.replace("-cp",		"")
	.replace("-Djava.library.path=${natives_directory}","")
	return v2;
}

function parse_libraries(version_json,options){
	let libraries=version_json.libraries;
	let libraries_path=[];
	for (let s=0;s<libraries.length;s++){
		//if(libraries[s].rules&&rule_parsing(libraries[s].rules,options.features)){
		//	continue;
		//}
		let name_arr=libraries[s].name.split(":");
		libraries_path.push(path.join(options[".minecraft"],'libraries',`${name_arr[0].split(".").join("/")}/${name_arr[1]}/${name_arr[2]}/${name_arr[1]}-${name_arr[2]}.jar`));
	}
	libraries_path.push(path.join(options[".minecraft"],`versions/${version_json.id}/${version_json.id}.jar`));
	return libraries_path.join(";");
}
function parse_mc_args(version_json,options){
const crypto = require('crypto');
let m_ = crypto.createHash('md5').update(options.settings.username, 'utf8').digest('hex');

	if(version_json.minecraftArguments){
		let quot="\"";
		let new_mcarg=replace_mcarg({
			str:version_json.minecraftArguments,
			version_name:version_json.id,
			features:options.features,
			__minecraft:options[".minecraft"],
			asset_id:version_json.assetIndex.id,
			uuid:m_.toLowerCase(),
			username:options.settings.username
		})
		
		return {game:new_mcarg.split(" "),jvm:[]};
	}
	else{
		let jvm=Array.from(version_json.arguments.jvm),game=Array.from(version_json.arguments.game);
		if(!game)game=[];
		if(!jvm)jvm=[];
		let mcarg=[...jvm,...game],new_arg=[],jvm_arg=[],game_arg=[];
		for (let s=0;s<jvm.length;s++){
			
			if(typeof jvm[s]=="object"){
				console.log(jvm[s])
				if(rule_parsing(jvm[s].rules,options.features)){
					console.log("skip")
					continue;
				}
				
				jvm[s]=jvm[s].value;
			}
			if(typeof jvm[s]=='string')jvm[s]=[jvm[s]];
			console.log(jvm[s])
			for (let l=0;l<jvm[s].length;l++)
			if(jvm[s][l])
			jvm_arg.push(replace_mcarg({
			str:jvm[s][l],
			version_name:version_json.id,
			__minecraft:options[".minecraft"],
			asset_id:version_json.assetIndex.id,
			uuid:m_.toLowerCase(),
			username:options.settings.username
			}));
		}
	for (let s=0;s<game.length;s++){
			
			if(typeof game[s]=="object"){
				console.log(game[s])
				if(rule_parsing(game[s].rules,options.features)){
					console.log("skip")
					continue;
				}
				
				game[s]=game[s].value;
			}
			if(typeof game[s]=='string')game[s]=[game[s]];
			console.log(game[s])
			for (let l=0;l<game[s].length;l++)
			if(game[s][l])
			game_arg.push(replace_mcarg({
			str:game[s][l],
			version_name:version_json.id,
			__minecraft:options[".minecraft"],
			asset_id:version_json.assetIndex.id,
			uuid:m_.toLowerCase(),
			username:options.settings.username
			}));
		}
	console.log("newarg",{jvm:jvm_arg,game:game_arg})
	return {jvm:jvm_arg,game:game_arg};
	}
}
module.exports=function(_options){
	/*
	option:{
		java_path:"",
		'.minecraft':"",
		version:"",
		forge:"",
		optifine:"",
		settings:{
			username:""
		},
		memory:{
			min:"1G",
			max:"1G"
		},
		natives:"./versions/${version}/${version}-natives",
		json:"./versions/${version}/${version}.json"
	}
	*/
	let standard_options={
		java_path:"javaw.exe",
		'.minecraft':"./mcfiles/minecraft",
		settings:{
			username:"test"
		},
		memory:{
			min:"1024M",
			max:"1024M"
		},
		features:{
			has_custom_resolution:false,
			is_demo_user:false
		},
		natives:"./versions/${version}/${version}-natives",
		json:"./versions/${version}/${version}.json",
		runtime:{
			G1:true,
			UseAdaptiveSizePolicy:true,
			OmitStackTraceInFastThrow:true,
			ignoreInvalidMinecraftCertificates:true,
			ignorePatchDiscrepancies:true,
			other:[]
		}
	};
	let options={};
	Object.assign(options,standard_options,_options)
	console.log(options)
	if(options.forge   )options.version=options.forge   ;
	if(options.optifine)options.version=options.optifine;
	
	let exec_path=options.java_path;
	let exec_args=[],jvm_v1=[];
	if(options.memory){
		jvm_v1.push("-Xms"+options.memory.min);
		jvm_v1.push("-Xmx"+options.memory.max);
	}
	if(options.runtime.G1)jvm_v1.push("-XX:+UseG1GC");
	if(options.runtime.UseAdaptiveSizePolicy)jvm_v1.push("-XX:+UseAdaptiveSizePolicy");
	if(options.runtime.OmitStackTraceInFastThrow)jvm_v1.push("-XX:-OmitStackTraceInFastThrow");
	jvm_v1.push("-Dfml.ignoreInvalidMinecraftCertificates="+((options.runtime.ignoreInvalidMinecraftCertificates)?"true":"false"));
	jvm_v1.push("-Dfml.ignorePatchDiscrepancies="+(((options.runtime.ignorePatchDiscrepancies))?"true":"false"));
	jvm_v1.push(`-Djava.library.path="${path.join(options[".minecraft"],options.natives.replaceAll("${version}",options.version))}"`);
	let version_json_text,version_json;
	try{
		version_json_text=fs.readFileSync(path.join(options[".minecraft"],options.json.replaceAll("${version}",options.version)));
		version_json=JSON.parse(version_json_text)
	}catch(e){
		console.warn(e);
		return {result:"Error",obj:e};
	}
	jvm_v1.push("-cp \""+parse_libraries(version_json,options)+"\"");
	jvm_v1.push(version_json.mainClass);
	console.log(parse_mc_args(version_json,options))
	let mcargs=parse_mc_args(version_json,options),____jvm=mcargs.jvm,____games=mcargs.game;
	console.log("exec",mcargs)
	exec_args.push(...____games);
	exec_args=[...jvm_v1,...____jvm,...exec_args];
	exec_args=exec_args.filter(s=>(s&&s.trim()));
	console.log(exec_args)
	fs.writeFileSync("args.txt",options.java_path+" "+(exec_args.join(" ")))
	require("child_process").spawn(options.java_path,exec_args,{stdio:'inherit'});
}