var spendsUI = {

    getDetailedSpendsForPeriod: function () {
        var fromDate = spendsUI.context.find($("input[name='spendsFromDate']"));
        var start = Date.parse(fromDate.val()) / 1000;
        var toDate = spendsUI.context.find($("input[name='spendsToDate']"));
        var end = Date.parse(toDate.val()) / 1000;

        var isValid = true;

        if (isNaN(start) || isNaN(end) || start > end) {
            isValid = false;
        }

        if (!isValid) {
            spendsUI.context.find($("input[name='spendsFromDate']")).css('border-color', 'red');
            spendsUI.context.find($("input[name='spendsToDate']")).css('border-color', 'red');
            return;
        }
        else {
            spendsUI.context.find($("input[name='spendsFromDate']")).css('border-color', '');
            spendsUI.context.find($("input[name='spendsToDate']")).css('border-color', '');
        }

        spendsUI.setDetailedSpends(start, end);
    },

    init: function () {
        this.context = $("#section_expense_report");
        this.setCategories();
        this.setDatepicker();
        this.getDetailedSpendsForPeriod();
        this.monthReport();
        this.context.find("button[name='addCategoryButton']").bind("click", this.showCategoryAddModal);
        this.context.find("input[name='spendsFromDate']").bind("change", this.getDetailedSpendsForPeriod);
        this.context.find("input[name='spendsToDate']").bind("change", this.getDetailedSpendsForPeriod);
        $("#addCategoryModal").find("button[name='addCategory']").bind("click", this.addCategoryFromModal);
        this.context.find("button[name='addSpendButton']").bind("click", this.addSpend);
        $("#monthForReport").datepicker({
            format: "MM yyyy",
            startView: "months",
            minViewMode: "months",
            language: "ru"
        });
        $("#monthForReport").datepicker("setDate", new Date());

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
        var monthTotal = 0.0;
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
                monthTotal += parseFloat(item.total);
            });
            $('#monthTotal').text(parseFloat(monthTotal).toFixed(2));
        });
    },

    setCategories: function (newCategory) {
        spendsDataManager.getCategories(function (categories) {
            var select = spendsUI.context.find("select[name='spendСategory']");
            select.empty();

            if (!categories.length > 0) {
                select.append($('<option selected="selected" value="-1" disabled="disabled">-Выберите категорию-</option>'));
            }

            for (var i = 0; i < categories.length; i++) {
                select.append($('<option value="' + categories[i].id + '">' + categories[i].name + '</option>'));
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
                spendsUI.bindDatePicker(this._editPicker, new Date(value * 1000));
                return this._editPicker;
            },

            editValue: function () {
                return Date.parse(this._editPicker.val()) / 1000;
            }
        });

        jsGrid.fields.date = MyDateField;

        spendsDataManager.getSpends(start, end, function (spends) {

            spendsDataManager.getCategories(function (categories) {

                $("#spendsJsGrid").jsGrid({
                    width: document.getElementById('spendsJsGrid').offsetWidth,
                    height: document.getElementById('spendsJsGrid').offsetHeight,
                    onItemUpdated: function (arg) {
                        spendsDataManager.updateSpend(arg.item);
                        spendsUI.getDetailedSpendsForPeriod();
                        spendsUI.monthReport();
                    },
                    onItemDeleted: function (arg) {
                        spendsDataManager.deleteSpend(arg.item);
                        spendsUI.monthReport();
                    },

                    editing: true,
                    sorting: true,
                    paging: true,

                    data: spends,

                    fields: [
                        {name: "spendDate", title: "Дата", align: "center", type: "date"},
                        {name: "sum", title: "Сумма", align: "center", type: "number"},
                        {
                            name: "category_id",
                            title: "Категория",
                            align: "center",
                            items: categories,
                            valueField: "id",
                            textField: "name",
                            type: "select"
                        },
                        {name: "description", title: "Комментарий", align: "center", type: "text"},
                        {type: "control", editButton: true, deleteButton: true}
                    ],
                    noDataContent: "За выбранный период ничего не найдено...",
                    deleteConfirm: "Вы уверены?"
                });

                var periodTotal = spends.reduce(function (sum, current) {
                    return sum + current.sum;
                }, 0.0);

                $('#periodTotal').text(periodTotal.toFixed(2));
            })
        });
    },

    bindDatePicker: function (bindToObject, value) {
        bindToObject.datepicker({
            format: 'mm/dd/yyyy',
            todayBtn: true,
            language: "ru",
            autoclose: true,
            todayHighlight: true,
            toggleActive: true
        });
        bindToObject.datepicker("setDate", value);
    },

    setDatepicker: function () {
        this.bindDatePicker(this.context.find("input[name='spendDate']"), new Date())
        this.bindDatePicker(this.context.find("input[name='spendsFromDate']"), new Date())
        this.bindDatePicker(this.context.find("input[name='spendsToDate']"), new Date())

    },

    showCategoryAddModal: function () {
        //Очистка поля ввода названия
        $("#addCategoryModal").find("input[name='newCategoryName']").val('');
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
        spendsUI.getDetailedSpendsForPeriod();
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

        if (!$.isNumeric(sum)) {
            sumText.css('border-color', 'red');
            isValidForm = false;
        } else {
            sumText.css('border-color', '');
        }

        if (!isValidForm) {
            return;
        }

        spendsDataManager.addSpend({
            "date": date,
            "sum": parseFloat(sum).toFixed(2),
            "categoryId": category,
            "description": description
        });

        descriptionText.val('');
        sumText.val('');
        spendsUI.getDetailedSpendsForPeriod();
        spendsUI.monthReport();
    }
};
