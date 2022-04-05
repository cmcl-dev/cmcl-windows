String.prototype.replaceAll = function (sub, target) {
	let temp = this;
	while (temp.indexOf(sub) !== -1) {
		temp = temp.replace(sub, target);
	}
	return temp;
}
const fs = require("fs");
const path = require("path");
const rule_parsing = require("./rule.js");

function __quot_add(mode, str) {
	if (mode === "exec") {
		return `"${str}"`;
	}
	else return str;
}
function version_isolation(minecraft,is_isolation,version){
	if(is_isolation){
		return path.join(minecraft,"versions",version);
	}
	else{
		return minecraft;
	}
}
function replace_mcarg(options) {
	let _options = {};
	Object.assign(_options, { launcher: { name: "Convenient MCL", version: "v1.8" } }, options)
	let quot = "\"";
	let v2 = _options.str.replace("${auth_player_name}", +_options.username)
		.replace("${version_name}", _options.version_name)
		.replace("${version_type}", _options.launcher.name + _options.launcher.version)
		.replace("${game_directory}", version_isolation(_options.__minecraft,_options.is_isolation,_options.version))
		.replace("${assets_root}", (path.join(options.__minecraft, ".\\assets")))
		.replace("${assets_index_name}", _options.asset_id)
		.replace("${auth_uuid}", _options.uuid)
		.replace("${auth_access_token}", _options.uuid)
		.replace("${user_properties}", "{}")
		.replace("${user_type}", "Legacy")
		.replace("${launcher_name}", _options.launcher.name)
		.replace("${launcher_version}", _options.launcher.version)
		.replace("${classpath}", "")
		.replace("-cp", "")
		.replace("-Djava.library.path=${natives_directory}", "")
	return v2;
}

