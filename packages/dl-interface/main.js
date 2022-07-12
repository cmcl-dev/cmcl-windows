(function () {
    if (0) {
        var tree = [{
            text: "Parent 1",
            nodes: [{
                text: "Child 1",
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
        nodes: [{
            text: "version.assets.json"
        }]
    }];

    function reflush_tree() {
        $('#download-tree').treeview({ data: download_tree, showCheckbox: true, expandIcon: "fa fa-plus", collapseIcon: "fa fa-minus" });
    }
    reflush_tree();
    let last_refresh = new Date();
    function create_branch(branch) {
        let tree = { nodes: download_tree };
        for (let i = 0; i < branch.length; ++i) {
            console.log(branch[i], i, branch.length)
            let place = -1;
            for (let j = 0; j < tree.nodes.length; ++j) {
                if (tree.nodes[j].text == branch[i]) {
                    place = j;
                    break;
                }
            }
            if (place == -1) {
                console.log(i + 1,branch.length)
                tree.nodes.push({
                    text: branch[i],
                    nodes: [],
                    expandIcon: (i + 1 >= branch.length) ? ("null-icon") : (undefined),
                    collapseIcon: (i + 1 >= branch.length) ? ("null-icon") : (undefined),
                });
                tree = tree.nodes[tree.nodes.length - 1];
            } else {
                tree.expandIcon = undefined;
                tree.collapseIcon = undefined;
                tree = tree.nodes[place];
            }
        }
        if (new Date() - last_refresh > 1000)
            reflush_tree(), last_refresh = new Date();
    }
    window.worker = new Worker("../resourcer/index.js");
    worker.postMessage(JSON.stringify({
        version_name: sessionStorage["data-version"],
        version_url: sessionStorage["data-url"],
        minecraft: sessionStorage["data-target"],
        mirror: localStorage["api"],
        natives: JSON.parse(sessionStorage["data-natives"])
    }));
    worker.onmessage = function (e) {
        let data = e.data;
        console.log(data)
        let message;
        try {
            message = JSON.parse(data);
        } catch (e) {
            console.warn("BAD PACKET.DEPREDATED.", e);
        }



        switch (message.type) {
            case "add-file":
                {
                    let branch = message["tree"];
                    create_branch(branch);
                    break;
                }
        }
    }
    window.installer = {
        download_tree: download_tree
    }
})();
/*
var bc = new BroadcastChannel('test_channel');
bc.postMessage('This is a test message.');
bc.onmessage = function (ev) { console.log(ev); }
*/