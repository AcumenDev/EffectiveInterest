function savePageToLocalStorage(pageId) {
    console.log("Сохранение формы страницы : " + pageId);
    $('#' + pageId).find("input").each(function (index) {
        var itemName = pageId + "_" + $(this).attr('name');

        switch ($(this).attr('type')) {
            case "checkbox":
            {
                console.log(index + ": " + itemName + " : " + Boolean($(this).prop('checked')));
                localStorage.setItem(itemName, $(this).prop('checked'));
                break;
            }
            case "text":
            {
                console.log(index + ": " + itemName + " : " + $(this).val());
                localStorage.setItem(itemName, $(this).val());
                break;
            }
        }
    })
}

function loadPageFromLocalStorage(pageId) {
    console.log("Загрузка формы страницы : " + pageId);
    $('#' + pageId).find("input").each(function (index) {
        var itemName = pageId + "_" + $(this).attr('name');

        switch ($(this).attr('type')) {
            case "checkbox":
            {
                $(this).prop("checked", ("true" == localStorage.getItem(itemName)));
                console.log(index + ": " + itemName + " : " + Boolean($(this).prop('checked')));
                break;
            }
            case "text":
            {
                $(this).val(localStorage.getItem(itemName));
                console.log(index + ": " + itemName + " : " + $(this).val());
                break;
            }
        }
    })
}