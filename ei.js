///////////////////////////
//var percent_In_Year = 10;
//var mount = 24;
//var capitalization = true;
//var first_payment = 100000;
///////////////////////////
function CalculateDeposit(percent_In_Year, mount, capitalization, first_payment, add_summ) {
    var percent_In_Mount = percent_In_Year / 12;
    var total = first_payment;
    var total_interest = 0;
	var all_made = first_payment;
	
    var result = new Object();
    console.log("Сумма на момент открытия вклада: ", total, " процент по вкладу: ", percent_In_Year, "%", "Ежемесячная процентная ставка:", percent_In_Mount, "%", "капитализация :", capitalization);
    result.pay_percents = new Array();
    result.pay_percents.push({
        'mount': 0,
        'total': first_payment.toFixed(2)
    });
    for (var i = 1; i <= mount; i++) {
        var pay_percent = (capitalization ? total : first_payment) / 100 * percent_In_Mount;
		total_interest += pay_percent;
        total = total + pay_percent;
        console.log("Платеж по процентам в ", i, " месяце равен ", pay_percent)
        
        if (mount > 1) {
            total += add_summ;
			all_made+= add_summ;
        }
		result.pay_percents.push({
            'mount': i,
            'total': total.toFixed(2)
        });
    }
    var effectiv_percent = (total - all_made) / (all_made * 0.01);
    console.log("Сумма на момент закрытия вклада:", total)
    console.log("Прибыль:", total_interest)
    console.log("Сумма выросла на", effectiv_percent + "%")
    result.total = total.toFixed(2);
    result.effectiv_percent = effectiv_percent.toFixed(2);
    result.total_interest = total_interest.toFixed(2);
    return result;
}