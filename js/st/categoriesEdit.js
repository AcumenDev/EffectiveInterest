$(function () {
    spendsDataManager.init();
    categoriesEdit.init();
});

var categoriesEdit = {
    init: function () {
        this.loadCategories();
    },

    loadCategories: function(){

        spendsDataManager.getCategories(function(categories){

             $("#categoriesJsGrid").jsGrid({

                 width: "100%",
                 height: "200px",
                 onItemInserted: function(arg) {
                    spendsDataManager.addCategory(arg.item);
                 },

                 onItemUpdated: function (arg) {
                    spendsDataManager.updateCategory(arg.item);
                 },
                 onItemDeleted: function (arg) {
                    spendsDataManager.deleteCategory(arg.item);
                 },

                 editing: true,
                 sorting: true,
                 paging: true,
                 inserting: true,

                 data: categories,

                 fields: [
                    {name: "categoryName", title: "Название", align: "center", type: "text"},
                    {type: "control", editButton: true, deleteButton: true}
                 ],

                 noDataContent: "Добавьте категории...",
                 deleteConfirm: "Это приведет к потере связей затрат с данной категорией! Вы уверены?"
             });
        });
    }
};