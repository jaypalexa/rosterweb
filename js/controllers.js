var CountyListItemCtrl = function($rootScope, $scope, $location, $modal, countyService, recordCountService) {
	$scope.edit = function() {
		$scope.item_copy = angular.copy($scope.item);
		$scope.is_new = false;
		$scope.is_editing = true;
    };

    $scope.cancel = function(item) {
        $scope.item_copy = {};
        $scope.is_editing = false;
    };

	$scope.save = function() {
		$scope.item = angular.copy($scope.item_copy);
		countyService.save($scope.item, function() {
			//-- reset 
			$scope.cancel();
		});
    };

    $scope.delete = function() {
		util_open_delete_dialog($modal, 'county', $scope.item.county_name, function(result) {
			if (result == 'yes') {
				countyService.delete($scope.item.county_id, function() {
					recordCountService.resetAll($rootScope.currentUser.organizationId);
					$("#item_" + $scope.item.county_id).fadeOut();
				});
			}
		});
	};
	
	$scope.is_editing = false;
}

var CountyListCtrl = function($scope, $location, $modal, countyService) {

    $scope.search = function() {
		$scope.items = countyService.search($scope.q, $scope.sort_order, $scope.sort_desc);
    };

    $scope.sort_by = function(property_name) {
        if ($scope.sort_order == property_name) { 
			$scope.sort_desc = !$scope.sort_desc; 
		} else { 
			$scope.sort_desc = false; 
		}
        $scope.sort_order = property_name;
    };

	$scope.searchFilter = function(item) {
		var re = new RegExp($scope.q, 'i');
		return !$scope.q || re.test(item.county_name);
	};

    $scope.sort_order = 'county_name';
    $scope.sort_desc = false;
    $scope.search();
};

var CountyCreateCtrl = function($rootScope, $scope, $location, countyService, recordCountService) {

    $scope.save = function() {
        countyService.save($scope.item, function() {
			if ($scope.item.is_new)
			{
				recordCountService.resetAll($rootScope.currentUser.organizationId);
				$scope.item.is_new = false;
			}
        });
    };
	
	$scope.item = { county_id: null };
	$scope.item = { is_new: true, county_id: util_new_guid(), county_name: '[new county]' };
	$scope.save();

};

var HatchlingsEventListCtrl = function ($rootScope, $scope, $location, $modal, hatchlingsEventService, recordCountService) {

    $scope.search = function() {
		$scope.items = hatchlingsEventService.search($scope.q, $scope.sort_order, $scope.sort_desc);
    };

    $scope.sort_by = function(property_name) {
        if ($scope.sort_order == property_name) { 
			$scope.sort_desc = !$scope.sort_desc; 
		} else { 
			$scope.sort_desc = false; 
		}
        $scope.sort_order = property_name;
     };

    $scope.delete = function(item) {
		util_open_delete_dialog($modal, 'hatchlings ' + item.event_type_code + ' event', item.species_code + ' - ' + item.event_date, function(result) {
			if (result == 'yes') {
				hatchlingsEventService.delete(item.hatchlings_event_id, item.event_type_code, function() {
					recordCountService.resetAll($rootScope.currentUser.organizationId);
					$("#item_" + item.hatchlings_event_id).fadeOut();
				});
			}
		});
	};
	
	$scope.searchFilter = function(item) {
		var re = new RegExp($scope.q, 'i');
		return !$scope.q || re.test(item.event_date) || re.test(item.species_code) || re.test(item.event_type) || re.test(item.event_count) || re.test(item.county_name);
	};

    $scope.sort_order = 'event_date';
    $scope.sort_desc = false;
    $scope.search();
};

var HatchlingsAcquiredEventEditCtrl = function($rootScope, $scope, $routeParams, $location, hatchlingsEventService, codeTableService, countyService, recordCountService) {

	$scope.datePicker = {
		'eventDateOpened': false
	};
 	$scope.dateOptions = {
		'show-weeks' : false
	};
	$scope.openDatePicker = function($event, opened) {
		$event.preventDefault();
		$event.stopPropagation();
		$scope.datePicker[opened] = true;
	};

    $scope.species = codeTableService.getCodes('species'); 
	$scope.counties = countyService.getAll('county_name', false);

	$scope.save = function() {
        hatchlingsEventService.save($scope.item, function() {
			if ($scope.item.is_new)
			{
				recordCountService.resetAll($rootScope.currentUser.organizationId);
				$scope.item.is_new = false;
			}
		});
    };

	//--------------------------------------------------------------------------------
	//-- if there in no ID in the route, then we are creating a new item...
	//--------------------------------------------------------------------------------
	if ($routeParams.hatchlings_event_id == undefined)
	{
		var newId = util_new_guid();
		$scope.item = { is_new: true, hatchlings_event_id: newId, hatchlings_acquired_event_id: newId, organization_id: $rootScope.currentUser.organizationId, event_type_code: 'acquired', event_type: 'Acquired' };
		$scope.save();
	}
	//--------------------------------------------------------------------------------
	//-- ...else, we are editing an existing item
	//--------------------------------------------------------------------------------
	else
	{
		$scope.item = hatchlingsEventService.get($routeParams.hatchlings_event_id, 'acquired');
		$scope.item.is_new = false;
	}
};

var HatchlingsDiedEventEditCtrl = function($rootScope, $scope, $routeParams, $location, hatchlingsEventService, codeTableService, countyService, recordCountService) {

	$scope.datePicker = {
		'eventDateOpened': false
	};
 	$scope.dateOptions = {
		'show-weeks' : false
	};
	$scope.openDatePicker = function($event, opened) {
		$event.preventDefault();
		$event.stopPropagation();
		$scope.datePicker[opened] = true;
	};

    $scope.species = codeTableService.getCodes('species'); 

	$scope.save = function() {
        hatchlingsEventService.save($scope.item, function() {
			if ($scope.item.is_new)
			{
				recordCountService.resetAll($rootScope.currentUser.organizationId);
				$scope.item.is_new = false;
			}
		});
    };

	//--------------------------------------------------------------------------------
	//-- if there in no ID in the route, then we are creating a new item...
	//--------------------------------------------------------------------------------
	if ($routeParams.hatchlings_event_id == undefined)
	{
		var newId = util_new_guid();
		$scope.item = { is_new: true, hatchlings_event_id: newId, hatchlings_died_event_id: newId, organization_id: $rootScope.currentUser.organizationId, event_type_code: 'died', event_type: 'Died' };
		$scope.save();
	}
	//--------------------------------------------------------------------------------
	//-- ...else, we are editing an existing item
	//--------------------------------------------------------------------------------
	else
	{
		$scope.item = hatchlingsEventService.get($routeParams.hatchlings_event_id, 'died');
		$scope.item.is_new = false;
	}
};

