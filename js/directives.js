RosterWebApp.directive('sorted', function() {
    return {
        scope: true,
        transclude: true,
        template: '<a ng-click="do_sort()" ng-transclude></a>' +
            '<span ng-show="do_show(true)"><i class="icon-circle-arrow-down"></i></span>' +
            '<span ng-show="do_show(false)"><i class="icon-circle-arrow-up"></i></span>',

        controller: function($scope, $element, $attrs) {
            $scope.sort = $attrs.sorted;

            $scope.do_sort = function() { 
				$scope.sort_by($scope.sort); 
			};

            $scope.do_show = function(asc) {
                return (asc != $scope.sort_desc) && ($scope.sort_order == $scope.sort);
            };
        }
    };
});

// ng-model-onblur:  for text and date INPUTs, updates the model on blur rather than on change; use in conjunction with ng-change="save()"
RosterWebApp.directive('ngModelOnblur', function() {
    return {
        require: 'ngModel',
        restrict: 'A',
        link: function(scope, elem, attr, ngModelCtrl) {
            if (attr.type === 'radio' || attr.type === 'checkbox') return;
            
            elem.unbind('input').unbind('keydown').unbind('change');
            elem.bind('blur', function() {
                scope.$apply(function() {
                    ngModelCtrl.$setViewValue(elem.val());
                });         
            });
        }
    };
});

// ng-upload-brochure-image:  for uploading turtle brochure image files
RosterWebApp.directive('ngUploadBrochureImage', function() {

	return {
		restrict: 'E',
		
		link: function(scope, elem, attr, ctrl) {
		
			var dragForm = '' + 
				'<div id="file-upload-div">' +
					'<div id="drop">' + 
						'Drag Image Here<br />' + 
						'<a>Browse...</a>' +
						'<input type="file" id="uploadfile" />' +
						'<br /><br />' +
						'<p id="upload-status"></p>' +
						'<p id="progress"></p>' +
						'<p id="result"></p>' +
					'</div>';
				'</div>';
				
			elem.html(dragForm);

			$(document).on('click', '#drop a', function() {
				$(this).parent().find('input').click();
			});

			$(document).on('dragover', function (e) {
				e.preventDefault();
				$('#drop').addClass('active');
			});

			$(document).on('drop dragleave', function (e) {
				e.preventDefault();
				$('#drop').removeClass('active');
			});
		  
			//-- initialize the jQuery File Upload plugin
			$('#file-upload-div').fileupload({
				//-- this element will accept file drag/drop uploading
				dropZone: $('#drop'),

				//-- called when a file is added via the browse button or drag-and-drop
				add: function (e, data) {
				
					var fd = new FormData();
					fd.append("uploadfile", data.files[0]);
					fd.append("turtle_id", scope.item.turtle_id);
						
					var xhr = new XMLHttpRequest();
					xhr.upload.addEventListener('loadstart', onLoadStartHandler, false);
					xhr.upload.addEventListener('progress', onProgressHandler, false);
					xhr.upload.addEventListener('load', onLoadHandler, false);
					xhr.upload.addEventListener('error', onErrorHandler, false);
					xhr.upload.addEventListener('abort', onAbortHandler, false);
					xhr.addEventListener('readystatechange', onReadyStateChangeHandler, false);
					xhr.open("POST", "/rosterweb/api/upload_brochure_image.php", true);
					xhr.send(fd);

					function onLoadStartHandler(evt) {
						var div = document.getElementById('upload-status');
						div.innerHTML = 'Upload started';
					}

					function onProgressHandler(evt) {
						var div = document.getElementById('progress');
						var percent = evt.loaded/evt.total*100;
						if (percent != 100) {
							div.innerHTML = 'Progress: ' + percent.toFixed(0) + '%';
						} else {
							div.innerHTML = '';
						}
					}

					function onErrorHandler(evt) {
						var div = document.getElementById('upload-status');
						div.innerHTML = 'Upload error';
					}

					function onAbortHandler(evt) {
						var div = document.getElementById('upload-status');
						div.innerHTML = 'Upload aborted';
					}

					function onLoadHandler(evt) {
						var div = document.getElementById('upload-status');
						div.innerHTML = 'Finished';
					}

					function onReadyStateChangeHandler(evt) {
						var status = null;

						try {
							status = evt.target.status;
						}
						catch(e) {
							return;
						}

						var div = document.getElementById('upload-status');
						if (status == '200') {
							if (evt.target.responseText) {
								var result = document.getElementById('result');
								//result.innerHTML = '<img src="' + evt.target.responseText + '" height="200px" width="200px" />';
								scope.item.brochure_image_file_attachment_id = evt.target.responseText;
								scope.save();
							} else {
								div.innerHTML = evt.target.responseText;
							}
						} else {
							div.innerHTML = 'Error:  ' + evt.target.responseText + '<br />(status code = ' + status + ')';
						}						
					}
				}
			});
		}
	}
});