function util_new_guid() {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {var r = Math.random()*16|0,v=c=='x'?r:r&0x3|0x8;return v.toString(16);});
}

function util_delete_dialog_controller_OLD($scope, dialog) {
	$scope.close = function(result) {
		dialog.close(result);
	};
}

function util_open_delete_dialog_OLD($modal, item_type, item_name, callback) {

	var dlgTemplate = '<div class="modal-body">'+
		'<p>Delete {item_type} \'{item_name}\'?  This cannot be undone.</p>'+
		'</div>'+
		'<div class="modal-footer">'+
		'<button ng-click="close(\'yes\')" class="btn" >Yes</button>'+
		'<button ng-click="close(\'no\')" class="btn btn-primary" >No</button>'+
		'</div>';

	var dlgOpts = {
		backdrop: true,
		backdropFade: true,
		dialogFade: true,
		keyboard: true,
		backdropClick: false,
		controller: 'util_delete_dialog_controller', 
		template: dlgTemplate.replace('{item_type}', item_type).replace('{item_name}', item_name)
	};
	
	var dlg = $modal.dialog(dlgOpts);
	dlg.open().then(function(result) {
		callback(result);
	});
};

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

function util_open_map_dialog($dialog, inLat, inLng, callback) {
		
	var marker, map;
	
	function initializeMap(inLat, inLng) {
        //var myLatlng = new google.maps.LatLng(29.45664, -82.25533);
		var startLat = 29.45664;
		var startLng = -82.25533;
		
		if ((inLat != undefined) && (inLat != null) && (inLat != ''))
		{
			startLat = parseFloat(inLat);
		}
		
		if ((inLng != undefined) && (inLng != null) && (inLng != ''))
		{
			startLng = parseFloat(inLng);
		}
		
        var myLatlng = new google.maps.LatLng(startLat, startLng);
		
        var mapOptions = {
			zoom: 6,
			center: myLatlng,
			mapTypeId: google.maps.MapTypeId.ROADMAP
        }
		
        map = new google.maps.Map(document.getElementById('map_canvas'), mapOptions);
		
		addMarker(myLatlng);
		showCoords(myLatlng);

        google.maps.event.addListener(map, 'click', function(event) {
            addMarker(event.latLng);
			showCoords(event.latLng);
        });
      }

    function addMarker(latLng) {       
        //-- clear the previous marker
        if (marker != null) {
            marker.setMap(null);
        }

        marker = new google.maps.Marker({
            position: latLng,
            map: map,
            draggable:true
        });

		google.maps.event.addListener(marker, 'dragend', function(event) {
			showCoords(event.latLng);
        });		
    }
	
	function showCoords(latLng) {
		document.getElementById("lat").innerHTML = latLng.lat().toFixed(5);
		document.getElementById("lng").innerHTML = latLng.lng().toFixed(5);
	}
	
	//$('#modalMap').on('shown', function() {
	$('#modalMap').on('dialogopen', function() {
		initializeMap(inLat, inLng);
		google.maps.event.trigger(map, "resize");
	});

	$.get("/rosterweb/views/map_dialog.html", function(data) {
	
		$('#modalMapContainer').html(data);
		
		$('#modalMap .cancel-button').click(function() {
			$('#modalMap').dialog('hide');
			return false;
		});

		$('#modalMap .save-button').click(function() {
			$('#modalMap').dialog('hide');
			var myLatLng = {};
			myLatLng.lat = $('#lat').text();
			myLatLng.lng = $('#lng').text();
			callback(myLatLng);
			return false;
		});
	
		//$('#modalMap').dialog({show: true, backdrop: 'static', keyboard: true});
		$('#modalMap').dialog(
		{
			autoOpen: true, 
			closeOnEscape: true, 
			modal: true, 
		});
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