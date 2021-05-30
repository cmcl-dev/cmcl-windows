(function(window){
	const fs=require("fs");
	const compressing=require("compressing");
	window.jar_natives=async function(target,...jarlist){
		console.log(jarlist)
		let jar_promise_list=[];
		jarlist.forEach(function(file){
			console.log(file,target)
			let per_promise=compressing.zip.uncompress(file,target);
			per_promise.catch(function(e){
				console.warn(e);
			});
			jar_promise_list.push(per_promise);
		})
		let result;
		try{
			result=await Promise.all(jar_promise_list);
		}catch(e){
			console.warn(e)
		}
		return result;
	}
})(this);