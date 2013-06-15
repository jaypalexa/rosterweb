function util_new_guid() {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {var r = Math.random()*16|0,v=c=='x'?r:r&0x3|0x8;return v.toString(16);});
}

function util_delete_dialog_controller($scope, dialog) {
	$scope.close = function(result) {
		dialog.close(result);
	};
}

var util_delete_dialog_template = '<div class="modal-body">'+
	'<p>Delete {item_type} \'{item_name}\'?  This cannot be undone.</p>'+
	'</div>'+
	'<div class="modal-footer">'+
	'<button ng-click="close(\'yes\')" class="btn" >Yes</button>'+
	'<button ng-click="close(\'no\')" class="btn btn-primary" >No</button>'+
	'</div>';

var util_delete_dialog_opts = {
	backdrop: true,
	backdropFade: true,
	dialogFade: true,
	keyboard: true,
	backdropClick: false,
	controller: 'util_delete_dialog_controller'
};

function util_open_delete_dialog($dialog, item_type, item_name, callback) {
	var delete_dialog_opts = util_delete_dialog_opts;
	delete_dialog_opts.template = util_delete_dialog_template.replace('{item_type}', item_type).replace('{item_name}', item_name);
	var dlg = $dialog.dialog(delete_dialog_opts);
	dlg.open().then(function(result) {
		callback(result);
	});
};

function util_print_hash(data) {
	var str = '';
	for (var key in data) {
		if (typeof data[key] == 'object') str += key + printData(data[key]) + ' ';
		else str += key + ' => ' + data[key] + '; ';
	}
	return str;
};
