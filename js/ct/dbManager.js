var spendsDataManager = {
    db: {},
    logTag: "spendsDataManager ",

    openDB: function () {
        this.db = openDatabase("spendsDB", "1.0", "", 1024 * 1024 * 5);
        // название БД, версия, описание, размер
    },

    createSpendsTable: function () {
        this.db.transaction(function (tx) {
            spendsDataManager.executeAndShowSql(tx, "CREATE TABLE IF NOT EXISTS spends (id INTEGER PRIMARY KEY AUTOINCREMENT, spend_date INTEGER NOT NULL,sum FLOAT NOT NULL,description TEXT,category_id REFERENCES categories(category_id) NOT NULL)");
        });
    },

    createCategoriesTable: function () {
        this.db.transaction(function (tx) {
            spendsDataManager.executeAndShowSql(tx, "CREATE TABLE IF NOT EXISTS categories (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL)");
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

    executeAndShowSql: function (tx, sql, param, callback, errorCallback) {
            var positionParam = 0;
            newString = sql.replace(new RegExp("\\?", 'g'), function (str, p1, p2, offset, s) {
                positionParam++;
                return param[positionParam - 1];
            });
            console.log(this.logTag + "'" + newString + "'");

            if (errorCallback == null) {
                errorCallback = function (transaction, error) {
                    console.error(spendsDataManager.logTag + "errorCode: " + error.code + " message: " + error.message);
                };
            }

            tx.executeSql(sql, param, callback, errorCallback);
    },

    getCategories: function (resultCallback) {
        this.db.readTransaction(function (tx) {
            spendsDataManager.executeAndShowSql(tx, "SELECT * FROM categories", [], function (tx, categories) {
                var result = [];
                for (var i = 0; i < categories.rows.length; i++) {
                    var row = categories.rows.item(i)
                    result[i] = {
                        //TODO костыль для селекта грида
                        id: row.id.toString(),
                        categoryName: row.name
                    }
                }
                resultCallback(result);
            });
        });
    },

    addCategory: function (category) {
        this.db.transaction(function (tx) {
            if (category.id == null) {
                spendsDataManager.executeAndShowSql(tx, "INSERT INTO categories (name) VALUES (?)", [category.categoryName]);
            } else {
                spendsDataManager.executeAndShowSql(tx, "INSERT INTO categories (id,name) VALUES (?,?)", [category.id, category.categoryName]);
            }
        });
    },

    updateCategory:function(item){
        if (item == null) {
            return;
        }

        this.db.transaction(function (tx) {
            spendsDataManager.executeAndShowSql(tx, "UPDATE categories SET name=? WHERE id=?", [item.categoryName, item.id]);
        });
    },

    deleteCategory:function(item){
        if (item == null) {
            return;
        }

        this.db.transaction(function (tx) {
            spendsDataManager.executeAndShowSql(tx, "DELETE FROM categories WHERE id= ?", [item.id])
        });
    },

    addSpend: function (spend) {
        this.db.transaction(function (tx) {
            if (spend.id == null) {
                spendsDataManager.executeAndShowSql(tx, "INSERT INTO spends (sum,description,category_id,spend_date) VALUES (?,?,?,?)", [spend.sum, spend.description, spend.categoryId, spend.date]);
            } else {
                spendsDataManager.executeAndShowSql(tx, "INSERT INTO spends (id,sum,description,category_id,spend_date) VALUES (?,?,?,?,?)", [spend.id, spend.sum, spend.description, spend.categoryId, spend.date]);
            }
        });
    },

    updateSpend: function (item) {
        if (item == null) {
            return;
        }

        this.db.transaction(function (tx) {
            spendsDataManager.executeAndShowSql(tx, "UPDATE spends SET sum=?,description=?,category_id=?,spend_date=? WHERE id=?", [item.sum, item.description, item.category_id, item.spendDate, item.id])
        });
    },

    deleteSpend: function (item) {
        if (item == null) {
            return;
        }

        this.db.transaction(function (tx) {
            spendsDataManager.executeAndShowSql(tx, "DELETE FROM spends WHERE id=?", [item.id])
        });
    },

    getSpends: function (dateFrom, dateTo, resultCollback) {

        if (isNaN(dateFrom)) {
            dateFrom = 0;
        }
        if (isNaN(dateTo)) {
            dateTo = 0;
        }

        this.db.readTransaction(function (tx) {
            spendsDataManager.executeAndShowSql(tx, "SELECT s.id, s.spend_date, s.sum, s.description, s.category_id FROM spends s WHERE (?=0 OR s.spend_date>=?) AND (?=0 OR s.spend_date<=?)", [dateFrom, dateFrom, dateTo, dateTo], function (tx, spends) {
                var result = [];
                for (var i = 0; i < spends.rows.length; i++) {
                    var row = spends.rows.item(i);
                    result[i] = {
                        id: row.id,
                        spendDate: row.spend_date,
                        category_id: row.category_id,
                        sum: row.sum,
                        description: row.description == null ? '' : row.description
                    }
                }
                resultCollback(result);
            });
        });
    },

    getSpendsForMonth: function (resultCollback) {

        this.db.readTransaction(function (tx) {
            spendsDataManager.executeAndShowSql(tx, "SELECT c.name, sum(s.sum) as total FROM spends s LEFT JOIN categories c ON s.category_id = c.id group by c.name", [], function (tx, spends) {
                var result = [];
                for (var i = 0; i < spends.rows.length; i++) {
                    var row = spends.rows.item(i);
                    result[i] = {
                        category: row.name,
                        total: row.total
                    }
                }
                resultCollback(result);
            });
        });
    },

    convertResults: function (resultset) {
        var results = [];
        for (var i = 0, len = resultset.rows.length; i < len; i++) {
            var row = resultset.rows.item(i);
            var result = {};
            for (var key in row) {
                result[key] = row[key];
            }
            results.push(result);
        }
        return results;
    },

    backup: function (table) {
        var def = new $.Deferred();
        this.db.readTransaction(function (tx) {
            spendsDataManager.executeAndShowSql(tx, "select * from " + table, [], function (tx, results) {
                var data = spendsDataManager.convertResults(results);
                console.dir(data);
                def.resolve(data);
            });
        });

        return def;
    },

    restore: function (backup) {
        var data = JSON.parse(backup);

        this.clearDb();

        for (var y = 0; y < data.categories.length; y++) {
            this.addCategory(data.categories[y]);
        }

        for (var i = 0; i < data.spends.length; i++) {
            var spend = data.spends[i];
            this.addSpend({
                "date": spend.spend_date,
                "sum": spend.sum,
                "categoryId": spend.category_id,
                "description": spend.description
            });
        }
    },

    clearDb: function (table) {

        if (table === undefined)
        {
            var tableNames = ['spends', 'categories', 'sqlite_sequence'];
            this.db.transaction(function (tx) {
                for (var i = 0; i < tableNames.length; i++) {
                    spendsDataManager.executeAndShowSql(tx, "delete from " + tableNames[i] + ";")
                }
            });
            return;
        }
        if (table == 'spends')
        {
            this.db.transaction(function (tx) {
                spendsDataManager.executeAndShowSql(tx, "delete from " + table + ";")
            });
            return;
        }
        if (table == 'categories')
        {
            this.db.transaction(function (tx) {
                spendsDataManager.executeAndShowSql(tx, "delete from " + table + ";")
            });
            return;
        }
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
