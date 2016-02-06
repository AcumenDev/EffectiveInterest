$(function() {
	_.templateSettings = {
		interpolate: /\{\{(.+?)\}\}/g
	};

	spendsDataManager.init();
	spendsUI.init();
});
