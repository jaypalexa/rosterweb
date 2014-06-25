function util_new_guid() {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {var r = Math.random()*16|0,v=c=='x'?r:r&0x3|0x8;return v.toString(16);});
}

function util_delete_dialog_controller($scope, $modalInstance) {
	$scope.close = function(result) {
		$modalInstance.close(result);
	};
}

function util_open_delete_dialog($modal, item_type, item_name, callback) {

	var dlgTemplate = '<div class="modal-body">'+
		'<p>Delete {item_type} \'{item_name}\'?  This cannot be undone.</p>'+
		'</div>'+
		'<div class="modal-footer">'+
		'<button ng-click="close(\'yes\')" class="btn" >Yes</button>'+
		'<button ng-click="close(\'no\')" class="btn btn-primary" >No</button>'+
		'</div>';

	var modalInstance = $modal.open({
		template: dlgTemplate.replace('{item_type}', item_type).replace('{item_name}', item_name),
		controller: util_delete_dialog_controller
	});

	modalInstance.result.then(function (result) {
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

function util_blank_if_null(s) {
	if (s)
	{
		return s;
	}
	else
	{
		return '';
	}
};