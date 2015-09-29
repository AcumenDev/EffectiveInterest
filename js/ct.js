$(function() {
	
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
		spendsDataManager.db.transaction(function(tx){
			tx.executeSql("SELECT * FROM categories",[],function(tx,results){				
				return results;
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
	
	var spendsUI = {}

	spendsUI.setCategoriesSelect = function()
	{
		//TODO Разобраться почему categories undefined
		var categories = spendsDataManager.getCategories();
		categories.forEach(function(category,i,categories){
			$("#spendСategory").append(
				$('<option value="'+category.category_id+'">'+category.text+'</option>')
			);
		});
	}
	
	// Календарь для выбора даты
	$("#spendDate").datepicker({
		todayBtn: true,
		language: "ru",
		autoclose: true,
		todayHighlight: true,
		toggleActive: true
	});
		
	$("#addCategory_button").click(function(){
		
		var newCategory = prompt("Название категории: ", "");
			if (newCategory != null)
			{
				spendsDataManager.db.transaction(function(tx){
					tx.executeSql("INSERT INTO categories (category) VALUES (?)",[newCategory]);
					});
				alert("Добавлено!" + newCategory);
			}		
	})
	
	spendsDataManager.init();	
	
	spendsUI.setCategoriesSelect();
});
