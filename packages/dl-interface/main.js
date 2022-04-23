(function() {
    if (1) {
        var tree = [{
                text: "Parent 1",
                collapseIcon: true,
                showCheckbox: true,
                expandIcon: "fa fa-plus",
                selectable: true,
                nodes: [{
                        text: "Child 1",
                        collapseIcon: true,
                        nodes: [{
                                text: "Grandchild 1"
                            },
                            {
                                text: "Grandchild 2"
                            }
                        ]
                    },
                    {
                        text: "Child 2"
                    }
                ]
            },
            {
                text: "Parent 2"
            },
            {
                text: "Parent 3"
            },
            {
                text: "Parent 4"
            },
            {
                text: "Parent 5"
            }
        ];
        $('#download-tree').treeview({ data: tree });
        tree[0].nodes.push({
            text: "Parent 5"
        });
        $('#download-tree').treeview({ data: tree, showCheckbox: true, expandIcon: "fa fa-plus", collapseIcon: "fa fa-minus" });
    }
    let download_tree = [{
        text: "version.json",
        nodes: []
    }];

    function create_branch(branch) {
        let tree = download_tree;
        for (let i = 0; i < branch.length - 1; ++i) {
            let place=-1;
            for (let j=0;j<tree.nodes.length;++j){
                if(tree.nodes[j].text==branch[i]){
                    place=j;
                    break;
                }
            }
            if (place == -1) {
                tree.nodes.push({
                    text:branch[i],
                    nodes:[]
                });
            }
        }
    }
    window.worker = new Worker("../resourcer/index.js");
    worker.postMessage(JSON.stringify({
        version_name: sessionStorage["data-version"],
        version_url: sessionStorage["data-url"],
        minecraft: sessionStorage["data-target"],
        mirror: localStorage["api"],
        natives: JSON.parse(sessionStorage["data-natives"])
    }));
    worker.onmessage = function(e) {
        console.log(e.data);
        let data = e.data;
        switch (data.type) {
            case "add-file":
                {
                    let branch = data["file-path"].split("/");
                    create_branch(branch);
                    break;
                }
        }
    }
})();
/*
var bc = new BroadcastChannel('test_channel');
bc.postMessage('This is a test message.');
bc.onmessage = function (ev) { console.log(ev); }
*/