var HatchlingsDoaEventEditCtrl = function($rootScope, $scope, $routeParams, $location, hatchlingsEventService, codeTableService, countyService, recordCountService) {

	$scope.datePicker = {
		'eventDateOpened': false
	};
 	$scope.dateOptions = {
		'show-weeks' : false
	};
	$scope.openDatePicker = function($event, opened) {
		$event.preventDefault();
		$event.stopPropagation();
		$scope.datePicker[opened] = true;
	};

    $scope.species = codeTableService.getCodes('species'); 
	$scope.counties = countyService.getAll('county_name', false);

	$scope.save = function() {
        hatchlingsEventService.save($scope.item, function() {
			if ($scope.item.is_new)
			{
				recordCountService.resetAll($rootScope.currentUser.organizationId);
				$scope.item.is_new = false;
			}
		});
    };

	//--------------------------------------------------------------------------------
	//-- if there in no ID in the route, then we are creating a new item...
	//--------------------------------------------------------------------------------
	if ($routeParams.hatchlings_event_id == undefined)
	{
		var newId = util_new_guid();
		$scope.item = { is_new: true, hatchlings_event_id: newId, hatchlings_doa_event_id: newId, organization_id: $rootScope.currentUser.organizationId, event_type_code: 'doa', event_type: 'DOA' };
		$scope.save();
	}
	//--------------------------------------------------------------------------------
	//-- ...else, we are editing an existing item
	//--------------------------------------------------------------------------------
	else
	{
		$scope.item = hatchlingsEventService.get($routeParams.hatchlings_event_id, 'doa');
		$scope.item.is_new = false;
	}
};

var HatchlingsReleasedEventEditCtrl = function($rootScope, $scope, $routeParams, $location, hatchlingsEventService, codeTableService, countyService, recordCountService) {

	$scope.datePicker = {
		'eventDateOpened': false
	};
 	$scope.dateOptions = {
		'show-weeks' : false
	};
	$scope.openDatePicker = function($event, opened) {
		$event.preventDefault();
		$event.stopPropagation();
		$scope.datePicker[opened] = true;
	};

    $scope.species = codeTableService.getCodes('species'); 
	$scope.counties = countyService.getAll('county_name', false);

	$scope.save = function() {
        hatchlingsEventService.save($scope.item, function() {
			if ($scope.item.is_new)
			{
				recordCountService.resetAll($rootScope.currentUser.organizationId);
				$scope.item.is_new = false;
			}
		});
    };

	//--------------------------------------------------------------------------------
	//-- if there in no ID in the route, then we are creating a new item...
	//--------------------------------------------------------------------------------
	if ($routeParams.hatchlings_event_id == undefined)
	{
		var newId = util_new_guid();
		$scope.item = { is_new: true, hatchlings_event_id: newId, hatchlings_released_event_id: newId, organization_id: $rootScope.currentUser.organizationId, event_type_code: 'released', event_type: 'Released' };
		$scope.save();
	}
	//--------------------------------------------------------------------------------
	//-- ...else, we are editing an existing item
	//--------------------------------------------------------------------------------
	else
	{
		$scope.item = hatchlingsEventService.get($routeParams.hatchlings_event_id, 'released');
		$scope.item.is_new = false;
	}
};

var LoginCtrl = function ($rootScope, $scope, $location, $cookieStore, loginService, logoutService, userService, recordCountService, organizationListItemService) {

	//$scope.targetUrl = $location.search().target_url;

	console.log('[LoginCtrl] Entering LoginCtrl...');
	console.log('[LoginCtrl] $cookieStore.get(\'is_registered\') = ' + $cookieStore.get('is_registered'));

	$rootScope.safeApply = function(fn) {
		var phase = this.$root.$$phase;
		if (phase == '$apply' || phase == '$digest') {
			if(fn && (typeof(fn) === 'function')) {
				fn();
			}
		} else {
			this.$apply(fn);
		}
	};
	
	//--------------------------------------------------------------------------------
	//-- retrieve the client cookie values, then delete the client cookies
	//--------------------------------------------------------------------------------
	$user_id = $.cookie('user_id'); //-- 'user_id' will be the user's e-mail address
	$.removeCookie('user_id', { path: '/' });
	console.log('[LoginCtrl] $user_id = ' + $user_id);

	$is_logged_in = $.cookie('is_logged_in');
	$.removeCookie('is_logged_in', { path: '/' });
	console.log('[LoginCtrl] $is_logged_in = ' + $is_logged_in);
	
	if ($is_logged_in == 'true')
	{
		//--------------------------------------------------------------------------------
		//-- the user has authenticated successfully with OpenID;
		//-- now see if user is registered with RosterWeb
		//--------------------------------------------------------------------------------
		userService.getByEmail($user_id).then(
			function(result){ //-- success
				$currentUser = result; 
				console.log('[LoginCtrl] Loading organization list items...');
				$rootScope.organizations = organizationListItemService.getAll();
				console.log('[LoginCtrl] $currentUser.user_name = ' + $currentUser.user_name);
				console.log('[LoginCtrl] $currentUser.is_admin = ' + $currentUser.is_admin);
				if ($currentUser.user_name != undefined)
				{
					console.log('[LoginCtrl] *** LOGGED IN AND IS REGISTERED ***');
					$cookieStore.put('is_registered', 'true');
					if (($currentUser.preferred_units_type == undefined) || ($currentUser.preferred_units_type == null) || ($currentUser.preferred_units_type == ''))
					{
						$currentUser.preferred_units_type = 'M';
					}
					$rootScope.currentUser = { userName : $currentUser.user_name, organizationId : $currentUser.organization_id, organizationName : $currentUser.organization_name, preferredUnitsType : $currentUser.preferred_units_type, isLoggedIn : true, isAdmin : $currentUser.is_admin };
					$cookieStore.put('rootScopeCurrentUser', $rootScope.currentUser);
					recordCountService.resetAll($rootScope.currentUser.organizationId);
					$location.url('/turtle/');
				}
				else
				{
					console.log('[LoginCtrl] *** LOGGED IN BUT NOT REGISTERED ***');
					$rootScope
					logoutService.doLogout();
					$rootScope.unregisteredUserEmail = $user_id;
					$location.url('/notregistered/');
				}
			},
			function(){ //-- error 
				console.log('[LoginCtrl] *** NOT LOGGED IN ***');
				logoutService.doLogout();
			}
		);
	} else {
		console.log('[LoginCtrl] *** NOT LOGGED IN ***');
		logoutService.doLogout();
	}
			
    $scope.doLogin = function($openidIdentifier) {
		loginService.doLogin($openidIdentifier);
    };

};

var LogoutCtrl = function ($scope, $location, logoutService) {
	logoutService.doLogout();
	$location.url('/');
};

var MainCtrl = function ($rootScope, $scope, $location, $route, $cookieStore, organizationListItemService, recordCountService) {
	$scope.organizationChanged = function() {
		//console.log('[MainCtrl::$scope.organizationChanged] $scope.currentUser = ' + $scope.currentUser);
		if (($scope.currentUser != null) && ($scope.currentUser.organizationId != null))
		{
			console.log('[MainCtrl::$scope.organizationChanged] $scope.currentUser.organizationId = ' + $scope.currentUser.organizationId);
			//--------------------------------------------------------------------------------
			//-- refresh the rootScopeCurrentUser cookie with the $rootScope.currentUser latest values
			//--------------------------------------------------------------------------------
			$cookieStore.put('rootScopeCurrentUser', $rootScope.currentUser);
		
			//--------------------------------------------------------------------------------
			//-- reset the record counts
			//--------------------------------------------------------------------------------
			if (recordCountService != undefined)
			{
				recordCountService.resetAll($rootScope.currentUser.organizationId);
				var locationPath = $location.path();
				//console.log('[MainCtrl::$scope.organizationChanged] $location.path() = ' + locationPath);
				if ((locationPath.indexOf("/turtle/") != -1) 
				|| (locationPath.indexOf("/tank/") != -1) 
				|| (locationPath.indexOf("/hatchling/") != -1) 
				|| (locationPath.indexOf("/washback/") != -1))
				{
					//console.log('[MainCtrl::$scope.organizationChanged] Performing a $route.reload()...');
					$route.reload();
				}
			}
		}
	};
};

