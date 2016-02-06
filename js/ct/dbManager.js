var spendsDataManager = {
    db: {},

// Для удобства помещаем функцию в глобальную переменную
    openDB: function () {
        db = openDatabase("spendsDB", "1.0", "", 1024 * 1024 * 5);
        // название БД, версия, описание, размер
    },

    createSpendsTable: function () {
        db.transaction(function (tx) {
            tx.executeSql("CREATE TABLE IF NOT EXISTS spends (id INTEGER PRIMARY KEY AUTOINCREMENT, spendDate INTEGER NOT NULL,sum FLOAT NOT NULL,description TEXT, category_id REFERENCES categories(category_id) NOT NULL)");
        });
    },

    createCategoriesTable: function () {
        db.transaction(function (tx) {
            tx.executeSql("CREATE TABLE IF NOT EXISTS categories (id INTEGER PRIMARY KEY AUTOINCREMENT, category TEXT NOT NULL)");
        });
    },

    setTestCategories: function () {
        db.transaction(function (tx) {
            tx.executeSql("INSERT INTO categories (id,category) VALUES (1,'продукты')");
        });
    },

    setTestSpends: function () {
        db.transaction(function (tx) {
            tx.executeSql("INSERT INTO spends (id,spendDate,sum,description,category_id) VALUES (1,20150924,500.0,'покупочки',1)");
        });
    },

    getCategories: function (fillCategoriesUICallback) {

        db.readTransaction(function (tx) {
            tx.executeSql("SELECT * FROM categories", [], function (tx, categories) {
                var result = [];
                for (var i = 0; i < categories.rows.length; i++) {
                    var row = categories.rows.item(i)
                    result[i] = {
                        id: row.id,
                        categoryName: row.category
                    }
                }
                fillCategoriesUICallback(result);
            });
        });
    },

    addSpend: function (date, sum, category, description) {

        db.transaction(function (tx) {
            tx.executeSql("INSERT INTO spends (sum,description,category_id,spendDate) VALUES (?,?,?,?)", [sum, description, category, date], function () {
                alert("Добавлено!");
            })
        });

    },

    getSpends: function (dateFrom, dateTo, fillRecentSpendsUICallback) {
        db.readTransaction(function (tx) {
            tx.executeSql("SELECT * FROM spends", [], function (tx, spends) {
                var result = [];
                for (var i = 0; i < spends.rows.length; i++) {
                    var row = spends.rows.item(i);
                    result[i] = {
                        id: row.id,
                        spendDate: row.spendDate,
                        category_id: row.category_id,
                        sum: row.sum,
                        description: row.description
                    }
                }
                fillRecentSpendsUICallback(result);
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