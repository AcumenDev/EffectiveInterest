$(function() {
	var spends = {}
	spends.init = {}
	spends.init.db = {}
	
	// Для удобства помещаем функцию в глобальную переменную
	spends.init.open = function(){
		spends.init.db = openDatabase("spends","1.0","траты",1024*1024*5);
		// название БД, версия, описание, размер
	}

	spends.init.createTable = function(){
		var database = spends.init.db;
		database.transaction(function(tx){
			tx.executeSql("CREATE TABLE IF NOT EXISTS ызтвы (ID INTEGER PRIMARY KEY ASC,todo_item TEXT,due_date VARCHAR)", []);
		});
	}

// Календарь для выбора даты
	$('#spendDate').datepicker({
		"dateFormat":"dd.mm.yy",
		"dayNamesMin":["Вс","Пн","Вт","Ср","Чт","Пт","Сб"],
		"dayNames":["Воскресенье","Понедельник","Вторник","Среда","Четверг","Пятница","Суббота"],
		"firstDay":"1",
		"monthNames":["Январь","Февраль","Март","Апрель","Май","Июнь","Июль","Август","Сентябрь","Октябрь","Ноябрь","Декабрь"],
		"nextText":"Следующий",
		"prevText":"Предыдущий"
		});
});