var NotRegisteredCtrl = function ($scope) {
	return;
};

var OrganizationListCtrl = function ($rootScope, $scope, $location, $modal, organizationService, organizationListItemService, recordCountService) {

    $scope.search = function() {
		$scope.items = organizationService.search($scope.q, $scope.sort_order, $scope.sort_desc);
    };

    $scope.sort_by = function(property_name) {
        if ($scope.sort_order == property_name) { 
			$scope.sort_desc = !$scope.sort_desc; 
		} else { 
			$scope.sort_desc = false; 
		}
        $scope.sort_order = property_name;
    };

    $scope.delete = function(item) {
		util_open_delete_dialog($modal, 'organization', item.organization_name, function(result) {
			if (result == 'yes') {
				organizationService.delete(item.organization_id, function() {
					$rootScope.organizations = organizationListItemService.getAll();
					recordCountService.resetAll($rootScope.currentUser.organizationId);
					$("#item_" + item.organization_id).fadeOut();
				});
			}
		});
	};

	$scope.searchFilter = function(item) {
		var re = new RegExp($scope.q, 'i');
		return !$scope.q || re.test(item.organization_name) || re.test(item.city) || re.test(item.state);
	};
	
    $scope.sort_order = 'organization_name';
    $scope.sort_desc = false;
    $scope.search();
};

var OrganizationEditCtrl = function($rootScope, $scope, $routeParams, $location, $cookieStore, codeTableService, organizationService, organizationListItemService, recordCountService) {
	$scope.datePicker = {
		'hatchlingBalanceAsOfDateOpened': false,
		'washbackBalanceAsOfDateOpened': false
	};
 	$scope.dateOptions = {
		'show-weeks' : false
	};
	$scope.openDatePicker = function($event, opened) {
		$event.preventDefault();
		$event.stopPropagation();
		$scope.datePicker[opened] = true;
	};
    $scope.states = codeTableService.getCodes('state'); 
    $scope.unit_types = codeTableService.getCodes('unit_type'); 

	$scope.save = function() {
        organizationService.save($scope.item, function() {
			//console.log('[OrganizationEditCtrl::$scope.save()] $scope.item.is_new = ' + $scope.item.is_new);
			//console.log('[OrganizationEditCtrl::$scope.save()] $scope.item.organization_id = ' + $scope.item.organization_id);
			if ($scope.item.is_new)
			{
				$rootScope.organizations = organizationListItemService.getAll();
				recordCountService.resetAll($rootScope.currentUser.organizationId);
				$scope.item.is_new = false;
			}
			else
			{
				//--------------------------------------------------------------------------------
				//-- if the organization name changed, reload the organization dropdown list
				//--------------------------------------------------------------------------------
				//console.log('[OrganizationEditCtrl::$scope.save()] $scope.item.organization_name = ' + $scope.item.organization_name);
				//console.log('[OrganizationEditCtrl::$scope.save()] $scope.pre_edit_organization_name = ' + $scope.pre_edit_organization_name);
				if ($scope.item.organization_name != $scope.pre_edit_organization_name)
				{
					//console.log('[OrganizationEditCtrl::$scope.save()] Updating organization dropdown list...');
					$rootScope.organizations = organizationListItemService.getAll();
				}

				//--------------------------------------------------------------------------------
				//-- if we edited the current organization, make sure we have the latest 'preferred units type' value in $rootScope
				//--------------------------------------------------------------------------------
				if ($scope.item.organization_id == $rootScope.currentUser.organizationId)
				{
					//console.log('[OrganizationEditCtrl::$scope.save()] Refreshing current organization "preferred units type" value in $rootScope...');
					$rootScope.currentUser.preferredUnitsType = $scope.item.preferred_units_type;
					$cookieStore.put('rootScopeCurrentUser', $rootScope.currentUser);
				}
			}
			$scope.pre_edit_organization_name = $scope.item.organization_name;
		});
    };

	//--------------------------------------------------------------------------------
	//-- if there in no ID in the route, then we are creating a new item...
	//--------------------------------------------------------------------------------
	if ($routeParams.organization_id == undefined)
	{
		$scope.item = { is_new: true, organization_id: util_new_guid() };
		console.log('[OrganizationEditCtrl] Calling $scope.save(); $scope.item.is_new = ' + $scope.item.is_new);
		$scope.save();
	}
	//--------------------------------------------------------------------------------
	//-- ...else, we are editing an existing item
	//--------------------------------------------------------------------------------
	else
	{
		organizationService.get($routeParams.organization_id).then(
			function(result){ //-- success
				$scope.item = result; 
				$scope.item.is_new = false;
				$scope.pre_edit_organization_name = $scope.item.organization_name;
			}
		);
	}
};

var TankListCtrl = function ($rootScope, $scope, $location, $modal, tankService, recordCountService) {

    $scope.search = function() {
		$scope.items = tankService.search($scope.q, $scope.sort_order, $scope.sort_desc);
    };

    $scope.sort_by = function(property_name) {
        if ($scope.sort_order == property_name) { 
			$scope.sort_desc = !$scope.sort_desc; 
		} else { 
			$scope.sort_desc = false; 
		}
        $scope.sort_order = property_name;
    };

    $scope.delete = function(item) {
		util_open_delete_dialog($modal, 'tank', item.tank_name, function(result) {
			if (result == 'yes') {
				tankService.delete(item.tank_id, function() {
					recordCountService.resetAll($rootScope.currentUser.organizationId);
					$("#item_" + item.tank_id).fadeOut();
				});
			}
		});
	};
	
	$scope.searchFilter = function(item) {
		var re = new RegExp($scope.q, 'i');
		return !$scope.q || re.test(item.tank_name);
	};

    $scope.sort_order = 'tank_name';
    $scope.sort_desc = false;
    $scope.search();
};

var TankEditCtrl = function($rootScope, $scope, $routeParams, $location, $cookieStore, tankService, recordCountService) {

	$rootScope.currentTank = {};

	$scope.save = function() {
		$rootScope.currentTank.tankId = $scope.item.tank_id;
		$rootScope.currentTank.tankName = $scope.item.tank_name;
		$cookieStore.put('rootScopeCurrentTank', $rootScope.currentTank);
        tankService.save($scope.item, function() {
			if ($scope.item.is_new)
			{
				recordCountService.resetAll($rootScope.currentUser.organizationId);
				$scope.item.is_new = false;
			}
		});
    };

	//--------------------------------------------------------------------------------
	//-- if there in no ID in the route, then we are creating a new item...
	//--------------------------------------------------------------------------------
	if ($routeParams.tank_id == undefined)
	{
		$scope.item = { is_new: true, tank_id: util_new_guid(), organization_id: $rootScope.currentUser.organizationId };
		$scope.save();
	}
	//--------------------------------------------------------------------------------
	//-- ...else, we are editing an existing item
	//--------------------------------------------------------------------------------
	else
	{
		//-- we need to do this before calling the async "get" below so the parent screen has $rootScope.currentTurtle.turtleId
		$rootScope.currentTank.tankId = $routeParams.tank_id;
		$rootScope.currentTank.tankName = '';
		$cookieStore.put('rootScopeCurrentTank', $rootScope.currentTank);
		
		tankService.get($routeParams.tank_id).then(
			function(result){ //-- success
				$scope.item = result;
				$scope.item.is_new = false;
				$rootScope.currentTank.tankId = $scope.item.tank_id;
				$rootScope.currentTank.tankName = $scope.item.tank_name;
				$cookieStore.put('rootScopeCurrentTank', $rootScope.currentTank);
			}
		);
	}
	
	recordCountService.resetAllForTank($rootScope.currentTank.tankId);
};

