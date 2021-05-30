let _bit=JSON.parse(require("child_process").execSync("sysbit.exe"))
let _os=require("os").platform()
if(_os.indexOf("win")>=0)_os="windows";



function parseLibRules (rules,_features) {
    let skip = false
    if (rules) {
      skip = true
	  for (let s=0;s<rules.length;s++){
		let action=rules[s].action,features=rules[s].features,os=rules[s].os;
		if(action === 'allow' && ((os && os.arch === _bit.bit)) || !os){
			skip=false;
		}
        else if (action === 'allow' && ((os && os.name === _os) || !os)) {
			skip=false;
		}
		else if (action === 'allow' && (features)){
			for (let keys in features){
				if(features[keys]==_features[keys]){
					skip=false;
				}
				else{
					skip=true;
				}
			}
		}
        else if (action === 'disallow' && ((os && os.name === _os) || !os)) { 
		skip = true 
		//return skip;
		}
		else if(action === 'disallow' && ((os && os.arch === _bit.bit)) || !os){
		skip=true;
		}
		else if (action === 'disallow' && (features)){
			for (let keys in features){
				if(_features[keys]==features[keys]){
					skip=true;
				}
				else{
					skip=false;
				}
			}
		}
		else if(action=='allow')skip=false;
		else skip=true;
      }
    }
    return skip
}
//Changed from Npmjs.com
/*
Original:
parseLibRules (rules) {
    let skip = false
    if (rules) {
      skip = true
      rules.forEach(({ action, os }) => {
        if (action === 'allow' && ((os && os.name === this.os) || !os)) { skip = false }

        if (action === 'disallow' && ((os && os.name === this.os) || !os)) { skip = true }
      })
    }
    return skip
  }
*/


module.exports=parseLibRules;