var spendsUI = {
    init: function () {
        this.context = $("#section_expense_report");
        this.setCategories();
        this.setDatepicker();
        this.setRecentSpends();

        this.context.find("button[name='addCategoryButton']").bind("click", this.showCategoryAddModal);
        $("#addCategoryModal").find("button[name='addCategory']").bind("click", this.addCategoryFromModal);
        this.context.find("button[name='addSpendButton']").bind("click", this.addSpend);
    },

    fillCategoriesSelect: function (categories) {
        spendsUI.context.find("select[name='spendСategory']").empty().append(
            $('<option selected="selected" disabled="disabled">-Select category-</option>')
        );

        for (var i = 0; i < categories.length; i++) {
            $("#section_expense_report").find("select[name='spendСategory']").append(
                $('<option value="' + categories[i].id + '">' + categories[i].categoryName + '</option>')
            );
        }
    },

    unixTimeToString: function (time) {
        //Ущербный код ))) очень)))
        var d = new Date(time * 1000)
        var yyyy = d.getFullYear()
        var mm = ('0' + (d.getMonth() + 1)).slice(-2)
        var dd = ('0' + d.getDate()).slice(-2)
        return dd + '.' + mm + '.' + yyyy;
    },

    fillRecentSpends: function (spends) {
        spendsUI.context.find("#showSpendForm").empty().append(
            $('<table class="table" id="spendsTable"><tr><td> id </td><td> дата </td><td> сумма </td><td> категория </td><td> описание </td></tr></table>')
        );

        for (var i = 0; i < spends.length; i++) {
            var item = spends[i];
            spendsUI.context.find("#spendsTable").append(
                '<tr><td> ' + item.id + ' </td><td> ' +
                spendsUI.unixTimeToString(item.spendDate) + ' </td><td> ' + item.sum + ' </td><td> ' + item.category + ' </td><td> ' + item.description + ' </td></tr>'
            );
        }
    },

    setCategories: function () {
        spendsDataManager.getCategories(this.fillCategoriesSelect);
    },

    setRecentSpends: function () {
        spendsDataManager.getSpends(0, 0, this.fillRecentSpends);
    },

    setDatepicker: function () {
        var datapicker = this.context.find("input[name='spendDate']");
        datapicker.datepicker({
            format: 'mm/dd/yyyy',
            todayBtn: true,
            language: "ru",
            autoclose: true,
            todayHighlight: true,
            toggleActive: true
        });
        datapicker.datepicker("setDate", new Date());
    },

    showCategoryAddModal: function () {
        // Вызов модального окна
        $("#addCategoryModal").modal();
    },

    addCategoryFromModal: function () {
        // Метод добавления категории из модального окна
        var newCategory = $("#addCategoryModal").find("input[name='newCategoryName']").val();
        if (newCategory != null) {

            spendsDataManager.addCategory(newCategory);


            //   alert("Добавлено: " + newCategory + "!");
        }
        $("#addCategoryModal").modal('hide');
        spendsUI.setCategories();
    },

    addSpend: function () {
        var date = Date.parse(spendsUI.context.find($("input[name='spendDate']")).val()) / 1000;
        var sum = spendsUI.context.find($("input[name='spendSum']")).val();
        var category = spendsUI.context.find($("select[name='spendСategory']")).find(":selected").val();
        var description = spendsUI.context.find($("input[name='spendDescription']")).val();

        if (!date || !sum || !category) {
            spendsUI.context.find($("input[name='spendDate']")).css('border-color', 'red');
            spendsUI.context.find($("input[name='spendSum']")).css('border-color', 'red');
            spendsUI.context.find($("select[name='spendСategory']")).css('border-color', 'red');
            alert("Заполните все поля!");
            return;
        }

        spendsDataManager.addSpend(date, sum, category, description);

        spendsUI.context.find($("input[name='spendDate']")).css('border-color', '');
        spendsUI.context.find($("input[name='spendSum']")).css('border-color', '');
        spendsUI.context.find($("select[name='spendСategory']")).css('border-color', '');

        spendsUI.context.find($("input[name='spendDate']")).val('');
        spendsUI.context.find($("input[name='spendSum']")).val('');
        spendsUI.context.find($("select[name='spendСategory'] option")).eq(0).prop('selected', true);
        spendsUI.context.find($("input[name='spendDescription']")).val('');
    }
};