var TankWaterListCtrl = function ($rootScope, $scope, $location, $modal, tankWaterService, recordCountService) {

    $scope.search = function() {
		$scope.items = tankWaterService.search($scope.q, $scope.sort_order, $scope.sort_desc);
    };

    $scope.sort_by = function(property_name) {
        if ($scope.sort_order == property_name) { 
			$scope.sort_desc = !$scope.sort_desc; 
		} else { 
			$scope.sort_desc = false; 
		}
        $scope.sort_order = property_name;
    };

    $scope.delete = function(item) {
		util_open_delete_dialog($modal, 'measurement', item.date_measured, function(result) {
			if (result == 'yes') {
				tankWaterService.delete(item.tank_water_id, function() {
					recordCountService.resetAllForTank($rootScope.currentTank.tankId);
					$("#item_" + item.tank_water_id).fadeOut();
				});
			}
		});
	};
	
    $scope.sort_order = 'date_measured';
    $scope.sort_desc = false;
    $scope.search();
};

var TankWaterEditCtrl = function($rootScope, $scope, $routeParams, $location, tankWaterService, recordCountService) {

	$scope.datePicker = {
		'dateMeasuredOpened': false
	};
 	$scope.dateOptions = {
		'show-weeks' : false
	};
	$scope.openDatePicker = function($event, opened) {
		$event.preventDefault();
		$event.stopPropagation();
		$scope.datePicker[opened] = true;
	};

	$scope.save = function() {
        tankWaterService.save($scope.item, function() {
			if ($scope.item.is_new)
			{
				recordCountService.resetAllForTank($rootScope.currentTank.tankId);
				$scope.item.is_new = false;
			}
		});
    };

	//--------------------------------------------------------------------------------
	//-- if there in no ID in the route, then we are creating a new item...
	//--------------------------------------------------------------------------------
	if ($routeParams.tank_water_id == undefined)
	{
		$scope.item = { is_new: true, tank_water_id: util_new_guid(), tank_id: $rootScope.currentTank.tankId };
		$scope.save();
	}
	//--------------------------------------------------------------------------------
	//-- ...else, we are editing an existing item
	//--------------------------------------------------------------------------------
	else
	{
		$scope.item = tankWaterService.get($routeParams.tank_water_id);
		$scope.item.is_new = false;
	}
};

var TurtleListCtrl = function ($rootScope, $scope, $location, turtleService, recordCountService) {

    $scope.search = function() {
		$scope.items = turtleService.search($scope.q, $scope.sort_order, $scope.sort_desc);
    };

    $scope.sort_by = function(property_name) {
        if ($scope.sort_order == property_name) { 
			$scope.sort_desc = !$scope.sort_desc; 
		} else { 
			$scope.sort_desc = false; 
		}
        $scope.sort_order = property_name;
    };

	/*
    $scope.delete = function(item) {
		util_open_delete_dialog($modal, 'turtle', item.turtle_name, function(result) {
			if (result == 'yes') {
				turtleService.delete(item.turtle_id, function() {
					recordCountService.resetAll($rootScope.currentUser.organizationId);
					$("#item_" + item.turtle_id).fadeOut();
				});
			}
		});
	};
	*/
	
	$scope.searchFilter = function(item) {
		var re = new RegExp($scope.q, 'i');
		return !$scope.q || re.test(item.turtle_name) || re.test(item.species) || re.test(item.sid_number) || re.test(item.stranding_id_number);
	};

    $scope.sort_order = 'turtle_name';
    $scope.sort_desc = false;
    $scope.search();
};

