const cp = require("child_process");
const iconv = require("iconv-lite");
const fs = require("fs");
function window_display(e) {//${e.data}
	const program = cp.exec(`start "Minecraft Logs" cmd /k ${e.data}`, {
		shell: "cmd", windowsHide: false
	});
	console.log(program);
	let { stdout, stderr } = program;
	stdout.on("data", function () { console.log(); })
	stdout.pipe(fs.createWriteStream("TEXT-LOG.txt"));
	stderr.on("data", function (e) { console.warn(e.toString()) });
	program.on("close",function(){
		console.log("程序退出")
	})
}
function log_create(e) {//${e.data}
	const program = cp.exec(`${e.data}`, {
		shell: "cmd", windowsHide: true, encoding: 'binary'
	},function(){close();});
	console.log(program);
	let { stdout, stderr } = program;
	stdout.on("data", function (e) { console.log(iconv.decode(e, 'cp936')); })
	stderr.on("data", function (e) { console.warn(e.toString()) });
}
onmessage = log_create;