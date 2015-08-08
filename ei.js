///////////////////////////
//var percent_In_Year = 10;
//var mount = 24;
//var capitalization = true;
//var first_payment = 100000;
///////////////////////////

function CalculateDeposit( percent_In_Year, mount, capitalization,  first_payment )
{
var percent_In_Mount = percent_In_Year/ 12;
var total = 0;
var percent_total;
total=total + first_payment;
var result = new Object();

console.log("Сумма на момент открытия вклада: ",total," процент по вкладу: ",percent_In_Year,"%","Ежемесячная процентная ставка:",percent_In_Mount,"%", "капитализация :" ,capitalization);
result.pay_percents = new  Array();
result.pay_percents.push( {'mount' : 0, 'total': first_payment});
for(var i = 1; i<=mount;i++)
{
    var pay_percent = (capitalization ? total :first_payment)  /100*percent_In_Mount;
    total = total + pay_percent;
    console.log("Платеж по процентам в ",i," месяце равен ",pay_percent )
	result.pay_percents.push( {'mount' : i, 'total': total});
}

var effectiv_percent = (total-first_payment)/(first_payment *0.01);
console.log("Сумма на момент закрытия вклада:",total)
var total_interest = total-first_payment;
console.log("Прибыль:",total_interest)
console.log("Сумма выросла на",effectiv_percent+"%" )
result.total = total;
result.effectiv_percent =effectiv_percent;
result.total_interest=total_interest;
return result;
}
