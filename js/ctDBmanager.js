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
			tx.executeSql("CREATE TABLE IF NOT EXISTS spends (spend_id INTEGER PRIMARY KEY ASC, date Date,sum float,description text, category_id REFERENCES categories(category_id))");
		});
	}

	spendsDataManager.createCategoriesTable = function(){
		spendsDataManager.db.transaction(function(tx){
			tx.executeSql("CREATE TABLE IF NOT EXISTS categories (category_id INTEGER PRIMARY KEY ASC, category text)");
		});
	}

	spendsDataManager.setTestCategories = function(){
		spendsDataManager.db.transaction(function(tx){
			tx.executeSql("INSERT INTO categories (category_id,category) VALUES (1,'продукты')");
		});
	}

	spendsDataManager.setTestSpends = function(){
		spendsDataManager.db.transaction(function(tx){
			tx.executeSql("INSERT INTO spends (spend_id,date,sum,description,category_id) VALUES (1,20150924,500.0,'покупочки',1)");
		});
	}
	
	spendsDataManager.getCategories = function(){
		
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