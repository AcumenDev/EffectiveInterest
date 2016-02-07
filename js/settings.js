$(function() {
    spendsDataManager.init();
    settings.init();
});

var settings = {
    init: function() 
    {
        exportBtn = $("input[name='export_db']").bind("click", function(e) {
            e.preventDefault();
            console.log("Begin backup process");
            
            $.when(
            spendsDataManager.backup("categories"), 
            spendsDataManager.backup("spends"), 
            spendsDataManager.backup("sqlite_sequence")
            
            ).then(function(categories, spends, sqlite_sequence) {
                console.log("All done");
                //Convert to JSON
                var data = {
                    categories: categories,
                    spends: spends,
                    sqlite_sequence: sqlite_sequence
                };
                var serializedData =data;// JSON.stringify(data);
                console.log(serializedData);
                settings.downloadDb(serializedData);
            });
            
            // settings.downloadDb();
        });
    },
    
    downloadDb: function(obj) {
        //   var obj = {
        //       a: 123,
        //       b: "4 5 6"
        //  };
        var data = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(obj));
        
        var a = document.createElement('a');
        a.href = 'data:' + data;
        a.download = 'data.json';
        a.innerHTML = 'download JSON';
        a.click();
    }


}