var TurtleEditCtrl = function($rootScope, $scope, $routeParams, $location, $cookieStore, $modal, $timeout, turtleService, codeTableService, countyService, recordCountService) {

	$rootScope.currentTurtle = {};
	
	$scope.datePicker = {
		'dateCapturedOpened': false,
		'dateAcquiredOpened': false,
		'dateRelinquishedOpened': false
	};
 	$scope.dateOptions = {
		'show-weeks' : false
	};
	$scope.openDatePicker = function($event, opened) {
		$event.preventDefault();
		$event.stopPropagation();
		$scope.datePicker[opened] = true;
	};

	var startLatlng = new google.maps.LatLng(29.45664, -82.25533);
	var mapOptions = {
		zoom: 6,
		center: startLatlng,
		mapTypeId: google.maps.MapTypeId.ROADMAP,
		draggable: true, 
		streetViewControl: false			
	};

	$scope.arrival_weight_value = '';
	$scope.arrival_weight_units = '';

    $scope.capture_project_types = codeTableService.getCodes('capture_project_type'); 
	$scope.counties = countyService.getAll('county_name', false);
    $scope.recapture_types = codeTableService.getCodes('recapture_type'); 
    $scope.species = codeTableService.getCodes('species'); 
    $scope.statuses = codeTableService.getCodes('status'); 
    $scope.turtle_sizes = codeTableService.getCodes('turtle_size'); 
    $scope.yes_no_undetermineds = codeTableService.getCodes('yes_no_undetermined'); 

	$scope.$watch("item.was_carrying_tags_when_enc", function(newVal, oldVal) { 
		//console.log('[TurtleEditCtrl::$scope.$watch("item.was_carrying_tags_when_enc"] newVal = ' + newVal + '; oldVal = ' + oldVal);
		if ((oldVal != undefined) && (oldVal != undefined)) { 
			if (newVal != true)
			{
				$scope.item.recapture_type = ''; 
				$scope.item.tag_return_address = ''; 
			};
		};
	}, true);
	
	$scope.$watch("item.capture_project_type", function(newVal, oldVal) { 
		//console.log('[TurtleEditCtrl::$scope.$watch("item.capture_project_type"] newVal = ' + newVal + '; oldVal = ' + oldVal);
		if ((oldVal != undefined) && (oldVal != undefined) && (newVal != undefined) && (newVal != undefined)) { 
			if (newVal != 'O')
			{
				$scope.item.capture_project_other = ''; 
			} else if (newVal != 'N')
			{
				$scope.item.did_turtle_nest = ''; 
			};
		};
	}, true);
	
	$scope.acquiredMap = null;
	$scope.acquiredMarker = null;
		
	$scope.initAcquiredMap = function() {
		$scope.acquiredMap = new google.maps.Map(document.getElementById('acquired_map'), mapOptions);
		google.maps.event.addListener($scope.acquiredMap, 'click', function(event) {
			setAcquiredMarker(event.latLng.lat().toFixed(5), event.latLng.lng().toFixed(5));
			setAcquiredCoords(event.latLng);
		});
	};
	
    function setAcquiredMarker(lat, lng) { 
		if (!$scope.acquiredMap) return;
		
		var acquiredLat, acquiredLng;
		if ((lat != undefined) && (lat != null) && (lat != ''))
		{
			acquiredLat = parseFloat(lat);
		}
		if ((lng != undefined) && (lng != null) && (lng != ''))
		{
			acquiredLng = parseFloat(lng);
		}
		var acquiredLatlng = new google.maps.LatLng(acquiredLat, acquiredLng);

		//-- clear the previous marker
        if ($scope.acquiredMarker != null) {
            $scope.acquiredMarker.setMap(null);
        }

        $scope.acquiredMarker = new google.maps.Marker({
            position: acquiredLatlng,
            map: $scope.acquiredMap,
            draggable:true
        });

		google.maps.event.addListener($scope.acquiredMarker, 'dragend', function(event) {
			setAcquiredCoords(event.latLng);
        });		
    }

	function setAcquiredCoords(latLng) {
		$scope.$apply(function() {
			$scope.item.acquired_latitude = latLng.lat().toFixed(5);
			$scope.item.acquired_longitude = latLng.lng().toFixed(5);
			$scope.save();
		});
	}

	$scope.relinquishedMap = null;
	$scope.relinquishedMarker = null;
		
	$scope.initRelinquishedMap = function() {
		$scope.relinquishedMap = new google.maps.Map(document.getElementById('relinquished_map'), mapOptions);
		google.maps.event.addListener($scope.relinquishedMap, 'click', function(event) {
			setRelinquishedMarker(event.latLng.lat().toFixed(5), event.latLng.lng().toFixed(5));
			setRelinquishedCoords(event.latLng);
		});
	};
	
    function setRelinquishedMarker(lat, lng) {       
		if (!$scope.relinquishedMap) return;

		var relinquishedLat, relinquishedLng;
		if ((lat != undefined) && (lat != null) && (lat != ''))
		{
			relinquishedLat = parseFloat(lat);
		}
		if ((lng != undefined) && (lng != null) && (lng != ''))
		{
			relinquishedLng = parseFloat(lng);
		}
		var relinquishedLatlng = new google.maps.LatLng(relinquishedLat, relinquishedLng);

		//-- clear the previous marker
        if ($scope.relinquishedMarker != null) {
            $scope.relinquishedMarker.setMap(null);
        }

        $scope.relinquishedMarker = new google.maps.Marker({
            position: relinquishedLatlng,
            map: $scope.relinquishedMap,
            draggable:true
        });

		google.maps.event.addListener($scope.relinquishedMarker, 'dragend', function(event) {
			setRelinquishedCoords(event.latLng);
        });		
    }

	function setRelinquishedCoords(latLng) {
		$scope.$apply(function() {
			$scope.item.relinquished_latitude = latLng.lat().toFixed(5);
			$scope.item.relinquished_longitude = latLng.lng().toFixed(5);
			$scope.save();
		});
	}

	$scope.previewBrochure = function(item) {
		$timeout(function () {
			var previewWindow = window.open('', 'Brochure for ' + util_blank_if_null(item.turtle_name), 'width=800,height=600,titlebar=0,location=0,menubar=0,toolbar=0');
			previewWindow.document.write("<html><head><title>Brochure for " + util_blank_if_null(item.turtle_name) + "</title><style>@media print { .non-printable { display: none; } .printable { display: block; } }</style></head><body style='font-family: Arial; background-color: " + item.brochure_background_color + ";'></body></html>")
			var newDiv = previewWindow.document.createElement('div');
			newDiv.innerHTML = 
				"<div class='non-printable'><a href='#' onclick='window.print();return false;'><img src='/rosterweb/img/print.png' height='46px' width='35px'></a><br /></div>" + 
				"<div class='printable'>" + 
				"<div style='float:left; margin-left:20px; margin-top:20px;'><img src='" + item.brochure_image_file_attachment_id + "' height='240px' width='240px' /></div>" +
				"<p><span style='font-weight:bold; margin-left:12px;'>Turtle Name:  </span>" + util_blank_if_null(item.turtle_name) + "</p>" +
				"<p><span style='font-weight:bold; margin-left:12px;'>Species:  </span>" + util_blank_if_null(item.species) + "</p>" +
				"<p><span style='font-weight:bold; margin-left:12px;'>Size:  </span>" + util_blank_if_null(item.turtle_size) + "</p>" +
				"<p><span style='font-weight:bold; margin-left:12px;'>Arrival Weight:  </span>" + $scope.arrival_weight_value + " " + $scope.arrival_weight_units + "</p>" +
				"<p><span style='font-weight:bold; margin-left:12px;'>Stranding Date:  </span>" + util_blank_if_null(item.date_acquired) + "</p>" +
				"<p><span style='font-weight:bold; margin-left:12px;'>Location Found:  </span>" + util_blank_if_null(item.acquired_from) + "</p>" +
				"<p><span style='font-weight:bold; margin-left:12px;'>County:  </span>" + util_blank_if_null(item.acquired_county) + "</p>" +
				"<div style='clear:both; float:left; margin-left:20px;'><p><span style='font-weight: bold;'>Comments:  </span></p></p>" + util_blank_if_null(item.brochure_comments).replace(/(\r\n|\n|\r)/g,"<br />"); + "</p></div>" +
				"</div>"
			previewWindow.document.body.appendChild(newDiv);
			previewWindow.focus();
        });
    };
	
	$scope.save = function() {
        turtleService.save($scope.item, function() {
			$rootScope.currentTurtle.turtleId = $scope.item.turtle_id;
			$rootScope.currentTurtle.turtleName = $scope.item.turtle_name;
			$cookieStore.put('rootScopeCurrentTurtle', $rootScope.currentTurtle);
			if ($scope.item.is_new)
			{
				recordCountService.resetAll($rootScope.currentUser.organizationId);
				$scope.item.is_new = false;
			}
			setAcquiredMarker($scope.item.acquired_latitude, $scope.item.acquired_longitude);
			setRelinquishedMarker($scope.item.relinquished_latitude, $scope.item.relinquished_longitude);
		});
    };
	
	//--------------------------------------------------------------------------------
	//-- if there in no ID in the route, then we are creating a new item...
	//--------------------------------------------------------------------------------
	if ($routeParams.turtle_id == undefined)
	{
		$scope.item = { is_new: true, turtle_id: util_new_guid(), organization_id: $rootScope.currentUser.organizationId };
		$scope.save();
	}
	//--------------------------------------------------------------------------------
	//-- ...else, we are editing an existing item
	//--------------------------------------------------------------------------------
	else
	{
		//-- we need to do this before calling the async "get" below so the parent screen has $rootScope.currentTurtle.turtleId
		$rootScope.currentTurtle.turtleId = $routeParams.turtle_id;
		$rootScope.currentTurtle.turtleName = '';
		$cookieStore.put('rootScopeCurrentTurtle', $rootScope.currentTurtle);

		turtleService.get($routeParams.turtle_id).then(
			function(result){ //-- success
				$scope.item = result;
				$scope.item.is_new = false;
				$rootScope.currentTurtle.turtleId = $scope.item.turtle_id;
				$rootScope.currentTurtle.turtleName = $scope.item.turtle_name;
				$cookieStore.put('rootScopeCurrentTurtle', $rootScope.currentTurtle);
				turtleService.getArrivalWeight($scope.item.turtle_id).then(
					function(result){ //-- success
						$scope.arrival_weight_value = result.weight_value;
						$scope.arrival_weight_units = result.weight_units;
					}
				);

				$timeout(function () {
					$scope.initAcquiredMap();
					setAcquiredMarker($scope.item.acquired_latitude, $scope.item.acquired_longitude);
					$scope.initRelinquishedMap();
					setRelinquishedMarker($scope.item.relinquished_latitude, $scope.item.relinquished_longitude);
				});
			}
		);
	}
	
	recordCountService.resetAllForTurtle($rootScope.currentTurtle.turtleId);
};

