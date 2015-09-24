$(function() {

	//namespace
	var spends = {}
	spends.init = {}
	spends.init.db={}

	// Для удобства помещаем функцию в глобальную переменную
	spends.init.open = function(){
		spends.init.db = openDatabase("spendsDB","1.0","",1024*1024*5);
		// название БД, версия, описание, размер
	}

	spends.init.createSpendsTable = function(){
		spends.init.db.transaction(function(tx){
			tx.executeSql("CREATE TABLE IF NOT EXISTS spends (spend_id int NOT NULL PRIMARY KEY, date Date,sum float,description text, category_id REFERENCES categories(category_id))");
		});
	}

	spends.init.createCategoriesTable = function(){
		spends.init.db.transaction(function(tx){
			tx.executeSql("CREATE TABLE IF NOT EXISTS categories (category_id int NOT NULL PRIMARY KEY, category text)");
		});
	}

	spends.init.setDefaultCategories = function(){
		spends.init.db.transaction(function(tx){
			tx.executeSql("INSERT INTO categories (category_id,category) VALUES (1,'Продукты')");
		});
	}

	spends.init.setTestSpends = function(){
		spends.init.db.transaction(function(tx){
			tx.executeSql("INSERT INTO spends (spend_id,date,sum,description,category_id) VALUES (1,20150924,500.0,'покупочки',1)");
		});
	}

	// Календарь для выбора даты
	$("#section_expense_report").find("input[name='spendDate']").datepicker({
		todayBtn: true,
		language: "ru",
		autoclose: true,
		todayHighlight: true,
		toggleActive: true
	});

	spends.init.open();
	spends.init.createCategoriesTable();
	spends.init.createSpendsTable();	
	spends.init.setDefaultCategories();
	spends.init.setTestSpends();

});
