$('#forge_checked_choose_download').checked = "";

function forge_tip() {
    let mirror_url = localStorage["api"] == "bmcl" ? "https://bmclapi2.bangbang93.com" : "https://download.mcbbs.net"
    let set = [];
    let forge_download_ver = $("#forge_download_fetch")
    fetch(mirror_url + "/forge/minecraft/" + ver_arr[window["dlg_ver"]]).then(res => res.json()).then(function(obj) {
        console.log(obj)
        for (let s = 0; s < obj.length; s++) {
            var o = document.createElement("option")
            o.value = obj[s].version;
            o.innerHTML = obj[s].version;
            o["dataset"].url = `${mirror_url}/forge/download?mcversion=${obj[s].mcversion}&version=${obj[s].version}&category=installer&format=jar`;
            o["dataset"].ver = obj[s].version;
            o["dataset"].mcver = obj[s].mcversion;
            //https://bmclapi2.bangbang93.com/forge/download?mcversion=1.16.4&version=35.1.4&category=universal&format=jar
            forge_download_ver.appendChild(o);
        }
    });
};