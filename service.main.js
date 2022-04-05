let Comlink = require("./node_modules/comlink/dist/umd/comlink.js");
async function init(version_indexNumber) {
    const events = require("events");
    const global_event = new events.EventEmitter();
    const local_storage_convert = JSON.parse(JSON.stringify(localStorage));
    const session_storage_convert = JSON.parse(JSON.stringify(sessionStorage));
    const worker = new Worker("service.v2.js");
    // WebWorkers use `postMessage` and therefore work with Comlink.
    const obj = Comlink.wrap(worker);
    obj.start(Comlink.proxy({ local_storage_convert, session_storage_convert, ver_arr, url_arr, version_indexNumber, assets_root, __minecraft,console }), Comlink.proxy(global_event));
}