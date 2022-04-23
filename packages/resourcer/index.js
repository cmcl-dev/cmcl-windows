const nfetch = require("node-fetch");
importScripts("../downloader/index.js")
/*
Input:
{
    "version_name":"",
    "version_url":"",
    "minecraft":"",
    "mirror":"[mojang/bmclapi/mcbbs/random]",
    "natives":["win32","win64","osx","linux"]
}

Output:
{
    "type":"add-file",
    "file-path":"/libraries/lwjgl/lwjgl-3/main.jar",
}
{
    "type":"debug-log",
    "log-type":"@console/log"
}
*/
//Definition of Global Variables
let version_json;
let tasks_libraries = [];
async function libraries_handler() {
    //Handle Libraries
    //获取.jar资源
    
    let libraries = version_json.libraries;
    for (let i = 0; i < libraries.length; ++i) {
        let artifact = libraries.artifact;
        //今日目标，Convenient MCL资源获取+渲染

        tasks_libraries.push({
            url: artifact.url,
            path: artifact.path,
            size: artifact.size,
            sha1: artifact.sha1
        });

        let classifiers = libraries.classifiers;
        if (~natives.indexOf("win32")) {
            let native = classifiers["natives-windows-32"];
            if (!native) break;
            tasks_libraries.push({
                url: native.url,
                path: native.path,
                size: native.size,
                sha1: native.sha1
            });
        }
        if (~natives.indexOf("win64")) {
            let native = classifiers["natives-windows-64"];
            if (!native) break;
            tasks_libraries.push({
                url: native.url,
                path: native.path,
                size: native.size,
                sha1: native.sha1
            });
        }
        if ((~natives.indexOf("win32")) || (~natives.indexOf("win64"))) {
            let native = classifiers["natives-windows"];
            if (!native) break;
            tasks_libraries.push({
                url: native.url,
                path: native.path,
                size: native.size,
                sha1: native.sha1
            });
        }
        if (~natives.indexOf("osx")) {
            let native = classifiers["natives-osx"];
            if (!native) break;
            tasks_libraries.push({
                url: native.url,
                path: native.path,
                size: native.size,
                sha1: native.sha1
            });
        }
        if (~natives.indexOf("linux")) {
            let native = classifiers["natives-linux"];
            if (!native) break;
            tasks_libraries.push({
                url: native.url,
                path: native.path,
                size: native.size,
                sha1: native.sha1
            });
        }
    }
    for (let i in tasks_libraries){
        postMessage(JSON.stringify());
    }
}
async function main_func() {
    let version_text;
    try {
        version_text = await fetch(version_url).then(v => v.text());
    } catch (e) {
        console.warn("fetch error", e);
    }
    
    try {
        version_json = await fetch(version_url).then(v => v.text());
    } catch (e) {
        console.warn("JSON parsing error", e);
    }
    
    do {

    } while (0);
}
onmessage = function(e) {
    let obj = JSON.parse(e.data);
    Object.assign(this, obj);
    main_func();
}
importScripts("./logger.js")