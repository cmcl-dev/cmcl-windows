let _bit=JSON.parse(require("child_process").execSync("sysbit.exe"))
let _os=require("os").platform()
if(_os.indexOf("win")>=0)_os="windows";


function single_parse(rule,features){
	if(!rule)return true;
	if(rule.action=="allow"){
		if((rule.os)){
			if((rule.os.arch)&&(rule.os.arch!=_bit.bit)){
				return true;
			}
			if((rule.os.name)&&(rule.os.name!=_os)){
				console.log((rule.os.name,_os))
				return true;
			}
		}
		if(rule.features){
			for (let keys in rule.features){
				if(rule.features[keys]===features[keys]);
				else{
					console.log(rule.features[keys],features[keys])
					return true;
				}
			}
		}
		return false;
	}
	else{
		if((rule.os)){
			if((rule.os.arch)&&(rule.os.arch==_bit.bit)){
				return false;
			}
			if((rule.os.name)&&(rule.os.name==_os)){
				return false;
			}
		}
		if(rule.features){
			for (let keys in rule.features){
				if(rule.features[keys]!==features[keys]);
				else{
					console.log(rule.features[keys],features[keys])
					return false;
				}
			}
		}
		return true;
	}
}
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
function parseLibRules(rules,features){
	let skip = false;
    if (rules) {
	  for (let s=0;s<rules.length;s++){
			if(rules[s].action=="allow"){
				if((rules[s].os)){
					if((rules[s].os.arch)&&(rules[s].os.arch!=_bit.bit)){
						return true;
					}
					if((rules[s].os.name)&&(rules[s].os.name!=_os)){
						console.log((rules[s].os.name,_os))
						return true;
					}
				}
				if(rules[s].features){
					for (let keys in rules[s].features){
						if(rules[s].features[keys]===features[keys]);
						else{
							console.log(rules[s].features[keys],features[keys])
							return true;
						}
					}
				}
			}
			else{
				if((rules[s].os)){
					if((rules[s].os.arch)&&(rules[s].os.arch==_bit.bit)){
						return true;
					}
					if((rules[s].os.name)&&(rules[s].os.name==_os)){
						return true;
					}
				}
				if(rules[s].features){
					for (let keys in rules[s].features){
						if(rules[s].features[keys]!==features[keys]);
						else{
							console.log(rules[s].features[keys],features[keys])
							return true;
						}
					}
				}
			}
      }
    }
    return skip;
}
function parseLibRules (rules,_features) {
	let flag=true;
	for (let i in rules){
		flag=flag&&single_parse(rules[i],_features);
	}
	return flag;
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

parseLibRules.single=single_parse;
module.exports=parseLibRules;
