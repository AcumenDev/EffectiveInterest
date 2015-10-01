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
		spendsDataManager.db.transaction(function(tx){
			tx.executeSql("SELECT * FROM categories",[],function(tx,categories){
				$("#section_expense_report").find("select[name='spendСategory']").empty().append(
						$('<option selected="selected" disabled="disabled">-- Select category --</option>'));
				for (var i=0; i < categories.rows.length; i++) {
					$("#section_expense_report").find("select[name='spendСategory']").append(
						$('<option value="'+categories.rows.item(i).category_id+'">'+categories.rows.item(i).category+'</option>')
					);
				}
			});			
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
		
	$("#section_expense_report").find("button[name='addCategoryButton']").click(function(){
		
		var newCategory = prompt("Название категории: ", "");
			if (newCategory != null)
			{
				spendsDataManager.db.transaction(function(tx){
					tx.executeSql("INSERT INTO categories (category) VALUES (?)",[newCategory]);
					});
				alert("Добавлено!" + newCategory);				
			}	
		spendsUI.setCategoriesSelect();			
	})
	
	spendsDataManager.init();	
	
	spendsUI.setCategoriesSelect();
});
