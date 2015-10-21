	var spendsUI = {}
	spendsUI.init = {}

	spendsUI.setCategoriesSelect = function(){
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
		
	spendsUI.addCategoryfromModal = function(){		
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
		spendsUI.setCategoriesSelect();			
	}
		
	spendsUI.init = function(){
		spendsUI.setCategoriesSelect();
		spendsUI.setDatapicker();
		$("#section_expense_report").find("button[name='addCategoryButton']").bind("click",spendsUI.showCategoryAddModal);
		$("#addCategoryModal").find("button[name='addCategory']").bind("click",spendsUI.addCategoryfromModal);
	}	