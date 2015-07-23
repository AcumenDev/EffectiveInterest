///////////////////////////
var percent_In_Year = 10;
var mount = 24;
var capitalization = true;
var first_payment = 100000;
///////////////////////////
var percent_In_Mount = percent_In_Year/ 12;
var total = 0;
var percent_total;
total=total + first_payment;

console.log("Сумма на момент открытия вклада: ",total," процент по вкладу: ",percent_In_Year,"%","Ежемесячная процентная ставка:",percent_In_Mount,"%" );
if(capitalization ){
for(var i = 1; i<=mount;i++)
{
    var pay_percent = total/100*percent_In_Mount;
    total = total + pay_percent ;
    console.log("Платеж по процентам в ",i," месяце равен ",pay_percent )
}
}else
{
 var total  =total + total/100*percent_In_Mount*mount ;
}
var effectiv_percent = (total-first_payment)/(first_payment *0.01);
console.log("Сумма на момент закрытия вклада:",total)
console.log("Прибыль:",total-first_payment)
console.log("Сумма выросла на",effectiv_percent+"%" )