function parse_libraries(version_json, options) {
	let libraries = version_json.libraries;
	let libraries_path = [];
	for (let s = 0; s < libraries.length; s++) {
		if (libraries[s].rules && rule_parsing(libraries[s].rules, options.features))
			continue;

		let name_arr = libraries[s].name.split(":");
		let pathss = path.join(options[".minecraft"], 'libraries', `${name_arr[0].split(".").join("/")}/${name_arr[1]}/${name_arr[2]}/${name_arr[1]}-${name_arr[2]}.jar`);
		if (libraries_path.indexOf(pathss) == -1)
			libraries_path.push(pathss);
	}
	libraries_path.push(path.join(options[".minecraft"], `versions/${options.version}/${options.version}.jar`));
	return libraries_path.join(";");
}
function parse_mc_args_v1(version_json, options) {
	const crypto = require('crypto');
	let m_ = crypto.createHash('md5').update(options.settings.username, 'utf8').digest('hex');

	if (version_json.minecraftArguments) {
		let quot = "\"";
		let new_mcarg = replace_mcarg({
			mode: options.mode,
			str: version_json.minecraftArguments,
			version_name: version_json.id,
			__minecraft: options[".minecraft"],
			asset_id: version_json.assets,
			uuid: m_.toLowerCase(),
			username: options.settings.username
		})

		return { game: new_mcarg.split(" "), jvm: [] };
	}
	else {
		let jvm = Array.from(version_json.arguments.jvm), game = Array.from(version_json.arguments.game);
		if (!game) game = [];
		if (!jvm) jvm = [];
		let mcarg = [...jvm, ...game], new_arg = [], jvm_arg = [], game_arg = [];
		for (let s = 0; s < jvm.length; s++) {

			if (typeof jvm[s] == "object") {
				console.log(jvm[s])
				if (rule_parsing(jvm[s].rules, options.features)) {
					console.log("skip")
					continue;
				}

				jvm[s] = jvm[s].value;
			}
			if (typeof jvm[s] == 'string') jvm[s] = [jvm[s]];
			console.log(jvm[s])
			for (let l = 0; l < jvm[s].length; l++)
				if (jvm[s][l])
					jvm_arg.push(replace_mcarg({
						mode: options.mode,
						str: jvm[s][l],
						version_name: version_json.id,
						__minecraft: options[".minecraft"],
						asset_id: version_json.assetIndex.id,
						uuid: m_.toLowerCase(),
						username: options.settings.username
					}));
		}
		for (let s = 0; s < game.length; s++) {

			if (typeof game[s] == "object") {
				console.log(game[s])
				if (rule_parsing(game[s].rules, options.features)) {
					console.log("skip")
					continue;
				}

				game[s] = game[s].value;
			}
			if (typeof game[s] == 'string') game[s] = [game[s]];
			console.log(game[s])
			for (let l = 0; l < game[s].length; l++)
				if (game[s][l])
					game_arg.push(replace_mcarg({
						mode: options.mode,
						str: game[s][l],
						version_name: version_json.id,
						__minecraft: options[".minecraft"],
						asset_id: version_json.assetIndex.id,
						uuid: m_.toLowerCase(),
						username: options.settings.username
					}));
		}
		console.log("newarg", { jvm: jvm_arg, game: game_arg })
		return { jvm: jvm_arg, game: game_arg };
	}
}
let parse_mc_args = parse_mc_args_v1;
function launched_v1(_options) {
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
	let standard_options = {
		java_path: "javaw.exe",
		'.minecraft': "C:/Users/Edwinlau.WWW/mcfiles/minecraft",
		settings: {
			username: "test"
		},
		memory: {
			min: "1024M",
			max: "1024M"
		},
		features: {
			has_custom_resolution: false,
			is_demo_user: false
		},
		natives: "./versions/${version}/${version}-natives",
		json: "./versions/${version}/${version}.json",
		runtime: {
			G1: true,
			UseAdaptiveSizePolicy: true,
			OmitStackTraceInFastThrow: true,
			ignoreInvalidMinecraftCertificates: true,
			ignorePatchDiscrepancies: true,
			other: [],
			is_isolation:false
		}
	};
	let options = require("./lib/deep_copy")(standard_options, _options);
	// Object.assign(options,standard_options,_options)
	console.log(options)
	if (options.forge) options.version = options.forge;
	if (options.optifine) options.version = options.optifine;

	let exec_path = options.java_path;
	let exec_args = [], jvm_v1 = [];
	if (options.memory) {
		jvm_v1.push("-Xms" + options.memory.min);
		jvm_v1.push("-Xmx" + options.memory.max);
	}
	if (options.runtime.G1) jvm_v1.push("-XX:+UseG1GC");
	if (options.runtime.UseAdaptiveSizePolicy) jvm_v1.push("-XX:-UseAdaptiveSizePolicy");
	if (options.runtime.OmitStackTraceInFastThrow) jvm_v1.push("-XX:-OmitStackTraceInFastThrow");
	jvm_v1.push("-Dfml.ignoreInvalidMinecraftCertificates=" + ((options.runtime.ignoreInvalidMinecraftCertificates) ? "true" : "false"));
	jvm_v1.push("-Dfml.ignorePatchDiscrepancies=" + (((options.runtime.ignorePatchDiscrepancies)) ? "true" : "false"));
	jvm_v1.push(`-Djava.library.path=${path.join(options[".minecraft"], options.natives.replaceAll("${version}", options.version))}`);
	let version_json_text, version_json;
	try {
		version_json_text = fs.readFileSync(path.join(options[".minecraft"], options.json.replaceAll("${version}", options.version)));
		version_json = JSON.parse(version_json_text)
	} catch (e) {
		console.warn(e);
		return { result: "Error", obj: e };
	}
	jvm_v1.push("-cp");
	jvm_v1.push("" + parse_libraries(version_json, options) + "");
	jvm_v1.push(version_json.mainClass);
	console.log(parse_mc_args(version_json, options))
	let mcargs = parse_mc_args(version_json, options), ____jvm = mcargs.jvm, ____games = mcargs.game;
	console.log("exec", mcargs)
	exec_args.push(...____games);
	exec_args = [...jvm_v1, ...____jvm, ...exec_args];
	exec_args = exec_args.filter(s => (s && s.trim()));
	console.log(exec_args)
	fs.writeFileSync("args.txt", options.java_path + " " + (exec_args.join(" ")))
	console.log(exec_args.join(" "))
	require("child_process").spawn(options.java_path, exec_args, { stdio: 'inherit' });
}
function launched_v2(_options) {
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
	let standard_options = {
		java_path: "javaw.exe",
		'.minecraft': "./mcfiles/minecraft",
		settings: {
			username: "test"
		},
		memory: {
			min: "1M",
			max: "1024M"
		},
		features: {
			has_custom_resolution: false,
			is_demo_user: false
		},
		natives: "./versions/${version}/${version}-natives",
		json: "./versions/${version}/${version}.json",
		runtime: {
			G1: true,
			UseAdaptiveSizePolicy: true,
			OmitStackTraceInFastThrow: true,
			ignoreInvalidMinecraftCertificates: true,
			ignorePatchDiscrepancies: true,
			other: []
		},
		mode: "exec"
	};
	let options = require("./lib/deep_copy")(standard_options, _options);
	// Object.assign(options,standard_options,_options)
	let jvm_args = [];
	console.log(options)
	if (options.forge) options.version = options.forge;
	if (options.optifine) options.version = options.optifine;

	let exec_path = options.java_path;
	let exec_args = [];
	if (options.memory) {
		jvm_args.push("-Xms" + options.memory.min);
		jvm_args.push("-Xmx" + options.memory.max);
	}
	if (options.runtime.G1) jvm_args.push("-XX:+UseG1GC");
	if (options.runtime.UseAdaptiveSizePolicy) jvm_args.push("-XX:+UseAdaptiveSizePolicy");
	if (options.runtime.OmitStackTraceInFastThrow) jvm_args.push("-XX:-OmitStackTraceInFastThrow");
	jvm_args.push("-Dfml.ignoreInvalidMinecraftCertificates=" + ((options.runtime.ignoreInvalidMinecraftCertificates) ? "true" : "false"));
	jvm_args.push("-Dfml.ignorePatchDiscrepancies=" + (((options.runtime.ignorePatchDiscrepancies)) ? "true" : "false"));
	let version_json_text, version_json;
	try {
		version_json_text = fs.readFileSync(path.join(options[".minecraft"], options.json.replaceAll("${version}", options.version)));
		version_json = JSON.parse(version_json_text)
	} catch (e) {
		console.warn(e);
		return { result: "Error", obj: e };
	}
	function replace_mcarg_v2(options) {
		let _options = {};
		Object.assign(_options, { launcher: { name: "ConvenientMCL", version: "v1.7" } }, options)
		let quot = "\"";
		let v2 = _options.str.replace("${auth_player_name}", _options.username)
			.replace("${version_name}", __quot_add(_options.mode, _options.version_name))
			.replace("${version_type}", __quot_add(_options.mode, _options.launcher.name + _options.launcher.version))
			.replace("${game_directory}", __quot_add(_options.mode, _options.__minecraft))
			.replace("${assets_root}", __quot_add(_options.mode, path.join(options.__minecraft, ".\\assets")))
			.replace("${assets_index_name}", _options.asset_id)
			.replace("${auth_uuid}", _options.uuid)
			.replace("${auth_access_token}", _options.uuid)
			.replace("${user_properties}", "{}")
			.replace("${user_type}", "Legacy")
			.replace("${launcher_name}", _options.launcher.name)
			.replace("${launcher_version}", _options.launcher.version)
			.replace("${classpath}", __quot_add(_options.mode, _options.classpath))
			.replace("${natives_directory}", __quot_add(_options.mode, _options.natives))
		return v2;
	}
	function parse_mc_args_v2() {
		const crypto = require('crypto');
		let m_ = crypto.createHash('md5').update(options.settings.username, 'utf8').digest('hex');
		if (options.settings.uuid) m_ = options.settings.uuid;
		let natives = path.join(options[".minecraft"], options.natives.replaceAll("${version}", version_json.id));
		if (version_json.minecraftArguments) {
			let opt=version_json.minecraftArguments;
			let quot = "\"";
			let new_mcarg = replace_mcarg_v2({
				mode: options.mode,
				str: opt,
				version_name: version_json.id,
				__minecraft: options[".minecraft"],
				asset_id: version_json.assetIndex.id,
				uuid: m_.toLowerCase(),
				username: options.settings.username,
				natives: natives,
				classpath: options.classpath
			})

			return { game: new_mcarg.split(" "), jvm: [] };
		}
		else {
			let jvm = Array.from(version_json.arguments.jvm), game = Array.from(version_json.arguments.game);
			if (!game) game = [];
			if (!jvm) jvm = [];
			let mcarg = [...jvm, ...game], new_arg = [], jvm_arg = [], game_arg = [];
			for (let s = 0; s < jvm.length; s++) {

				if (typeof jvm[s] == "object") {
					console.log(jvm[s])
					if (rule_parsing(jvm[s].rules, options.features)) {
						console.log("skip")
						continue;
					}

					jvm[s] = jvm[s].value;
				}
				if (typeof jvm[s] == 'string') jvm[s] = [jvm[s]];
				console.log(jvm[s])
				for (let l = 0; l < jvm[s].length; l++)
					if (jvm[s][l])
						jvm_arg.push(replace_mcarg_v2({
							mode: options.mode,
							str: jvm[s][l],
							version_name: version_json.id,
							__minecraft: options[".minecraft"],
							asset_id: version_json.assetIndex.id,
							uuid: m_.toLowerCase(),
							username: options.settings.username,
							natives: natives,
							classpath: options.classpath
						}));
			}
			for (let s = 0; s < game.length; s++) {
				
				if (typeof game[s] == "object") {
					console.log(game[s])
					if (rule_parsing(game[s].rules, options.features)) {
						console.log("skip")
						continue;
					}

					game[s] = game[s].value;
				}
				if (typeof game[s] == 'string') game[s] = [game[s]];
				console.log(game[s])
				for (let l = 0; l < game[s].length; l++)
					if (game[s][l])
						game_arg.push(replace_mcarg_v2({
							mode: options.mode,
							str: game[s][l],
							version_name: version_json.id,
							__minecraft: options[".minecraft"],
							asset_id: version_json.assetIndex.id,
							uuid: m_.toLowerCase(),
							username: options.settings.username,
							natives: natives,
							classpath: options.classpath
						}));
			}
			console.log("newarg", { jvm: jvm_arg, game: game_arg })
			return { jvm: jvm_arg, game: game_arg };
		}
	}
	while (version_json.inheritsFrom) {
		let version_json2 = require("./lib/deep_copy")( JSON.parse(fs.readFileSync(path.join(options[".minecraft"], options.json.replaceAll("${version}", version_json.inheritsFrom)))),version_json  );
		if(version_json2.inheritsFrom==version_json.inheritsFrom){
			version_json=version_json2;
			version_json.inheritsFrom=undefined;
			break;
		}
		else{
			version_json=version_json2;
		}
	}
	console.log(version_json)
	options.classpath = (parse_libraries(version_json, options));
	let mcargs = parse_mc_args_v2(version_json, options), ____jvm = mcargs.jvm, ____games = mcargs.game;
	____jvm = (____jvm) ? (____jvm) : ([]), ____games = (____games) ? (____games) : ([]);
	____jvm = [...jvm_args, ...____jvm];
	____jvm = ____jvm.filter(s => (s && s.trim()));
	____jvm.push(version_json.mainClass);
	____games = ____games.filter(s => (s && s.trim()));
	for (let s = 0; s < ____jvm.length; s++) {
		if (____jvm[s].indexOf("=") >= 0 && ____jvm[s].indexOf("\"") == -1) {
			let ____arr = ____jvm[s].split("=");
			console.log(____arr)
			if (____arr[1] == "true" || ____arr[1] == "false") continue;
			____arr[1] = __quot_add(options.mode, ____arr[1]);
			____jvm[s] = ____arr.join("=");
		}
	}
	console.log([...____jvm, ...____games]);
	if (options.mode == "exec") return options.java_path + " " + [...____jvm, ...____games].join(" ");
}
let launched = launched_v1;
launched.v2 = launched_v2;
module.exports = launched;