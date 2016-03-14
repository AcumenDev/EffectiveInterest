var spendsUI = {

    getSpendsCurrentDay: function () {
        var fromDate = spendsUI.context.find($("input[name='spendsFromDate']"));
        var start = Date.parse(fromDate.val()) / 1000;
        var toDate = spendsUI.context.find($("input[name='spendsToDate']"));
        var end = Date.parse(toDate.val()) / 1000;
        spendsUI.setDetailedSpends(start, end);
    },

    init: function () {
        this.context = $("#section_expense_report");
        this.setCategories();
        this.setDatepicker();
        this.getSpendsCurrentDay();
        this.monthReport();
        this.context.find("button[name='addCategoryButton']").bind("click", this.showCategoryAddModal);
        this.context.find("button[name='refreshSpendsButton']").bind("click", this.getSpendsCurrentDay);
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
                select.append($('<option selected="selected" value="-1" disabled="disabled">-Select category-</option>'));
            }

            for (var i = 0; i < categories.length; i++) {
                select.append($('<option value="' + categories[i].id + '">' + categories[i].categoryName + '</option>'));
            }

            spendsUI.context.find($("select[name='spendСategory'] option")).filter(function () {
                return $(this).text() == newCategory;
            }).prop('selected', true)
        });
    },

    setDetailedSpends: function (start, end) {

        var MyDateField = function (config) {
            jsGrid.Field.call(this, config);
        };

        MyDateField.prototype = new jsGrid.Field({

            sorter: function (date1, date2) {
                return date1 - date2;
            },

            itemTemplate: function (value) {
                return spendsUI.unixTimeToString(value);
            },

            editTemplate: function (value) {
                this._editPicker = $("<input>");

                this._editPicker.datepicker({
                    format: 'mm/dd/yyyy',
                    todayBtn: true,
                    language: "ru",
                    autoclose: true,
                    todayHighlight: true,
                    toggleActive: true
                });
                this._editPicker.datepicker("setDate", new Date(value * 1000));
                return this._editPicker;
            },

            editValue: function () {
                return Date.parse(this._editPicker.val()) / 1000;
            }
        });

        jsGrid.fields.date = MyDateField;

        spendsDataManager.getSpends(start, end, function (spends) {

            spendsDataManager.getCategories(function (categories) {

                $("#jsGrid").jsGrid({
                    width: "100%",
                    height: "200px",
                    onItemUpdated: function (arg) {
                        spendsDataManager.updateSpend(arg.item);
                    },
                    onItemDeleted: function (arg) {
                        spendsDataManager.deleteSpend(arg.item);
                    },

                    editing: true,
                    sorting: true,
                    paging: true,

                    data: spends,

                    fields: [
                        {name: "spendDate", title: "Дата", align: "center", type: "date"},
                        {name: "sum", title: "Сумма", align: "center", type: "number"},
                        //TODO нездоровый селект
                        {
                            name: "category_id",
                            title: "Категория",
                            align: "center",
                            items: categories,
                            valueField: "id",
                            textField: "categoryName",
                            type: "select"
                        },
                        {name: "description", title: "Описание", align: "center", type: "textarea"},
                        {type: "control", editButton: true, deleteButton: true}
                    ]
                })
            })
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

        var spendsFromDatepicker = this.context.find("input[name='spendsFromDate']");
        spendsFromDatepicker.datepicker({
            format: 'mm/dd/yyyy',
            todayBtn: true,
            language: "ru",
            autoclose: true,
            todayHighlight: true,
            toggleActive: true
        });
        spendsFromDatepicker.datepicker("setDate", new Date());

        var spendsToDatepicker = this.context.find("input[name='spendsToDate']");
        spendsToDatepicker.datepicker({
            format: 'mm/dd/yyyy',
            todayBtn: true,
            language: "ru",
            autoclose: true,
            todayHighlight: true,
            toggleActive: true
            });
            spendsToDatepicker.datepicker("setDate", new Date());
    },

    showCategoryAddModal: function () {
        // Вызов модального окна
        $("#addCategoryModal").modal();
    },

    addCategoryFromModal: function () {
        // Метод добавления категории из модального окна
        var newCategory = $("#addCategoryModal").find("input[name='newCategoryName']").val();
        if (newCategory != null) {
            spendsDataManager.addCategory({"name": newCategory});
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

        var isValidForm = true;


        if (!date) {
            spendDate.css('border-color', 'red');
            isValidForm = false;
        } else {
            spendDate.css('border-color', '');
        }

        if (category == -1) {
            categorySelect.css('border-color', 'red');
            isValidForm = false;
        } else {
            categorySelect.css('border-color', '');
        }

        if (!sum) {
            sumText.css('border-color', 'red');
            isValidForm = false;
        } else {
            sumText.css('border-color', '');
        }

        if (!isValidForm) {
            return;
        }

        spendsDataManager.addSpend({"date": date, "sum": sum, "categoryId": category, "description": description});

        descriptionText.val('');
        sumText.val('');
        spendsUI.getSpendsCurrentDay();
        spendsUI.monthReport();
    }
};
