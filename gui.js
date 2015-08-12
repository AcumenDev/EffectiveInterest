$(function() {
    $("input[name='summ']").val(localStorage.getItem("summ"));
    $("input[name='mounts']").val(localStorage.getItem("mounts"));
    $("input[name='percent']").val(localStorage.getItem("percent"));
    $("input[name='isCapitalization']").prop("checked", ("true" == localStorage.getItem("isCapitalization")));
    $("input[name='add_summ']").val(localStorage.getItem("add_summ"));
    $("#calk_button").click(function() {
        var summ = parseFloat($("input[name='summ']").val());
        var mounts = parseInt($("input[name='mounts']").val());
        var percent = parseFloat($("input[name='percent']").val());
        var isCapitalization = $("input[name='isCapitalization']").prop('checked');
        var add_summ = parseFloat($("input[name='add_summ']").val());
        localStorage.setItem("summ", summ);
        localStorage.setItem("mounts", mounts);
        localStorage.setItem("percent", percent);
        localStorage.setItem("isCapitalization", isCapitalization);
        localStorage.setItem("add_summ", percent);
        if (isNaN(add_summ)) {
            add_summ = 0;
        }
        Chart.defaults.global.multiTooltipTemplate = "<%= datasetLabel %> - <%= value %>";
        var data = CalculateDeposit(percent, mounts, isCapitalization, summ, add_summ);
        $("#maturity_value").text(data.total);
        $("#total_interest").text(data.total_interest);
        var lineChartData = {
            labels: data.pay_percents.map(function(item) {
                return item['mount'];
            }),
            datasets: [{
                label: "Сумма на депозите по месяцам",
                fillColor: "rgba(220,220,220,0.2)",
                strokeColor: "rgba(220,220,220,1)",
                pointColor: "rgba(220,220,220,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(220,220,220,1)",
                data: data.pay_percents.map(function(item) {
                    return item['total'];
                })
            }]
        };
        var d = document.getElementById("canvashome");
        var d_nested = document.getElementById("canvas");
        var throwawayNode = d.removeChild(d_nested);
        var canvas = document.createElement("canvas");
        canvas.setAttribute("id", "canvas");
        document.getElementById('canvashome').appendChild(canvas);
        var ctx = document.getElementById("canvas").getContext("2d");
        window.myLine = new Chart(ctx).Line(lineChartData, {
            responsive: true
        });
    });
});