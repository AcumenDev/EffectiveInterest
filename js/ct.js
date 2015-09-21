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
			tx.executeSql("CREATE TABLE IF NOT EXISTS spends (ID INTEGER PRIMARY KEY ASC,date DateTime,sum float,description text)");
		});
	}

	spends.init.createCategoriesTable = function(){
		spends.init.db.transaction(function(tx){
			tx.executeSql("CREATE TABLE IF NOT EXISTS categories (ID INTEGER PRIMARY KEY ASC,name text)");
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
	spends.init.createSpendsTable();
	spends.init.createCategoriesTable();

});
