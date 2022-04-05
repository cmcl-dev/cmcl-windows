const launch=require("./new-launch.js").v2;
onmessage=function(e){
	let obj=JSON.parse(e.data);
	console.log(obj)
	let args=launch({
	java_path:"./jre8-64/bin/java.exe",
	'.minecraft':obj.localStorage["minecraft_path"],
	"version":obj.version,
	settings:{
		username:obj.username
	}});
	console.log(args);
	self.close();
}