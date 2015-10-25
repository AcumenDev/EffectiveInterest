	var spendsUI = {}
	spendsUI.init = {}

	spendsUI.fillCategoriesSelect = function(categories){

		$("#section_expense_report").find("select[name='spendСategory']").empty().append(
		$('<option selected="selected" disabled="disabled">-- Select category --</option>'));

		for (var i=0; i < categories.length; i++) {
			$("#section_expense_report").find("select[name='spendСategory']").append(
				$('<option value="'+categories[i].id+'">'+categories[i].categoryName+'</option>')
			);
		}
	}
	
	spendsUI.setCategories = function(){
		spendsDataManager.getCategories(spendsUI.fillCategoriesSelect);
	}
	
	spendsUI.setDatapicker = function(){
	// Календарь для выбора даты
	$("#section_expense_report").find("input[name='spendDate']").datepicker({
		todayBtn: true,
		language: "ru",
		autoclose: true,
		todayHighlight: true,
		toggleActive: true
	});
	
	}

	spendsUI.showCategoryAddModal = function(){
		// Вызов модального окна
		$("#addCategoryModal").modal();
	}
		
	spendsUI.addCategoryFromModal = function(){
		// Метод добавления категории из модального окна
		var newCategory = $("#addCategoryModal").find("input[name='newCategoryName']").val();
		if (newCategory != null)
		{
			spendsDataManager.db.transaction(function(tx){
				tx.executeSql("INSERT INTO categories (category) VALUES (?)",[newCategory]);
			});
			alert("Добавлено: " + newCategory+"!");				
		}				
		$("#addCategoryModal").modal('hide');
		spendsUI.setCategories();
	}

	spendsUI.addSpend = function(){
		var date = $("#section_expense_report").find($("input[name='spendDate']")).val();
		var summ = $("#section_expense_report").find($("input[name='spendSum']")).val();
		var category= $("#section_expense_report").find($("select[name='spendСategory']")).find(":selected").val();
		var description =  $("#section_expense_report").find($("input[name='spendDescription']")).val();

		//TODO тут будет валидация

		spendsDataManager.AddSpend(date,sum,category,description);
	}

	spendsUI.init = function(){
		spendsUI.setCategories();
		spendsUI.setDatapicker();
		$("#section_expense_report").find("button[name='addCategoryButton']").bind("click",spendsUI.showCategoryAddModal);
		$("#addCategoryModal").find("button[name='addCategory']").bind("click",spendsUI.addCategoryFromModal);
		$("#section_expense_report").find("button[name='addSpendButton']").bind("click",spendsUI.addSpend);
	}	