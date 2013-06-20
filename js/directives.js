'use strict';

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

RosterWebApp.directive('ngMorphometricsGraph', function () {
	return {
		restrict: 'E',
		terminal: true,
		scope: {
			val: '=', 
			isChecked: '='
		},
		link: function (scope, element, attrs) {
			// set up initial svg object
			var margin = {top: 20, right: 20, bottom: 120, left: 50},
				width = 800 - margin.left - margin.right,
				height = 380 - margin.top - margin.bottom;

			var parseDate = d3.time.format("%Y-%m-%d").parse;

			var svg = d3.select(element[0]).append("svg")
				.attr("width", width + margin.left + margin.right)
				.attr("height", height + margin.top + margin.bottom)
				.append("g")
				.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

			scope.$watch('val', function (newVal, oldVal) {
				refresh();
			}, true);

			scope.$watch('isChecked', function (newVal, oldVal) {
				refresh();
			}, true);
			
			var refresh = function()
			{
				// if scope.val is undefined, exit
				if (!scope.val) { return; }
				if (scope.val.length == 0) { return; }

				// clear the elements inside of the directive
				svg.selectAll('*').remove();

				var items = scope.val;
				var data = {};

				if (scope.isChecked.sclNotchNotch)
				{
					var sclNotchNotchData = items.map(function(d) { 
						return { 
							dataType: 'sclNotchNotch',
							date: parseDate(d.date_measured),
							dataValue: +d.scl_notch_notch_value 
						}; 
					});
					Array.prototype.push.apply(data, sclNotchNotchData);
				}

				if (scope.isChecked.sclNotchTip)
				{
					var sclNotchTipData = items.map(function(d) { 
						return { 
							dataType: 'sclNotchTip',
							date: parseDate(d.date_measured),
							dataValue: +d.scl_notch_tip_value 
						}; 
					});
					Array.prototype.push.apply(data, sclNotchTipData);
				}

				if (scope.isChecked.sclTipTip)
				{
					var sclTipTipData = items.map(function(d) { 
						return { 
							dataType: 'sclTipTip',
							date: parseDate(d.date_measured),
							dataValue: +d.scl_tip_tip_value 
						}; 
					});
					Array.prototype.push.apply(data, sclTipTipData);
				}
				
				if (scope.isChecked.scw)
				{
					var scwData = items.map(function(d) { 
						return { 
							dataType: 'scw',
							date: parseDate(d.date_measured),
							dataValue: +d.scw_value 
						}; 
					});
					Array.prototype.push.apply(data, scwData);
				}
				
				if (scope.isChecked.cclNotchNotch)
				{
					var cclNotchNotchData = items.map(function(d) { 
						return { 
							dataType: 'cclNotchNotch',
							date: parseDate(d.date_measured),
							dataValue: +d.ccl_notch_notch_value 
						}; 
					});
					Array.prototype.push.apply(data, cclNotchNotchData);
				}
				
				if (scope.isChecked.cclNotchTip)
				{
					var cclNotchTipData = items.map(function(d) { 
						return { 
							dataType: 'cclNotchTip',
							date: parseDate(d.date_measured),
							dataValue: +d.ccl_notch_tip_value 
						}; 
					});
					Array.prototype.push.apply(data, cclNotchTipData);
				}
					
				if (scope.isChecked.cclTipTip)
				{
					var cclTipTipData = items.map(function(d) { 
						return { 
							dataType: 'cclTipTip',
							date: parseDate(d.date_measured),
							dataValue: +d.ccl_tip_tip_value 
						}; 
					});
					Array.prototype.push.apply(data, cclTipTipData);
				}
				
				if (scope.isChecked.ccw)
				{
					var ccwData = items.map(function(d) { 
						return { 
							dataType: 'ccw',
							date: parseDate(d.date_measured),
							dataValue: +d.ccw_value 
						}; 
					});
					Array.prototype.push.apply(data, ccwData);
				}
				
				if (scope.isChecked.weight)
				{
					var weightData = items.map(function(d) { 
						return { 
							dataType: 'weight',
							date: parseDate(d.date_measured),
							dataValue: +d.weight_value 
						}; 
					});
					Array.prototype.push.apply(data, weightData);
				}			
					
				// then we need to nest the data on dataType since we want to only draw one line per data type
				data = d3.nest().key(function(d) { return d.dataType; }).entries(data);

				var x = d3.time.scale()
					.domain([d3.min(data, function(d) { return d3.min(d.values, function (d) { return d.date; }); }),
							 d3.max(data, function(d) { return d3.max(d.values, function (d) { return d.date; }); })])
					.range([0, width])
					.nice(d3.time.day);

				var y = d3.scale.linear()
					.domain([d3.min(data, function(d) { return d3.min(d.values, function (d) { return d.dataValue; }); }) - 2,
							 d3.max(data, function(d) { return d3.max(d.values, function (d) { return d.dataValue; }); }) + 2])
					.range([height, 0]);
				
				var colors = {};
				colors["sclNotchNotch"] = 'lightcoral';
				colors["sclNotchTip"] = 'red';
				colors["sclTipTip"] = 'darkred';
				colors["scw"] = 'darkorange';
				colors["cclNotchNotch"] = 'lightgreen';
				colors["cclNotchTip"] = 'limegreen';
				colors["cclTipTip"] = 'darkgreen';
				colors["ccw"] = 'mediumturquoise';
				colors["weight"] = 'violet';

				var xAxis = d3.svg.axis()
					.scale(x)
					.orient("bottom")
					.ticks(10)
					.tickFormat(d3.time.format("%Y-%m-%d")); 

				var yAxis = d3.svg.axis()
					.scale(y)
					.orient("left");

				var line = d3.svg.line()
					.x(function(d) { return x(d.date); })
					.y(function(d) { return y(d.dataValue); });
				
				svg.append("g")
					.attr("class", "x axis")
					.attr("transform", "translate(0," + height + ")")
					.call(xAxis)
					.selectAll("text")  
						.style("text-anchor", "end")
						.attr("dx", "-.8em")
						.attr("dy", ".15em")
						.attr("transform", function(d) {
							return "rotate(-65)" 
						});

				svg.append("g")
					.attr("class", "y axis")
					.call(yAxis);

				var dataTypes = svg.selectAll(".dataType")
					.data(data, function(d) { return d.key; })
					.enter().append("g")
					.attr("class", "dataType");

				dataTypes.append("path")
					.attr("fill", "none")
					.attr("stroke-width", "1.5px")
					.attr("stroke", function(d) { return colors[d.key]; })
					.attr("d", function(d) { return line(d.values); });			
			};
		}
	}
});

