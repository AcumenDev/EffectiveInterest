var spendsDataManager = {
    db: {},

// Для удобства помещаем функцию в глобальную переменную
    openDB: function () {
        this.db = openDatabase("spendsDB", "1.0", "", 1024 * 1024 * 5);
        // название БД, версия, описание, размер
    },

    createSpendsTable: function () {
        this.db.transaction(function (tx) {
            tx.executeSql("CREATE TABLE IF NOT EXISTS spends (id INTEGER PRIMARY KEY AUTOINCREMENT, spend_date INTEGER NOT NULL,sum FLOAT NOT NULL,description TEXT, category_id REFERENCES categories(category_id) NOT NULL)");
        });
    },

    createCategoriesTable: function () {
        this.db.transaction(function (tx) {
            tx.executeSql("CREATE TABLE IF NOT EXISTS categories (id INTEGER PRIMARY KEY AUTOINCREMENT, category TEXT NOT NULL)");
        });
    },

    setTestCategories: function () {
        this.db.transaction(function (tx) {
            tx.executeSql("INSERT INTO categories (id,category) VALUES (1,'продукты')");
        });
    },

    setTestSpends: function () {
        this.db.transaction(function (tx) {
            tx.executeSql("INSERT INTO spends (id,spend_date,sum,description,category_id) VALUES (1,20150924,500.0,'покупочки',1)");
        });
    },

    getCategories: function (fillCategoriesUICallback) {

        this.db.readTransaction(function (tx) {
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
    addCategory: function (categoryName) {
        this.db.transaction(function (tx) {
            tx.executeSql("INSERT INTO categories (category) VALUES (?)", [categoryName]);
        });

    },

    addSpend: function (date, sum, category, description) {

        this.db.transaction(function (tx) {
            tx.executeSql("INSERT INTO spends (sum,description,category_id,spend_date) VALUES (?,?,?,?)", [sum, description, category, date], function () {
                alert("Добавлено!");
            })
        });

    },

    getSpends: function (dateFrom, dateTo, fillRecentSpendsUICallback) {
        this.db.readTransaction(function (tx) {
            tx.executeSql("SELECT s.id, s.spend_date, s.sum, s.description, c.category FROM spends s LEFT JOIN categories c ON s.category_id= c.id;", [], function (tx, spends) {
                var result = [];
                for (var i = 0; i < spends.rows.length; i++) {
                    var row = spends.rows.item(i);
                    result[i] = {
                        id: row.id,
                        spendDate: row.spend_date,
                        category: row.category,
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