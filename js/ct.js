

//заполняем категории из бд
function setCatigories()
{
	var sel = document.getElementById('searchDepartments');
	var opt = null;

	var catigories = [];
	
	for(i = 0; i<catigories.length; i++) { 

    opt = document.createElement('option');
    opt.value = catigories[i].id;
    opt.innerHTML = catigories[i].name;
    sel.appendChild(opt);
}
}