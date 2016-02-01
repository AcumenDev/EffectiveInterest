	//namespace
	var spendsDataManager = {}
	spendsDataManager.init = {}
	spendsDataManager.db={}	

	// Для удобства помещаем функцию в глобальную переменную
	spendsDataManager.openDB = function(){
		spendsDataManager.db = openDatabase("spendsDB","1.0","",1024*1024*5);
		// название БД, версия, описание, размер
	}

	spendsDataManager.createSpendsTable = function(){
		spendsDataManager.db.transaction(function(tx){
			tx.executeSql("CREATE TABLE IF NOT EXISTS spends (id INTEGER PRIMARY KEY AUTOINCREMENT, spendDate INTEGER NOT NULL,sum float NOT NULL,description text, category_id REFERENCES categories(category_id) NOT NULL)");
		});
	}

	spendsDataManager.createCategoriesTable = function(){
		spendsDataManager.db.transaction(function(tx){
			tx.executeSql("CREATE TABLE IF NOT EXISTS categories (id INTEGER PRIMARY KEY AUTOINCREMENT, category text NOT NULL)");
		});
	}

	spendsDataManager.setTestCategories = function(){
		spendsDataManager.db.transaction(function(tx){
			tx.executeSql("INSERT INTO categories (id,category) VALUES (1,'продукты')");
		});
	}

	spendsDataManager.setTestSpends = function(){
		spendsDataManager.db.transaction(function(tx){
			tx.executeSql("INSERT INTO spends (id,spendDate,sum,description,category_id) VALUES (1,20150924,500.0,'покупочки',1)");
		});
	}

	spendsDataManager.getCategories = function(fillCategoriesUICallback){

		spendsDataManager.db.readTransaction(function(tx){
			tx.executeSql("SELECT * FROM categories",[],function(tx,categories){
				var result = [];
				for(var i=0; i<categories.rows.length; i++){
					var row = categories.rows.item(i)
					result[i] = {	
						id: row.id,
						categoryName: row.category
					}
				}
				fillCategoriesUICallback(result);
			});
		});	
	}

	spendsDataManager.addSpend = function(date,sum,category,description){

		spendsDataManager.db.transaction(function(tx){
			tx.executeSql("INSERT INTO spends (sum,description,category_id,spendDate) values (?,?,?,?)",[sum,description,category,date],function(){
			alert("Добавлено!");
			})
		});

	}

	spendsDataManager.getSpends = function(dateFrom,dateTo,fillRecentSpendsUICallback){
		spendsDataManager.db.readTransaction(function(tx){
			tx.executeSql("SELECT * FROM spends",[],function(tx,spends){
				var result = [];
				for(var i=0; i<spends.rows.length; i++){
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
	}

	spendsDataManager.init = function(){
		spendsDataManager.openDB();
		spendsDataManager.createCategoriesTable();
		spendsDataManager.createSpendsTable();	
		/*
		spendsDataManager.setTestCategories();
		spendsDataManager.setTestSpends();			
		*/
	}