var TurtleAttachmentListCtrl = function ($rootScope, $scope, $location, $modal, turtleAttachmentService, recordCountService) {

    $scope.search = function() {
		$scope.items = turtleAttachmentService.search($scope.q, $scope.sort_order, $scope.sort_desc);
    };

    $scope.sort_by = function(property_name) {
        if ($scope.sort_order == property_name) { 
			$scope.sort_desc = !$scope.sort_desc; 
		} else { 
			$scope.sort_desc = false; 
		}
        $scope.sort_order = property_name;
        $scope.search();
    };

    $scope.delete = function(item) {
		util_open_delete_dialog($modal, 'attachment', item.base_file_name, function(result) {
			if (result == 'yes') {
				turtleAttachmentService.delete(item.turtle_id, item.base_file_name, function() {
					recordCountService.resetAllForTurtle($rootScope.currentTurtle.turtleId);
					$("#item_" + item.turtle_attachment_id).fadeOut();
				});
			}
		});
	};
	
	$scope.refresh = function() {
		console.log('In TurtleAttachmentListCtrl::refresh()...');
		$scope.search();
		recordCountService.resetAllForTurtle($rootScope.currentTurtle.turtleId);
	}
	
    $scope.sort_order = 'base_file_name';
    $scope.sort_desc = false;
    $scope.search();
};

var TurtleMorphometricListCtrl = function ($rootScope, $scope, $location, $modal, turtleMorphometricService, recordCountService) {

	$scope.isChecked = {};
	$scope.isChecked.sclNotchNotch = true;
	$scope.isChecked.sclNotchTip = true;
	$scope.isChecked.sclTipTip = true;
	$scope.isChecked.scw = true;
	$scope.isChecked.cclNotchNotch = true;
	$scope.isChecked.cclNotchTip = true;
	$scope.isChecked.cclTipTip = true;
	$scope.isChecked.ccw = true;
	$scope.isChecked.weight = true;

    $scope.search = function() {
		$scope.items = turtleMorphometricService.search($scope.q, $scope.sort_order, $scope.sort_desc);
    };

    $scope.sort_by = function(property_name) {
        if ($scope.sort_order == property_name) { 
			$scope.sort_desc = !$scope.sort_desc; 
		} else { 
			$scope.sort_desc = false; 
		}
        $scope.sort_order = property_name;
    };

    $scope.delete = function(item) {
		util_open_delete_dialog($modal, 'morphometric', item.date_measured, function(result) {
			if (result == 'yes') {
				turtleMorphometricService.delete(item.turtle_morphometric_id, function() {
					recordCountService.resetAllForTurtle($rootScope.currentTurtle.turtleId);
					$("#item_" + item.turtle_morphometric_id).fadeOut();
				});
			}
		});
	};
	
    $scope.sort_order = 'date_measured';
    $scope.sort_desc = false;
    $scope.search();
};

var TurtleMorphometricEditCtrl = function($rootScope, $scope, $routeParams, $location, turtleMorphometricService, turtleService, codeTableService, recordCountService) {

	$scope.datePicker = {
		'dateMeasuredOpened': false
	};
 	$scope.dateOptions = {
		'show-weeks' : false
	};
	$scope.openDatePicker = function($event, opened) {
		$event.preventDefault();
		$event.stopPropagation();
		$scope.datePicker[opened] = true;
	};

    $scope.cm_ins = codeTableService.getCodes('cm_in'); 
    $scope.kg_lbs = codeTableService.getCodes('kg_lb'); 
	
	$scope.save = function() {
        turtleMorphometricService.save($scope.item, function() {
			if ($scope.item.is_new)
			{
				recordCountService.resetAllForTurtle($rootScope.currentTurtle.turtleId);
				$scope.item.is_new = false;
			}
		});
		turtleService.getArrivalWeight($scope.item.turtle_id).then(
			function(result){ //-- success
				$scope.arrival_weight_value = result.weight_value;
				$scope.arrival_weight_units = result.weight_units;
			}
		);
    };

	//--------------------------------------------------------------------------------
	//-- if there in no ID in the route, then we are creating a new item...
	//--------------------------------------------------------------------------------
	if ($routeParams.turtle_morphometric_id == undefined)
	{
		$scope.item = { is_new: true, turtle_morphometric_id: util_new_guid(), turtle_id: $rootScope.currentTurtle.turtleId };
		if ($rootScope.currentUser.preferredUnitsType == 'I')
		{
			$scope.item.scl_notch_notch_units = 'in';
			$scope.item.scl_notch_tip_units = 'in';
			$scope.item.scl_tip_tip_units = 'in';
			$scope.item.scw_units = 'in';
			$scope.item.ccl_notch_notch_units = 'in';
			$scope.item.ccl_notch_tip_units = 'in';
			$scope.item.ccl_tip_tip_units = 'in';
			$scope.item.ccw_units = 'in';
			$scope.item.weight_units = 'lb';
		} 
		else
		{
			$scope.item.scl_notch_notch_units = 'cm';
			$scope.item.scl_notch_tip_units = 'cm';
			$scope.item.scl_tip_tip_units = 'cm';
			$scope.item.scw_units = 'cm';
			$scope.item.ccl_notch_notch_units = 'cm';
			$scope.item.ccl_notch_tip_units = 'cm';
			$scope.item.ccl_tip_tip_units = 'cm';
			$scope.item.ccw_units = 'cm';
			$scope.item.weight_units = 'kg';
		}
		$scope.save();
	}
	//--------------------------------------------------------------------------------
	//-- ...else, we are editing an existing item
	//--------------------------------------------------------------------------------
	else
	{
		$scope.item = turtleMorphometricService.get($routeParams.turtle_morphometric_id);
		$scope.item.is_new = false;
		turtleMorphometricService.get($routeParams.turtle_morphometric_id).then(
			function(result){ //-- success
				$scope.item = result; 
				$scope.item.is_new = false;
				if ($rootScope.currentUser.preferredUnitsType == 'I')
				{
					if (($scope.item.scl_notch_notch_value == undefined) || ($scope.item.scl_notch_notch_value == null) || ($scope.item.scl_notch_notch_value == 0))
					{
						$scope.item.scl_notch_notch_units = 'in';
					}
					if (($scope.item.scl_notch_tip_value == undefined) || ($scope.item.scl_notch_tip_value == null) || ($scope.item.scl_notch_tip_value == 0))
					{
						$scope.item.scl_notch_tip_units = 'in';
					}
					if (($scope.item.scl_tip_tip_value == undefined) || ($scope.item.scl_tip_tip_value == null) || ($scope.item.scl_tip_tip_value == 0))
					{
						$scope.item.scl_tip_tip_units = 'in';
					}
					if (($scope.item.scw_value == undefined) || ($scope.item.scw_value == null) || ($scope.item.scw_value == 0))
					{
						$scope.item.scw_units = 'in';
					}
					if (($scope.item.ccl_notch_notch_value == undefined) || ($scope.item.ccl_notch_notch_value == null) || ($scope.item.ccl_notch_notch_value == 0))
					{
						$scope.item.ccl_notch_notch_units = 'in';
					}
					if (($scope.item.ccl_notch_tip_value == undefined) || ($scope.item.ccl_notch_tip_value == null) || ($scope.item.ccl_notch_tip_value == 0))
					{
						$scope.item.ccl_notch_tip_units = 'in';
					}
					if (($scope.item.ccl_tip_tip_value == undefined) || ($scope.item.ccl_tip_tip_value == null) || ($scope.item.ccl_tip_tip_value == 0))
					{
						$scope.item.ccl_tip_tip_units = 'in';
					}
					if (($scope.item.ccw_value == undefined) || ($scope.item.ccw_value == null) || ($scope.item.ccw_value == 0))
					{
						$scope.item.ccw_units = 'in';
					}
					if (($scope.item.weight_value == undefined) || ($scope.item.weight_value == null) || ($scope.item.weight_value == 0))
					{
						$scope.item.weight_units = 'lb';
					}
				} 
				else
				{
					if (($scope.item.scl_notch_notch_value == undefined) || ($scope.item.scl_notch_notch_value == null) || ($scope.item.scl_notch_notch_value == 0))
					{
						$scope.item.scl_notch_notch_units = 'cm';
					}
					if (($scope.item.scl_notch_tip_value == undefined) || ($scope.item.scl_notch_tip_value == null) || ($scope.item.scl_notch_tip_value == 0))
					{
						$scope.item.scl_notch_tip_units = 'cm';
					}
					if (($scope.item.scl_tip_tip_value == undefined) || ($scope.item.scl_tip_tip_value == null) || ($scope.item.scl_tip_tip_value == 0))
					{
						$scope.item.scl_tip_tip_units = 'cm';
					}
					if (($scope.item.scw_value == undefined) || ($scope.item.scw_value == null) || ($scope.item.scw_value == 0))
					{
						$scope.item.scw_units = 'cm';
					}
					if (($scope.item.ccl_notch_notch_value == undefined) || ($scope.item.ccl_notch_notch_value == null) || ($scope.item.ccl_notch_notch_value == 0))
					{
						$scope.item.ccl_notch_notch_units = 'cm';
					}
					if (($scope.item.ccl_notch_tip_value == undefined) || ($scope.item.ccl_notch_tip_value == null) || ($scope.item.ccl_notch_tip_value == 0))
					{
						$scope.item.ccl_notch_tip_units = 'cm';
					}
					if (($scope.item.ccl_tip_tip_value == undefined) || ($scope.item.ccl_tip_tip_value == null) || ($scope.item.ccl_tip_tip_value == 0))
					{
						$scope.item.ccl_tip_tip_units = 'cm';
					}
					if (($scope.item.ccw_value == undefined) || ($scope.item.ccw_value == null) || ($scope.item.ccw_value == 0))
					{
						$scope.item.ccw_units = 'cm';
					}
					if (($scope.item.weight_value == undefined) || ($scope.item.weight_value == null) || ($scope.item.weight_value == 0))
					{
						$scope.item.weight_units = 'kg';
					}
				}
			}
		);
	}
};

