var spendsUI = {
    getSpendsCurrentDay: function () {
        var start = new Date();
        start.setHours(0, 0, 0, 0);

        var end = new Date();
        end.setHours(23, 59, 59, 999);
        this.setRecentSpends(start.getTime() / 1000, end.getTime() / 1000);
    },

    init: function () {
        this.context = $("#section_expense_report");
        this.setCategories();
        this.setDatepicker();
        this.getSpendsCurrentDay();
        this.monthReport();
        this.context.find("button[name='addCategoryButton']").bind("click", this.showCategoryAddModal);
        $("#addCategoryModal").find("button[name='addCategory']").bind("click", this.addCategoryFromModal);
        this.context.find("button[name='addSpendButton']").bind("click", this.addSpend);
    },

    unixTimeToString: function (time) {
        //Ущербный код ))) очень)))
        var d = new Date(time * 1000)
        var yyyy = d.getFullYear()
        var mm = ('0' + (d.getMonth() + 1)).slice(-2)
        var dd = ('0' + d.getDate()).slice(-2)
        return dd + '.' + mm + '.' + yyyy;
    },

    monthReport: function () {
        spendsDataManager.getSpendsForMonth(function (result) {
            var monthReportTable = $('.monthReport-table');
            var tableBody = monthReportTable.find("#tableFormBody");
            tableBody.empty();
            result.forEach(function (item, i, arr) {
                var blankRow = monthReportTable.find("tr.blank").clone();
                blankRow.removeClass('blank');
                var tmpRow = _.template(blankRow[0].outerHTML);
                var dataRow = tmpRow(item);
                tableBody.prepend(dataRow);
            });
        });
    },

    setCategories: function (newCategory) {
        spendsDataManager.getCategories(function (categories) {
            var select = spendsUI.context.find("select[name='spendСategory']");
            select.empty();

            if (!categories.length > 0) {
                select.append($('<option selected="selected" disabled="disabled">-Select category-</option>'));
            }

            for (var i = 0; i < categories.length; i++) {
                select.append($('<option value="' + categories[i].id + '">' + categories[i].categoryName + '</option>'));
            }

            spendsUI.context.find($("select[name='spendСategory'] option")).filter(function () {
                return $(this).text() == newCategory;
            }).prop('selected', true)
        });
    },

    setRecentSpends: function (start, end) {
        spendsDataManager.getSpends(start, end, function (spends) {
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
        });
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
        }
        $("#addCategoryModal").modal('hide');
        spendsUI.setCategories(newCategory);
    },

    addSpend: function () {
        var spendDate = spendsUI.context.find($("input[name='spendDate']"));
        var sumText = spendsUI.context.find($("input[name='spendSum']"));
        var categorySelect = spendsUI.context.find($("select[name='spendСategory']"));
        var descriptionText = spendsUI.context.find($("input[name='spendDescription']"));

        var date = Date.parse(spendDate.val()) / 1000;
        var sum = sumText.val();
        var category = categorySelect.find(":selected").val();
        var description = descriptionText.val();

        if (!date || !sum || !category) {
            spendDate.css('border-color', 'red');
            sumText.css('border-color', 'red');
            descriptionText.css('border-color', 'red');
            //  alert("Заполните все поля!");
            return;
        }

        spendsDataManager.addSpend(date, sum, category, description);

        spendDate.css('border-color', '');
        sumText.css('border-color', '');
        categorySelect.css('border-color', '');

        descriptionText.val('');
        sumText.val('');
        spendsUI.getSpendsCurrentDay();
        spendsUI.monthReport();
    }
};
