const fs=require('fs');
const path=require('path');
const streamToPromise = require('promising-a-stream');
module.exports.copy_dirs=function(src,dst,except){
    let paths = fs.readdirSync(src); //同步读取当前目录
    paths.forEach(function(path){
        var _src=src+'/'+path;
        var _dst=dst+'/'+path;
        fs.stat(_src,function(err,stats){  //stats  该对象 包含文件属性
            if(err)throw err;
            if(stats.isFile()){ //如果是个文件则拷贝 
                let  readable=fs.createReadStream(_src);//创建读取流
                let  writable=fs.createWriteStream(_dst);//创建写入流
                readable.pipe(writable);
            }else if(stats.isDirectory()){ //是目录则 递归 
                module.exports.checkDirectory(_src,_dst,copy);
            }
        });
    });
};
module.exports.checkDirectory=function(src,dst,callback){
    fs.access(dst, fs.constants.F_OK, (err) => {
        if(err){
            fs.mkdirSync(dst);
            callback(src,dst);
        }else{
            callback(src,dst);
        }
      });
};

module.exports.mkdirs=function(dirname, callback) {  
    fs.exists(dirname, function (exists) {  
        if (exists) {  
            callback();  
        } else {  
            // console.log(path.dirname(dirname));  
            module.exports.mkdirs(path.dirname(dirname), function () {  
                fs.mkdir(dirname, callback);  
                console.log('在' + path.dirname(dirname) + '目录创建好' + dirname  +'目录');
            });  
        }  
    });  
};  
module.exports.mkdirsSync=function(dirname) {
    try{
        fs.mkdirSync(dirname,{recursive:true})
    }
    catch(e){
        console.log(e)
    }
  };