	var spendsUI = {}
	spendsUI.init = {}

	spendsUI.fillCategoriesSelect = function(categories){

		$("#section_expense_report").find("select[name='spendСategory']").empty().append(
		$('<option selected="selected" disabled="disabled">-Select category-</option>'));

		for (var i=0; i < categories.length; i++) {
			$("#section_expense_report").find("select[name='spendСategory']").append(
				$('<option value="'+categories[i].id+'">'+categories[i].categoryName+'</option>')
			);
		}
	}

	spendsUI.fillRecentSpends = function(){
		//TODO дописать заполнение недавних трат (за сегодняшний день)
	}

	spendsUI.setCategories = function(){
		spendsDataManager.getCategories(spendsUI.fillCategoriesSelect);
	}
	
	spendsUI.setDatepicker = function(){
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
		var date = Date.parse($("#section_expense_report").find($("input[name='spendDate']")).val())/1000;
		var sum = $("#section_expense_report").find($("input[name='spendSum']")).val();
		var category= $("#section_expense_report").find($("select[name='spendСategory']")).find(":selected").val();
		var description =  $("#section_expense_report").find($("input[name='spendDescription']")).val();

		if (!date || !sum || !category)
		{
			$("#section_expense_report").find($("input[name='spendDate']")).css('border-color','red');
            $("#section_expense_report").find($("input[name='spendSum']")).css('border-color','red');
            $("#section_expense_report").find($("select[name='spendСategory']")).css('border-color','red');
            alert("Заполните все поля!");
			return;
		}

		spendsDataManager.addSpend(date,sum,category,description);

		$("#section_expense_report").find($("input[name='spendDate']")).css('border-color','');
        $("#section_expense_report").find($("input[name='spendSum']")).css('border-color','');
        $("#section_expense_report").find($("select[name='spendСategory']")).css('border-color','');

		$("#section_expense_report").find($("input[name='spendDate']")).val('');
  		$("#section_expense_report").find($("input[name='spendSum']")).val('');
   		$("#section_expense_report").find($("select[name='spendСategory'] option")).eq(0).prop('selected',true);
   		$("#section_expense_report").find($("input[name='spendDescription']")).val('');
	}

	spendsUI.init = function(){
		spendsUI.setCategories();
		spendsUI.setDatepicker();

		$("#section_expense_report").find("button[name='addCategoryButton']").bind("click",spendsUI.showCategoryAddModal);
		$("#addCategoryModal").find("button[name='addCategory']").bind("click",spendsUI.addCategoryFromModal);
		$("#section_expense_report").find("button[name='addSpendButton']").bind("click",spendsUI.addSpend);
	}