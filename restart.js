function restart() {
	const nw=require("nw.gui")
	var child, child_process = require('child_process');
	console.log(process.platform, process.execPath)
	if (process.platform == "darwin")  {
		child = child_process.spawn("open", ["-n", "-a", process.execPath.match(/^([^\0]+?\.app)\//)[1]], {detached:true});
	} else {
		child = child_process.spawn(process.execPath, [".\\"], {detached: true});
	}
	child.unref();
	nw.Window.get().hide();
	nw.App.quit();
}