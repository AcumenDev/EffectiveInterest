var spendsDataManager = {
    db: {},
    logTag: "spendsDataManager ",

    openDB: function () {
        this.db = openDatabase("spendsDB", "1.0", "", 1024 * 1024 * 5);
        // название БД, версия, описание, размер
    },

    createSpendsTable: function () {
        this.db.transaction(function (tx) {
            spendsDataManager.executeAndShowSql(tx, "CREATE TABLE IF NOT EXISTS spends (id INTEGER PRIMARY KEY AUTOINCREMENT, spend_date INTEGER NOT NULL,sum FLOAT NOT NULL,description TEXT, category_id REFERENCES categories(category_id) NOT NULL)");
        });
    },

    createCategoriesTable: function () {
        this.db.transaction(function (tx) {
            spendsDataManager.executeAndShowSql(tx, "CREATE TABLE IF NOT EXISTS categories (id INTEGER PRIMARY KEY AUTOINCREMENT, category TEXT NOT NULL)");
        });
    },

    setTestCategories: function () {
        this.db.transaction(function (tx) {
            spendsDataManager.executeAndShowSql(tx, "INSERT INTO categories (id,category) VALUES (1,'продукты')");
        });
    },

    setTestSpends: function () {
        this.db.transaction(function (tx) {
            spendsDataManager.executeAndShowSql(tx, "INSERT INTO spends (id,spend_date,sum,description,category_id) VALUES (1,20150924,500.0,'покупочки',1)");
        });
    },

    getCategories: function (resultCallback) {
        this.db.readTransaction(function (tx) {
            spendsDataManager.executeAndShowSql(tx, "SELECT * FROM categories", [], function (tx, categories) {
                var result = [];
                for (var i = 0; i < categories.rows.length; i++) {
                    var row = categories.rows.item(i)
                    result[i] = {
                        id: row.id,
                        categoryName: row.category
                    }
                }
                resultCallback(result);
            });
        });
    },

    addCategory: function (categoryName) {
        this.db.transaction(function (tx) {
            spendsDataManager.executeAndShowSql(tx, "INSERT INTO categories (category) VALUES (?)", [categoryName]);
        });
    },

    addSpend: function (date, sum, category, description) {

        this.db.transaction(function (tx) {
            spendsDataManager.executeAndShowSql(tx, "INSERT INTO spends (sum,description,category_id,spend_date) VALUES (?,?,?,?)", [sum, description, category, date], function () {
                console.log(spendsDataManager.logTag + "addSpend Добавлено.");
            })
        });
    },

    executeAndShowSql: function (tx, sql, param, callback, errorCallback) {
        function replacer(str, p1, p2, offset, s) {
            positionParam++;
            return param[positionParam - 1];
        }

        var positionParam = 0;
        newString = sql.replace(new RegExp("\\?", 'g'), replacer);
        console.log(this.logTag + "'" + newString + "'");

        tx.executeSql(sql, param, callback, errorCallback);
    },

    getSpends: function (dateFrom, dateTo, resultCollback) {

        if (isNaN(dateFrom)) {
            dateFrom = 0;
        }
        if (isNaN(dateTo)) {
            dateTo = 0;
        }

        this.db.readTransaction(function (tx) {
            spendsDataManager.executeAndShowSql(tx, "SELECT s.id, s.spend_date, s.sum, s.description, c.category FROM spends s LEFT JOIN categories c ON s.category_id= c.id WHERE (?=0 OR s.spend_date>=?) AND (?=0 OR s.spend_date<=?)", [dateFrom, dateFrom, dateTo, dateTo], function (tx, spends) {
                var result = [];
                for (var i = 0; i < spends.rows.length; i++) {
                    var row = spends.rows.item(i);
                    result[i] = {
                        id: row.id,
                        spendDate: row.spend_date,
                        category: row.category,
                        sum: row.sum,
                        description: !row.description ? '' : row.description
                    }
                }
                resultCollback(result);
            });
        });
    },

    getSpendsForMonth: function (resultCollback) {

        this.db.readTransaction(function (tx) {
            spendsDataManager.executeAndShowSql(tx, "SELECT c.category, sum(s.sum) as total FROM spends s LEFT JOIN categories c ON s.category_id = c.id group by c.category", [], function (tx, spends) {
                var result = [];
                for (var i = 0; i < spends.rows.length; i++) {
                    var row = spends.rows.item(i);
                    result[i] = {
                        category: row.category,
                        total: row.total
                    }
                }
                resultCollback(result);
            });
        });
    },

    init: function () {
        this.openDB();
        this.createCategoriesTable();
        this.createSpendsTable();
        /*
         setTestCategories();
         setTestSpends();
         */
    }
};