RosterWebApp.directive('ngTemperatureGraph', function () {
	return {
		restrict: 'E',
		terminal: true,
		scope: {
			val: '='
		},
		link: function (scope, element, attrs) {
			// set up initial svg object
			var margin = {top: 20, right: 80, bottom: 120, left: 50},
				width = 640 - margin.left - margin.right,
				height = 380 - margin.top - margin.bottom;

			var parseDate = d3.time.format("%Y-%m-%d").parse;

			var svg = d3.select(element[0]).append("svg")
				.attr("width", width + margin.left + margin.right)
				.attr("height", height + margin.top + margin.bottom)
				.append("g")
				.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

			scope.$watch('val', function (newVal, oldVal) {

				// clear the elements inside of the directive
				svg.selectAll('*').remove();

				// if 'val' is undefined, exit
				if (!newVal) { return; }
				if (newVal.length == 0) { return; }
				
				var items = newVal;

				var data = items.map(function(d) { 
					return { 
						date: parseDate(d.date_measured),
						dataValue: +d.temperature 
					}; 
				});

				var x = d3.time.scale()
					.range([0, width])
					.nice(d3.time.day)
					.domain(d3.extent(data, function(d) { return d.date; }));;

				var y = d3.scale.linear()
					.range([height, 0])
					.domain(d3.extent(data, function(d) { return d.dataValue; }));

				var xAxis = d3.svg.axis()
					.scale(x)
					.orient("bottom")
					.ticks(10)
					.tickFormat(d3.time.format("%Y-%m-%d")); 

				var yAxis = d3.svg.axis()
					.scale(y)
					.orient("left");

				var line = d3.svg.line()
					//.interpolate("basis")
					.x(function(d) { return x(d.date); })
					.y(function(d) { return y(d.dataValue); });
				
				svg.append("g")
					.attr("class", "x axis")
					.attr("transform", "translate(0," + height + ")")
					.call(xAxis)
					.selectAll("text")  
						.style("text-anchor", "end")
						.attr("dx", "-.8em")
						.attr("dy", ".15em")
						.attr("transform", function(d) {
							return "rotate(-65)" 
						});

				svg.append("g")
					.attr("class", "y axis")
					.call(yAxis)
					.append("text")
					.attr("transform", "rotate(-90)")
					.attr("y", 6)
					.attr("dy", ".71em")
					.style("text-anchor", "end")
					.text("Temperature (°F)");
	  
				svg.append("path")
					.datum(data)
					.attr("fill", "none")
					.attr("stroke", "steelblue")
					.attr("stroke-width", "1.5px")
					.attr("d", line);

				var points = svg.selectAll(".point")
					.data(data)
					.enter()
					.append("svg:circle")
					.attr("stroke", "steelblue")
					.attr("stroke-width", "1.5px")
					.attr("fill", "white")
					.attr("r", 5)
					.attr("cx", function(d, i) { return x(d.date) })
					.attr("cy", function(d, i) { return y(d.dataValue) })
					.on("mouseover", function(d){return tooltip.style("visibility", "visible").html("Date measured: " + d3.time.format("%Y-%m-%d")(d.date) + "<br />Temperature (°F): " + d.dataValue);})
					.on("mousemove", function(){return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");})
					.on("mouseout", function(){return tooltip.style("visibility", "hidden");});
		 
				var tooltip = d3.select("body")
					.append("div")
					.style("position", "absolute")
					.style("z-index", "10")
					.style("visibility", "hidden")
					.style("border-radius", "15px")
					.style("padding", "6px")
					.style("font-weight", "bold")
					.style("color", "white")
					.style("background-color", "steelblue");
				
			}, true);
		}
	}
});

RosterWebApp.directive('ngSalinityGraph', function () {
	return {
		restrict: 'E',
		terminal: true,
		scope: {
			val: '='
		},
		link: function (scope, element, attrs) {
			// set up initial svg object
			var margin = {top: 20, right: 80, bottom: 120, left: 50},
				width = 640 - margin.left - margin.right,
				height = 380 - margin.top - margin.bottom;

			var parseDate = d3.time.format("%Y-%m-%d").parse;

			var svg = d3.select(element[0]).append("svg")
				.attr("width", width + margin.left + margin.right)
				.attr("height", height + margin.top + margin.bottom)
				.append("g")
				.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

			scope.$watch('val', function (newVal, oldVal) {

				// clear the elements inside of the directive
				svg.selectAll('*').remove();

				// if 'val' is undefined, exit
				if (!newVal) { return; }
				if (newVal.length == 0) { return; }
				
				var items = newVal;

				var data = items.map(function(d) { 
					return { 
						date: parseDate(d.date_measured),
						dataValue: +d.salinity 
					}; 
				});

				var x = d3.time.scale()
					.range([0, width])
					.nice(d3.time.day)
					.domain(d3.extent(data, function(d) { return d.date; }));;

				var y = d3.scale.linear()
					.range([height, 0])
					.domain(d3.extent(data, function(d) { return d.dataValue; }));

				var xAxis = d3.svg.axis()
					.scale(x)
					.orient("bottom")
					.ticks(10)
					.tickFormat(d3.time.format("%Y-%m-%d")); 

				var yAxis = d3.svg.axis()
					.scale(y)
					.orient("left");

				var line = d3.svg.line()
					.x(function(d) { return x(d.date); })
					.y(function(d) { return y(d.dataValue); });
				
				svg.append("g")
					.attr("class", "x axis")
					.attr("transform", "translate(0," + height + ")")
					.call(xAxis)
					.selectAll("text")  
						.style("text-anchor", "end")
						.attr("dx", "-.8em")
						.attr("dy", ".15em")
						.attr("transform", function(d) {
							return "rotate(-65)" 
						});

				svg.append("g")
					.attr("class", "y axis")
					.call(yAxis)
					.append("text")
					.attr("transform", "rotate(-90)")
					.attr("y", 6)
					.attr("dy", ".71em")
					.style("text-anchor", "end")
					.text("Salinity (in ppt)");
	  
				svg.append("path")
					.datum(data)
					.attr("fill", "none")
					.attr("stroke", "red")
					.attr("stroke-width", "1.5px")
					.attr("d", line);

				var points = svg.selectAll(".point")
					.data(data)
					.enter()
					.append("svg:circle")
					.attr("stroke", "red")
					.attr("stroke-width", "1.5px")
					.attr("fill", "white")
					.attr("r", 5)
					.attr("cx", function(d, i) { return x(d.date) })
					.attr("cy", function(d, i) { return y(d.dataValue) })
					.on("mouseover", function(d){return tooltip.style("visibility", "visible").html("Date measured: " + d3.time.format("%Y-%m-%d")(d.date) + "<br />Salinity (in ppt): " + d.dataValue);})
					.on("mousemove", function(){return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");})
					.on("mouseout", function(){return tooltip.style("visibility", "hidden");});
		 
				var tooltip = d3.select("body")
					.append("div")
					.style("position", "absolute")
					.style("z-index", "10")
					.style("visibility", "hidden")
					.style("border-radius", "15px")
					.style("padding", "6px")
					.style("font-weight", "bold")
					.style("color", "white")
					.style("background-color", "red");
	  
			}, true);
		}
	}
});

RosterWebApp.directive('ngPhGraph', function () {
	return {
		restrict: 'E',
		terminal: true,
		scope: {
			val: '='
		},
		link: function (scope, element, attrs) {
			// set up initial svg object
			var margin = {top: 20, right: 80, bottom: 120, left: 50},
				width = 640 - margin.left - margin.right,
				height = 380 - margin.top - margin.bottom;

			var parseDate = d3.time.format("%Y-%m-%d").parse;

			var svg = d3.select(element[0]).append("svg")
				.attr("width", width + margin.left + margin.right)
				.attr("height", height + margin.top + margin.bottom)
				.append("g")
				.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

			scope.$watch('val', function (newVal, oldVal) {

				// clear the elements inside of the directive
				svg.selectAll('*').remove();

				// if 'val' is undefined, exit
				if (!newVal) { return; }
				if (newVal.length == 0) { return; }
				
				var items = newVal;

				var data = items.map(function(d) { 
					return { 
						date: parseDate(d.date_measured),
						dataValue: +d.ph 
					}; 
				});

				var x = d3.time.scale()
					.range([0, width])
					.nice(d3.time.day)
					.domain(d3.extent(data, function(d) { return d.date; }));;

				var y = d3.scale.linear()
					.range([height, 0])
					.domain(d3.extent(data, function(d) { return d.dataValue; }));

				var xAxis = d3.svg.axis()
					.scale(x)
					.orient("bottom")
					.ticks(10)
					.tickFormat(d3.time.format("%Y-%m-%d")); 

				var yAxis = d3.svg.axis()
					.scale(y)
					.orient("left");

				var line = d3.svg.line()
					.x(function(d) { return x(d.date); })
					.y(function(d) { return y(d.dataValue); });
				
				svg.append("g")
					.attr("class", "x axis")
					.attr("transform", "translate(0," + height + ")")
					.call(xAxis)
					.selectAll("text")  
						.style("text-anchor", "end")
						.attr("dx", "-.8em")
						.attr("dy", ".15em")
						.attr("transform", function(d) {
							return "rotate(-65)" 
						});

				svg.append("g")
					.attr("class", "y axis")
					.call(yAxis)
					.append("text")
					.attr("transform", "rotate(-90)")
					.attr("y", 6)
					.attr("dy", ".71em")
					.style("text-anchor", "end")
					.text("pH");
	  
				svg.append("path")
					.datum(data)
					.attr("fill", "none")
					.attr("stroke", "darkgreen")
					.attr("stroke-width", "1.5px")
					.attr("d", line);

				var points = svg.selectAll(".point")
					.data(data)
					.enter()
					.append("svg:circle")
					.attr("stroke", "darkgreen")
					.attr("stroke-width", "1.5px")
					.attr("fill", "white")
					.attr("r", 5)
					.attr("cx", function(d, i) { return x(d.date) })
					.attr("cy", function(d, i) { return y(d.dataValue) })
					.on("mouseover", function(d){return tooltip.style("visibility", "visible").html("Date measured: " + d3.time.format("%Y-%m-%d")(d.date) + "<br />pH: " + d.dataValue);})
					.on("mousemove", function(){return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");})
					.on("mouseout", function(){return tooltip.style("visibility", "hidden");});
		 
				var tooltip = d3.select("body")
					.append("div")
					.style("position", "absolute")
					.style("z-index", "10")
					.style("visibility", "hidden")
					.style("border-radius", "15px")
					.style("padding", "6px")
					.style("font-weight", "bold")
					.style("color", "white")
					.style("background-color", "darkgreen");
	  
			}, true);
		}
	}
});
