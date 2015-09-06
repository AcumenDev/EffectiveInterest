$(function () {
    loadPageFromLocalStorage("iis");
    $("#calk_button_iis").click(calculate_iis);
});


function calculate_iis() {

    savePageToLocalStorage("iis");
}