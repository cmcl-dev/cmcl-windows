importScripts("./node_modules/comlink/dist/umd/comlink.js")
console.log("666")
/*
async function download_version(version_indexNumber) {
    
function workerize(code) {
	let exports = {};
	let exportsObjName = `__EXPORTS_${Math.random().toString().substring(2)}__`;
	if (typeof code==='function') code = `(${toCode(code)})(${exportsObjName})`;
	code = toCjs(code, exportsObjName, exports);
	code += `\n(${toCode(setup)})(self, ${exportsObjName}, {})`;
	let blob = new Blob([code], {
			type: 'application/javascript'
		}),
		url = URL.createObjectURL(blob),
		worker = new Worker(url),
		counter = 0,
		callbacks = {};
	worker.kill = signal => {
		worker.postMessage({ type: 'KILL', signal });
		setTimeout(worker.terminate);
	};
	let term = worker.terminate;
	worker.terminate = () => {
		URL.revokeObjectURL(url);
		term();
	};
	worker.rpcMethods = {};
	function setup(ctx, rpcMethods, callbacks) {
		/ *
		ctx.expose = (methods, replace) => {
			if (typeof methods==='string') {
				rpcMethods[methods] = replace;
			}
			else {
				if (replace===true) rpcMethods = {};
				Object.assign(rpcMethods, methods);
			}
		};
		* /
		ctx.addEventListener('message', ({ data }) => {
			if (data.type==='RPC') {
				let id = data.id;
				if (id!=null) {
					if (data.method) {
						let method = rpcMethods[data.method];
						if (method==null) {
							ctx.postMessage({ type: 'RPC', id, error: 'NO_SUCH_METHOD' });
						}
						else {
							Promise.resolve()
								.then( () => method.apply(null, data.params) )
								.then( result => { ctx.postMessage({ type: 'RPC', id, result }); })
								.catch( error => { ctx.postMessage({ type: 'RPC', id, error }); });
						}
					}
					else {
						let callback = callbacks[id];
						if (callback==null) throw Error(`Unknown callback ${id}`);
						delete callbacks[id];
						if (data.error) callback.reject(Error(data.error));
						else callback.resolve(data.result);
					}
				}
			}
		});
	}
	setup(worker, worker.rpcMethods, callbacks);
	worker.call = (method, params) => new Promise( (resolve, reject) => {
		let id = `rpc${++counter}`;
		callbacks[id] = { method, resolve, reject };
		worker.postMessage({ type: 'RPC', id, method, params });
	});
	for (let i in exports) {
		if (exports.hasOwnProperty(i) && !(i in worker)) {
			worker[i] = (...args) => worker.call(i, args);
		}
	}
	return worker;
}

function toCode(func) {
	return Function.prototype.toString.call(func);
}

function toCjs(code, exportsObjName, exports) {
	exportsObjName = exportsObjName || 'exports';
	exports = exports || {};
	code = code.replace(/^(\s*)export\s+default\s+/m, (s, before) => {
		exports.default = true;
		return `${before}${exportsObjName}.default = `;
	});
	code = code.replace(/^(\s*)export\s+(function|const|let|var)(\s+)([a-zA-Z$_][a-zA-Z0-9$_]*)/m, (s, before, type, ws, name) => {
		exports[name] = true;
		return `${before}${exportsObjName}.${name} = ${type}${ws}${name}`;
	});
	return `var ${exportsObjName} = {};\n${code}\n${exportsObjName};`;
}
    const http = require("http");
    const https = require("https");
    const path = require("path");
    const greenlet = require("./node_modules/greenlet/dist/greenlet.umd.js")//For Compatible
    function greenlet1(code){
        return workerize(code.toString()).call("main");
    }
    console.log("???");
    let downloader = greenlet(
    */
    async function main_idea(options, g_event) {
        options.console.log("???");
        const http = require("http");
        const https = require("https");
        const path = require("path");
        (function () {
            Promise.allSettled = Promise.allSettled || function (arr) {
                let P = this;
                return new P(function (resolve, reject) {
                    if (!arr[Symbol.iterator]) {
                        return reject(new TypeError(typeof arr + ' ' + arr +
                            ' ' + ' is not iterable(cannot read property Symbol(Symbol.iterator))'));
                    }
                    let args = Array.prototype.slice.call(arr);
                    if (args.length === 0) return resolve([]);
                    let arrCount = args.length;

                    function resolvePromise(index, value) {
                        if (typeof value === 'object') {
                            let then = value.then;
                            if (typeof then === 'function') {
                                then.call(value, function (val) {
                                    args[index] = { status: 'fulfilled', value: val };
                                    if (--arrCount === 0) {
                                        resolve(args);
                                    }
                                }, function (e) {
                                    args[index] = { status: 'rejected', reason: e };
                                    if (--arrCount === 0) {
                                        resolve(args);
                                    }
                                })
                            }
                        }
                    }
                    for (let i = 0; i < args.length; i++) {
                        resolvePromise(i, args[i]);
                    }
                })
            }
        })();
        const global_https_agent = new https.Agent({ timeout: 60 * 1000, keepAlive: true });
        const global_http_agent = new http.Agent({ timeout: 60 * 1000, keepAlive: true });
        let { localStorage, ver_arr, url_arr, version_indexNumber, assets_root, __minecraft } = options;

        const nfetch = require("node-fetch");
        const progressStream = require('progress-stream');
        const streamToPromise = require('promising-a-stream');
        const crypto = require('crypto');
        const events = require("events");
        const aria2 = require("aria2");
        const { speed_get, count_speed } = (function () {
            let speed_count = {};
            return {
                speed_get: function () {
                    let sum = 0;
                    for (let i in speed_count) sum += speed_count[i];
                },
                count_speed: function (url, speed) {
                    speed_count[url] = speed;
                }
            };
        })();
        /*Begin:class Downloader*/
        class Downloader {
            constructor(file_info, options) {
                return ((async function () {
                    const that = this;
                    options = (options) ? (options) : ({});
                    options.type = (options.type) ? (options.type) : ('multi-request');
                    options.event = (options.event) ? (options.event) : (new events.EventEmitter());
                    const funcs = {
                        'multi-request': async function () {
                            return that.download_multi_p(file_info.hash,
                                file_info.url,
                                file_info.path,
                                function (...vals) { options.event.emit('process', ...vals) },
                                function (...vals) { options.event.emit('success', ...vals) },
                                function (...vals) { options.event.emit('failed', ...vals) }
                            )
                        },
                        'single-request': async function () {
                            return that.download_multi(file_info.hash,
                                file_info.url,
                                file_info.path,
                                function (...vals) { options.event.emit('process', ...vals) },
                                function (...vals) { options.event.emit('success', ...vals) },
                                function (...vals) { options.event.emit('failed', ...vals) }
                            )
                        },
                        'aria2': async function () {
                            return that.download_aria2RPC(file_info.hash,
                                file_info.url,
                                file_info.path,
                                function (...vals) { options.event.emit('process', ...vals) },
                                function (...vals) { options.event.emit('success', ...vals) },
                                function (...vals) { options.event.emit('failed', ...vals) }
                            )
                        }
                    };
                    await funcs[type]();
                })());
            }
            async gen_sha1(path) {
                return new Promise(function (resolve, reject) {
                    var md5sum = crypto.createHash('sha1');
                    var stream = fs.createReadStream(path);
                    stream.on('data', function (chunk) {
                        md5sum.update(chunk);
                    });
                    stream.on('end', function () {
                        let str = md5sum.digest('hex').toLowerCase();
                        console.log("sha1:" + str)
                        resolve(str)
                    });
                });
            }
            async download_multi_p(_hash, u, p, cb, ac_cb, failed_cb) {
                if (fs.existsSync(p)) {
                    if (await gen_sha1(p) == _hash)
                        return true;
                }
                else
                    return new Promise(function (_resolve, _reject) {

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
                                    if (failed_cb) failed_cb(e);
                                    _resolve(false);
                                }).on('ready', function () {
                                    console.log("开始下载:", fileURL);
                                }).on('finish', function () {
                                    //下载完成后重命名文件
                                    try {
                                        fs.renameSync(tmpFileSavePath, fileSavePath);
                                        fs.unlinkSync(cfgFileSavePath);
                                    } catch (e) {
                                        console.warn(e);
                                        failed_cb(e);
                                        _resolve(false);
                                        return;
                                    }

                                    console.log('文件下载完成:', fileSavePath);
                                    if (cb) cb(100);
                                    if (ac_cb) ac_cb(true);
                                    _resolve(true);
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
                                console.log(fileURL + ":" + percentage);
                                if (cb) cb(progressData.percentage);
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

            async download_multi(_hash, u, p, async_f, cb, ac_cb, failed_cb) {
                if (fs.existsSync(p)) {
                    if (await gen_sha1(p) == _hash)
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
                    try {
                        fs.renameSync(tmpFileSavePath, fileSavePath);
                    } catch (e) {
                        console.warn(e);
                        failed_cb(e);
                        return;
                    }

                    console.log('文件下载完成:', fileSavePath);
                    if (cb) cb(100);
                    if (ac_cb) ac_cb(true);
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
                        console.log(fileURL + ":" + percentage);
                        if (cb) cb(progressData.percentage);
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
                return async_f ? (Promise.race([streamToPromise(fileStream, "finish"), new Promise(function (resolve, reject) { setTimeout(function (err) { if ((finish_list.indexOf(u) === -1) && failed_cb) failed_cb(err); resolve(err); }, 60000, new Error("Time out")) })])) : (true);
            }
            async download_aria2RPC(_hash, u, p, async_f, cb, ac_cb, failed_cb) {
                //Depredated
            }
            async download_aria2Multi(info_arr) {

            }
            async download_aria2Command(_hash, u, p, async_f, cb, ac_cb, failed_cb) {
                //Depredated
            }
        }
        let get_json = async function (url, target, self_s, version, size) {
            var headers = ({
                "accept": "application/json",
                "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.92 Safari/537.36"
            });
            let data_json = await (
                fetch(url, {
                    method: "GET",
                    headers: headers,
                    cache: 'no-cache',
                }).then(function (res) { return res.text(); }));
            fs.writeFileSync(path.join(__minecraft, `./versions/${version}/${version}.json`), data_json);
            return data_json;
        }
        async function get_assets_json(version_json) {
            let url = version_json.assetIndex;
            if (!url) {
                console.error("URL CAN'T BE NULL");
                return {};
            }
            let headers = ({
                "accept": "application/json",
                "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.92 Safari/537.36"
            });
            let data_json = await (
                fetch(url, {
                    method: "GET",
                    headers: headers,
                    cache: 'no-cache',
                }).then(function (res) { return res.text(); }));
            fs.writeFileSync(path.join(__minecraft, `./assets/indexes/${version_json.assets}`), data_json);
            return data_json;
        }
        let main_jar = async function (version_json) {
            let v = version_json.id;
            let _hash = version_json.client.sha1;
            let u = version_json.clinet.url;
            if (localStorage["--flag-api"] == "bmcl") {
                u = u.replace("https://launcher.mojang.com", "https://bmclapi2.bangbang93.com");
            }
            if (localStorage["--flag-api"] == "mcbbs") {
                u = u.replace("https://launcher.mojang.com", "https://download.mcbbs.net");
            }
            if (localStorage["--flag-api"] == "custom") {
                u = u.replace("https://launcher.mojang.com", localStorage["--config-api-main"]);
            }
            let p = path.join(__minecraft, `./versions/${v}/${v}.jar`);
            dirs.mkdirsSync(path.dirname(p))
            let event = new events.EventEmitter();
            event.on("process", function (progress) {
                global_event.emit("process", u, progress);
            })
            g_event.emit("add-tree", "/", path.basename(p));
            return new Downloader({ hash: _hash, url: u, path: p }, { event: event });
        };

        function name_to_path(sum) {
            //https://libraries.minecraft.net/<package>/<name>/<version>/<name>-<version>.jar
            let arr_init = sum.split(":");
            let package = arr_init[0].split(".").join("/");
            let name = arr_init[1];
            let versio = arr_init[2];
            return `${package}/${name}/${version}/${name}-${version}.jar`;
        }
        function name_to_url(name) {
            return `https://libraries.minecraft.net/${name_to_path(name)}`;
        }
        /*Begin:function libraries_download_list*/
        async function libraries_download_list(version_json) {
            //Return:A ARRAY WITH {url:"",path:"",sha1:""}
            let results = [];
            for (let i in version_json.libraries) {
                let result = {};
                let o = version_json.libraries[i];
                if (item.artifact) {
                    result.url = o.downloads.artifact.url;
                    result.path = o.downloads.artifact.path;
                    result.sha1 = o.downloads.artifact.sha1;
                    results.push(result);
                    g_event.emit("add-tree", "/libraries", result.path);
                }
                if (item.classifiers) {
                    if (item.classifiers["natives-windows"]) {
                        result.url = o.downloads.classifiers["natives-windows"].url;
                        result.path = o.downloads.classifiers["natives-windows"].path;
                        result.sha1 = o.downloads.classifiers["natives-windows"].sha1;
                        results.push(result);
                        g_event.emit("add-tree", "/libraries", result.path);
                    }
                    if (item.classifiers["natives-windows-32"]) {
                        result.url = o.downloads.classifiers["natives-windows-32"].url;
                        result.path = o.downloads.classifiers["natives-windows-32"].path;
                        result.sha1 = o.downloads.classifiers["natives-windows-32"].sha1;
                        results.push(result);
                        g_event.emit("add-tree", "/libraries", result.path);
                    }
                    if (item.classifiers["natives-windows-64"]) {
                        result.url = o.downloads.classifiers["natives-windows-64"].url;
                        result.path = o.downloads.classifiers["natives-windows-64"].path;
                        result.sha1 = o.downloads.classifiers["natives-windows-64"].sha1;
                        results.push(result);
                        g_event.emit("add-tree", "/libraries", result.path);
                    }
                }
            }
            return results;
        }
        function resources_download_list(assets) {
            let results = [];
            for (let k in assets) {
                let result = {};
                result.path = `objects/${assets[k].hash.substr(0, 2)}/${assets[k].hash}`;
                result.url = `https://resources.download.minecraft.net/${assets[k].hash.substr(0, 2)}/${assets[k].hash}`;
                result.sha1 = assets[k].hash;
                results.push(result);
            }
            return results;
        }
        function handle_isolation(minecraft_path, file_path, area, version_id) {
            if (sessionStorage.getItem(`version-isolation-${version_id}`)) {
                return path.join(minecraft_path, "versions", version_id, area, file_path);
            }
            else {
                return path.join(minecraft_path, area, file_path);
            }
        }

        /*Begin:function main*/
        async function main() {
            let version_id = ver_arr[version_indexNumber];
            dirs.mkdirsSync((path.join(__minecraft, `./versions/${version_id}`)));
            // let curagent = url_arr[version_indexNumber].indexOf("https") == 0 ? global_https_agent : global_http_agent;
            if (localStorage["--flag-api"] == "bmcl") url_arr[version_indexNumber] = url_arr[version_indexNumber].replace("https://launchermeta.mojang.com", "https://bmclapi2.bangbang93.com");
            if (localStorage["--flag-api"] == "mcbbs") url_arr[version_indexNumber] = url_arr[version_indexNumber].replace("https://launchermeta.mojang.com", "https://download.mcbbs.net");
            if (localStorage["--flag-api"] == "custom") url_arr[version_indexNumber] = url_arr[version_indexNumber].replace("https://launchermeta.mojang.com", localStorage["--config-api-json"]);
            let version_json_raw = await get_json(url_arr[version_indexNumber], path.join(__minecraft, `./versions/${version_id}/${version_id}.json`), version_id, version_indexNumber);
            let version_json;
            try {
                version_json = JSON.parse(version_json_raw);
            } catch (e) {
                console.error("Error Getting Version JSON");
                g_event.emit("error", { code: "100", "info": "Error Getting Version JSON" });
                return;
            }
            let assets_json_raw = await get_assets_json(version_json), assets_json;
            if (!assets_json_raw) {
                g_event.emit("error", { code: "100", "info": "Error Getting Assets JSON" });
                return;
            }
            try {
                assets_json = JSON.parse(assets_json_raw);
            } catch (e) {
                g_event.emit("error", { code: "100", "info": "Error Getting Assets JSON" });
                console.error("Error Parsing Version JSON")
            }

            await main_jar(version_json);
            let library_list = libraries_download_list(version_json);
            if (localStorage["--flag-mix-download"]) {
                let sum_list = [...library_list];
            }
            else {
                (async function () {
                    let downloaders = [];
                    for (let i in library_list) {
                        switch (localStorage["--flag-api"]) {
                            case "bmcl": {
                                library_list[i].url.replace("https://libraries.minecraft.net", "https://bmclapi2.bangbang93.com")
                                break;
                            }
                            case "mcbbs": {
                                library_list[i].url.replace("https://libraries.minecraft.net", "https://download.mcbbs.net")
                                break;
                            }
                            case "custom": {
                                library_list[i].url.replace("https://libraries.minecraft.net", localStorage["--config-api-libraries"]);
                                break;
                            }
                            case "random": {
                                if (Math.random() >= 0.5) {
                                    library_list[i].url.replace("https://libraries.minecraft.net", "https://bmclapi2.bangbang93.com")
                                }
                                else {
                                    library_list[i].url.replace("https://libraries.minecraft.net", "https://download.mcbbs.net")
                                }
                                break;
                            }
                        }
                        let event = new events.EventEmitter();
                        event.on("process", function (processed) {
                            g_event.emit("process", library_list[i].url, processed);
                        });
                        event.on("success", function (processed) {
                            g_event.emit("success", library_list[i].url, processed);
                        });
                        event.on("failed", function (processed) {
                            g_event.emit("failed", library_list[i].url, processed);
                        });

                        downloaders.push(new Downloader({
                            hash: library_list[i].hash,
                            url: library_list[i].url,
                            path: handle_isolation(__minecraft, library_list[i].path, "libraries", version_id)
                        }, { event: event }));
                        if (!localStorage["--flag-speed-limit"]) localStorage["--flag-speed-limit"] = 1024 * 1024;//1G
                        if (speed_get() > localStorage["--flag-speed-limit"]) {
                            let results = await Promise.allSettled(downloaders);
                            console.log(results);
                        }
                    }
                    let results = await Promise.allSettled(downloaders);
                    console.log(results);
                })();
                let resources_list = resources_download_list(assets_json);
                (async function () {
                    for (let i in resources_list) {
                        switch (localStorage["--flag-api"]) {
                            case "bmcl": {
                                resources_list[i].url.replace("https://resources.download.minecraft.net", "https://bmclapi2.bangbang93.com")
                                break;
                            }
                            case "mcbbs": {
                                resources_list[i].url.replace("https://resources.download.minecraft.net", "https://download.mcbbs.net")
                                break;
                            }
                            case "custom": {
                                resources_list[i].url.replace("https://resources.download.minecraft.net", localStorage["--config-api-assets"])
                                break;
                            }
                            case "random": {
                                if (Math.random() >= 0.5) {
                                    resources_list[i].url.replace("https://resources.download.minecraft.net", "https://bmclapi2.bangbang93.com")
                                }
                                else {
                                    resources_list[i].url.replace("https://resources.download.minecraft.net", "https://download.mcbbs.net")
                                }
                                break;
                            }
                        }
                        let event = new events.EventEmitter();
                        event.on("process", function (processed) {
                            g_event.emit("process", resources_list[i].url, processed);
                        });
                        event.on("success", function (processed) {
                            g_event.emit("success", resources_list[i].url, processed);
                        });
                        event.on("failed", function (processed) {
                            g_event.emit("failed", resources_list[i].url, processed);
                        });

                        downloaders.push(new Downloader({
                            hash: resources_list[i].hash,
                            url: resources_list[i].url,
                            path: handle_isolation(__minecraft, resources_list[i].path, "assets", version_id)
                        }, { event: event }));
                        if (!localStorage["--flag-speed-limit"]) localStorage["--flag-speed-limit"] = 1024 * 1024;//1G
                        if (speed_get() > localStorage["--flag-speed-limit"]) {
                            let results = await Promise.allSettled(downloaders);
                            console.log(results);
                        }
                    }
                    let results = await Promise.allSettled(downloaders);
                    console.log(results);
                })();
            }
        }
        main();
    }
    /*
    )
    const events = require("events");
    const global_event = new events.EventEmitter();
    const local_storage_convert = JSON.parse(JSON.stringify(localStorage));
    const session_storage_convert = JSON.parse(JSON.stringify(sessionStorage));
    return await downloader({ local_storage_convert, session_storage_convert, ver_arr, url_arr, version_indexNumber, assets_root, __minecraft }, global_event);

}
*/

Comlink.expose({
    start:function(...args){
        main_idea(...args)
    }
});