var TurtleTagListCtrl = function ($rootScope, $scope, $location, $modal, turtleTagService, recordCountService) {

    $scope.search = function() {
		$scope.items = turtleTagService.search($scope.q, $scope.sort_order, $scope.sort_desc);
    };

    $scope.sort_by = function(property_name) {
        if ($scope.sort_order == property_name) { 
			$scope.sort_desc = !$scope.sort_desc; 
		} else { 
			$scope.sort_desc = false; 
		}
        $scope.sort_order = property_name;
    };

    $scope.delete = function(item) {
		util_open_delete_dialog($modal, 'tag', item.tag_number, function(result) {
			if (result == 'yes') {
				turtleTagService.delete(item.turtle_tag_id, function() {
					recordCountService.resetAllForTurtle($rootScope.currentTurtle.turtleId);
					$("#item_" + item.turtle_tag_id).fadeOut();
				});
			}
		});
	};
	
    $scope.sort_order = 'tag_number';
    $scope.sort_desc = false;
    $scope.search();
};

var TurtleTagEditCtrl = function($rootScope, $scope, $routeParams, $location, turtleTagService, codeTableService, recordCountService) {

	$scope.datePicker = {
		'dateTaggedOpened': false
	};
 	$scope.dateOptions = {
		'show-weeks' : false
	};
	$scope.openDatePicker = function($event, opened) {
		$event.preventDefault();
		$event.stopPropagation();
		$scope.datePicker[opened] = true;
	};

    $scope.tag_locations = codeTableService.getCodes('tag_location'); 
    $scope.tag_types = codeTableService.getCodes('tag_type'); 
	
    $scope.item = turtleTagService.get($routeParams.turtle_tag_id);

	$scope.save = function() {
        turtleTagService.save($scope.item, function() {
			if ($scope.item.is_new)
			{
				recordCountService.resetAllForTurtle($rootScope.currentTurtle.turtleId);
				$scope.item.is_new = false;
			}
		});
    };

	//--------------------------------------------------------------------------------
	//-- if there in no ID in the route, then we are creating a new item...
	//--------------------------------------------------------------------------------
	if ($routeParams.turtle_tag_id == undefined)
	{
		$scope.item = { is_new: true, turtle_tag_id: util_new_guid(), turtle_id: $rootScope.currentTurtle.turtleId };
		$scope.save();
	}
	//--------------------------------------------------------------------------------
	//-- ...else, we are editing an existing item
	//--------------------------------------------------------------------------------
	else
	{
		$scope.item = turtleTagService.get($routeParams.turtle_tag_id);
		$scope.item.is_new = false;
	}
};

var UserListCtrl = function ($rootScope, $scope, $location, $modal, userService, recordCountService) {

    $scope.search = function() {
		$scope.items = userService.search($scope.q, $scope.sort_order, $scope.sort_desc);
    };

    $scope.sort_by = function(property_name) {
        if ($scope.sort_order == property_name) { 
			$scope.sort_desc = !$scope.sort_desc; 
		} else { 
			$scope.sort_desc = false; 
		}
        $scope.sort_order = property_name;
    };

    $scope.delete = function(item) {
		util_open_delete_dialog($modal, 'user', item.user_name, function(result) {
			if (result == 'yes') {
				userService.delete(item.user_id, function() {
					recordCountService.resetAll($rootScope.currentUser.organizationId);
					$("#item_" + item.user_id).fadeOut();
				});
			}
		});
	};
	
	$scope.searchFilter = function(item) {
		var re = new RegExp($scope.q, 'i');
		return !$scope.q || re.test(item.user_name) || re.test(item.user_email) || re.test(item.organization_name);
	};
	
    $scope.sort_order = 'user_name';
    $scope.sort_desc = false;
    $scope.search();
};

var UserEditCtrl = function($rootScope, $scope, $routeParams, $location, userService, organizationListItemService, recordCountService) {

	$scope.organizations = organizationListItemService.getAll();

	$scope.save = function() {
        userService.save($scope.item, function() {
			if ($scope.item.is_new)
			{
				recordCountService.resetAll($rootScope.currentUser.organizationId);
				$scope.item.is_new = false;
			}
		});
    };

	//--------------------------------------------------------------------------------
	//-- if there in no ID in the route, then we are creating a new item...
	//--------------------------------------------------------------------------------
	if ($routeParams.user_id == undefined)
	{
		$scope.item = { is_new: true, user_id: util_new_guid() };
		$scope.save();
	}
	//--------------------------------------------------------------------------------
	//-- ...else, we are editing an existing item
	//--------------------------------------------------------------------------------
	else
	{
		$scope.item = userService.get($routeParams.user_id);
		$scope.item.is_new = false;
	}
};

