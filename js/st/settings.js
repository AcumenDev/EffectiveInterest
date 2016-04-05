$(function () {
    spendsDataManager.init();
    settings.init();
});

var settings = {
    init: function () {
        this.exportInit();
        this.importInit();

        $("button[name='deleteAllButton']").bind("click", function () {
            if (confirm("Вы уверены?"))
            {
                spendsDataManager.clearDb();
            }
            else return;
        });

        $("button[name='deleteCategoriesButton']").bind("click", function () {
            if (confirm("Вы уверены?"))
            {
                spendsDataManager.clearDb("categories");
            }
            else return;
        });

        $("button[name='deleteSpendsButton']").bind("click", function () {
            if (confirm("Вы уверены?"))
            {
                spendsDataManager.clearDb("spends");
            }
            else return;
        });
    },

    exportInit: function () {
        $("button[name='export_db']").bind("click", function (e) {
            e.preventDefault();
            console.log("Begin backup process");
            $.when(
                spendsDataManager.backup("categories"),
                spendsDataManager.backup("spends"),
                spendsDataManager.backup("sqlite_sequence")
            ).then(function (categories, spends, sqlite_sequence) {
                    console.log("All done");
                    var data = {
                        categories: categories,
                        spends: spends,
                        sqlite_sequence: sqlite_sequence
                    };
                    var serializedData = data;
                    console.log(serializedData);
                    settings.downloadDb(serializedData);
                });
        });
    },

    downloadDb: function (obj) {
        var data = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(obj));

        var a = document.createElement('a');
        a.href = 'data:' + data;
        a.download = 'data.json';
        a.innerHTML = 'download JSON';
        a.click();
    },

    importInit: function () {
        $("button[name='import_btn']").bind("click", function (e) {
            var f = $("input[name='import_db_file']")[0].files[0];
            if (f) {
                var r = new FileReader();
                r.onload = function (e) {
                    var contents = e.target.result;
                    console.log("Got the file.\n"
                        + "name: " + f.name + "\n"
                        + "type: " + f.type + "\n"
                        + "size: " + f.size + " bytes\n"
                        + contents);

                    spendsDataManager.restore(contents);
                };
                r.readAsText(f);
            } else {
                console.error("Failed to load file");
            }
        });
    }
};