var WashbacksEventListCtrl = function ($rootScope, $scope, $location, $modal, washbacksEventService, recordCountService) {

    $scope.search = function() {
		$scope.items = washbacksEventService.search($scope.q, $scope.sort_order, $scope.sort_desc);
    };

    $scope.sort_by = function(property_name) {
        if ($scope.sort_order == property_name) { 
			$scope.sort_desc = !$scope.sort_desc; 
		} else { 
			$scope.sort_desc = false; 
		}
        $scope.sort_order = property_name;
    };

	$scope.delete = function(item) {
		util_open_delete_dialog($modal, 'washbacks ' + item.event_type_code + ' event', item.species_code + ' - ' + item.event_date, function(result) {
			if (result == 'yes') {
				washbacksEventService.delete(item.washbacks_event_id, item.event_type_code, function() {
					recordCountService.resetAll($rootScope.currentUser.organizationId);
					$("#item_" + item.washbacks_event_id).fadeOut();
				});
			}
		});
	};
	
	$scope.searchFilter = function(item) {
		var re = new RegExp($scope.q, 'i');
		return !$scope.q || re.test(item.event_date) || re.test(item.species_code) || re.test(item.event_type) || re.test(item.event_count) || re.test(item.county_name);
	};

    $scope.sort_order = 'event_date';
    $scope.sort_desc = false;
    $scope.search();
};

var WashbacksAcquiredEventEditCtrl = function($rootScope, $scope, $routeParams, $location, washbacksEventService, codeTableService, countyService, recordCountService) {
	
	$scope.datePicker = {
		'eventDateOpened': false
	};
 	$scope.dateOptions = {
		'show-weeks' : false
	};
	$scope.openDatePicker = function($event, opened) {
		$event.preventDefault();
		$event.stopPropagation();
		$scope.datePicker[opened] = true;
	};

    $scope.species = codeTableService.getCodes('species'); 
	$scope.counties = countyService.getAll('county_name', false);

	$scope.save = function() {
        washbacksEventService.save($scope.item, function() {
			if ($scope.item.is_new)
			{
				recordCountService.resetAll($rootScope.currentUser.organizationId);
				$scope.item.is_new = false;
			}
		});
    };

	//--------------------------------------------------------------------------------
	//-- if there in no ID in the route, then we are creating a new item...
	//--------------------------------------------------------------------------------
	if ($routeParams.washbacks_event_id == undefined)
	{
		var newId = util_new_guid();
		$scope.item = { is_new: true, washbacks_event_id: newId, washbacks_acquired_event_id: newId, organization_id: $rootScope.currentUser.organizationId, event_type_code: 'acquired', event_type: 'Acquired' };
		$scope.save();
	}
	//--------------------------------------------------------------------------------
	//-- ...else, we are editing an existing item
	//--------------------------------------------------------------------------------
	else
	{
		$scope.item = washbacksEventService.get($routeParams.washbacks_event_id, 'acquired');
		$scope.item.is_new = false;
	}
};

var WashbacksDiedEventEditCtrl = function($rootScope, $scope, $routeParams, $location, washbacksEventService, codeTableService, countyService, recordCountService) {
	
	$scope.datePicker = {
		'eventDateOpened': false
	};
 	$scope.dateOptions = {
		'show-weeks' : false
	};
	$scope.openDatePicker = function($event, opened) {
		$event.preventDefault();
		$event.stopPropagation();
		$scope.datePicker[opened] = true;
	};
	
    $scope.species = codeTableService.getCodes('species'); 

	$scope.save = function() {
        washbacksEventService.save($scope.item, function() {
			if ($scope.item.is_new)
			{
				recordCountService.resetAll($rootScope.currentUser.organizationId);
				$scope.item.is_new = false;
			}
		});
    };

	//--------------------------------------------------------------------------------
	//-- if there in no ID in the route, then we are creating a new item...
	//--------------------------------------------------------------------------------
	console.log('$routeParams.washbacks_event_id = ' + $routeParams.washbacks_event_id);
	if ($routeParams.washbacks_event_id == undefined)
	{
		var newId = util_new_guid();
		$scope.item = { is_new: true, washbacks_event_id: newId, washbacks_died_event_id: newId, organization_id: $rootScope.currentUser.organizationId, event_type_code: 'died', event_type: 'Died' };
		$scope.save();
	}
	//--------------------------------------------------------------------------------
	//-- ...else, we are editing an existing item
	//--------------------------------------------------------------------------------
	else
	{
		$scope.item = washbacksEventService.get($routeParams.washbacks_event_id, 'died');
		$scope.item.is_new = false;
	}
};

var WashbacksDoaEventEditCtrl = function($rootScope, $scope, $routeParams, $location, washbacksEventService, codeTableService, countyService, recordCountService) {
	
	$scope.datePicker = {
		'eventDateOpened': false
	};
 	$scope.dateOptions = {
		'show-weeks' : false
	};
	$scope.openDatePicker = function($event, opened) {
		$event.preventDefault();
		$event.stopPropagation();
		$scope.datePicker[opened] = true;
	};

    $scope.species = codeTableService.getCodes('species'); 
	$scope.counties = countyService.getAll('county_name', false);

	$scope.save = function() {
        washbacksEventService.save($scope.item, function() {
			if ($scope.item.is_new)
			{
				recordCountService.resetAll($rootScope.currentUser.organizationId);
				$scope.item.is_new = false;
			}
		});
    };

	//--------------------------------------------------------------------------------
	//-- if there in no ID in the route, then we are creating a new item...
	//--------------------------------------------------------------------------------
	if ($routeParams.washbacks_event_id == undefined)
	{
		var newId = util_new_guid();
		$scope.item = { is_new: true, washbacks_event_id: newId, washbacks_doa_event_id: newId, organization_id: $rootScope.currentUser.organizationId, event_type_code: 'doa', event_type: 'DOA' };
		$scope.save();
	}
	//--------------------------------------------------------------------------------
	//-- ...else, we are editing an existing item
	//--------------------------------------------------------------------------------
	else
	{
		$scope.item = washbacksEventService.get($routeParams.washbacks_event_id, 'doa');
		$scope.item.is_new = false;
	}
};

var WashbacksReleasedEventEditCtrl = function($rootScope, $scope, $routeParams, $location, washbacksEventService, codeTableService, countyService, recordCountService) {
	
	$scope.datePicker = {
		'eventDateOpened': false
	};
 	$scope.dateOptions = {
		'show-weeks' : false
	};
	$scope.openDatePicker = function($event, opened) {
		$event.preventDefault();
		$event.stopPropagation();
		$scope.datePicker[opened] = true;
	};

    $scope.species = codeTableService.getCodes('species'); 
	$scope.counties = countyService.getAll('county_name', false);

	$scope.save = function() {
        washbacksEventService.save($scope.item, function() {
			if ($scope.item.is_new)
			{
				recordCountService.resetAll($rootScope.currentUser.organizationId);
				$scope.item.is_new = false;
			}
		});
    };

	//--------------------------------------------------------------------------------
	//-- if there in no ID in the route, then we are creating a new item...
	//--------------------------------------------------------------------------------
	if ($routeParams.washbacks_event_id == undefined)
	{
		var newId = util_new_guid();
		$scope.item = { is_new: true, washbacks_event_id: newId, washbacks_released_event_id: newId, organization_id: $rootScope.currentUser.organizationId, event_type_code: 'released', event_type: 'Released' };
		$scope.save();
	}
	//--------------------------------------------------------------------------------
	//-- ...else, we are editing an existing item
	//--------------------------------------------------------------------------------
	else
	{
		$scope.item = washbacksEventService.get($routeParams.washbacks_event_id, 'released');
		$scope.item.is_new = false;
	}
};

