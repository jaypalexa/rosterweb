var CountyListItemCtrl = function($rootScope, $scope, $location, $dialog, countyService, recordCountService) {
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
		util_open_delete_dialog($dialog, 'county', $scope.item.county_name, function(result) {
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

var CountyListCtrl = function($scope, $location, $dialog, countyService) {

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
        $scope.search();
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

var HatchlingsEventListCtrl = function ($rootScope, $scope, $location, $dialog, hatchlingsEventService, recordCountService) {

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
        $scope.search();
    };

    $scope.delete = function(item) {
		util_open_delete_dialog($dialog, 'hatchlings ' + item.event_type_code + ' event', item.species_code + ' - ' + item.event_date, function(result) {
			if (result == 'yes') {
				hatchlingsEventService.delete(item.hatchlings_event_id, item.event_type_code, function() {
					recordCountService.resetAll($rootScope.currentUser.organizationId);
					$("#item_" + item.hatchlings_event_id).fadeOut();
				});
			}
		});
	};
	
    $scope.sort_order = 'event_date';
    $scope.sort_desc = false;
    $scope.search();
};

var HatchlingsAcquiredEventEditCtrl = function($rootScope, $scope, $routeParams, $location, hatchlingsEventService, codeTableService, countyService, recordCountService) {
	
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

	$rootScope.organizations = organizationListItemService.getAll();

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

var OrganizationListCtrl = function ($rootScope, $scope, $location, $dialog, organizationService, organizationListItemService, recordCountService) {

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
        $scope.search();
    };

    $scope.delete = function(item) {
		util_open_delete_dialog($dialog, 'organization', item.organization_name, function(result) {
			if (result == 'yes') {
				organizationService.delete(item.organization_id, function() {
					$rootScope.organizations = organizationListItemService.getAll();
					recordCountService.resetAll($rootScope.currentUser.organizationId);
					$("#item_" + item.organization_id).fadeOut();
				});
			}
		});
	};
	
    $scope.sort_order = 'organization_name';
    $scope.sort_desc = false;
    $scope.search();
};

var OrganizationEditCtrl = function($rootScope, $scope, $routeParams, $location, $cookieStore, codeTableService, organizationService, organizationListItemService, recordCountService) {

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
		$scope.item = { is_new: true, organization_id: util_new_guid(), organization_name: '[new organization]' };
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

var TankListCtrl = function ($rootScope, $scope, $location, $dialog, tankService, recordCountService) {

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
        $scope.search();
    };

    $scope.delete = function(item) {
		util_open_delete_dialog($dialog, 'tank', item.tank_name, function(result) {
			if (result == 'yes') {
				tankService.delete(item.tank_id, function() {
					recordCountService.resetAll($rootScope.currentUser.organizationId);
					$("#item_" + item.tank_id).fadeOut();
				});
			}
		});
	};
	
    $scope.sort_order = 'tank_name';
    $scope.sort_desc = false;
    $scope.search();
};

var TankEditCtrl = function($rootScope, $scope, $routeParams, $location, $cookieStore, tankService, recordCountService) {

	$scope.save = function() {
        tankService.save($scope.item, function() {
			if ($scope.item.is_new)
			{
				$rootScope.currentTankId = $scope.item.tank_id;
				$cookieStore.put('rootScopeCurrentTankId', $rootScope.currentTankId);
				$rootScope.currentTankName = $scope.item.tank_name;
				$cookieStore.put('rootScopeCurrentTankName', $rootScope.currentTankName);
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
		$scope.item = { is_new: true, tank_id: util_new_guid(), tank_name: '[new tank]', organization_id: $rootScope.currentUser.organizationId };
		$scope.save();
	}
	//--------------------------------------------------------------------------------
	//-- ...else, we are editing an existing item
	//--------------------------------------------------------------------------------
	else
	{
		$rootScope.currentTankId = $routeParams.tank_id;
		$cookieStore.put('rootScopeCurrentTankId', $rootScope.currentTankId);
		
		tankService.get($routeParams.tank_id).then(
			function(result){ //-- success
				$scope.item = result;
				$scope.item.is_new = false;
				$rootScope.currentTankName = $scope.item.tank_name;
				$cookieStore.put('rootScopeCurrentTankName', $rootScope.currentTankName);
			}
		);
	}
	
	recordCountService.resetAllForTank($rootScope.currentTankId);
};

var TankWaterListCtrl = function ($rootScope, $scope, $location, $dialog, tankWaterService, recordCountService) {

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
        $scope.search();
    };

    $scope.delete = function(item) {
		util_open_delete_dialog($dialog, 'measurement', item.date_measured, function(result) {
			if (result == 'yes') {
				tankWaterService.delete(item.tank_water_id, function() {
					recordCountService.resetAllForTank($rootScope.currentTankId);
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

	$scope.save = function() {
        tankWaterService.save($scope.item, function() {
			if ($scope.item.is_new)
			{
				recordCountService.resetAllForTank($rootScope.currentTankId);
				$scope.item.is_new = false;
			}
		});
    };

	//--------------------------------------------------------------------------------
	//-- if there in no ID in the route, then we are creating a new item...
	//--------------------------------------------------------------------------------
	if ($routeParams.tank_water_id == undefined)
	{
		$scope.item = { is_new: true, tank_water_id: util_new_guid(), tank_id: $rootScope.currentTankId };
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

var TurtleListCtrl = function ($rootScope, $scope, $location, $dialog, turtleService, recordCountService) {

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
        $scope.search();
    };

    $scope.delete = function(item) {
		util_open_delete_dialog($dialog, 'turtle', item.turtle_name, function(result) {
			if (result == 'yes') {
				turtleService.delete(item.turtle_id, function() {
					recordCountService.resetAll($rootScope.currentUser.organizationId);
					$("#item_" + item.turtle_id).fadeOut();
				});
			}
		});
	};
	
    $scope.sort_order = 'turtle_name';
    $scope.sort_desc = false;
    $scope.search();
};

var TurtleEditCtrl = function($rootScope, $scope, $routeParams, $location, $cookieStore, turtleService, codeTableService, countyService, recordCountService) {

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

	$scope.save = function() {
        turtleService.save($scope.item, function() {
			if ($scope.item.is_new)
			{
				$rootScope.currentTurtleId = $scope.item.turtle_id;
				$cookieStore.put('rootScopeCurrentTurtleId', $rootScope.currentTurtleId);
				$rootScope.currentTurtleName = $scope.item.turtle_name;
				$cookieStore.put('rootScopeCurrentTurtleName', $rootScope.currentTurtleName);
				recordCountService.resetAll($rootScope.currentUser.organizationId);
				$scope.item.is_new = false;
			}
		});
    };

	//--------------------------------------------------------------------------------
	//-- if there in no ID in the route, then we are creating a new item...
	//--------------------------------------------------------------------------------
	if ($routeParams.turtle_id == undefined)
	{
		$scope.item = { is_new: true, turtle_id: util_new_guid(), turtle_name: '[new turtle]', organization_id: $rootScope.currentUser.organizationId };
		$scope.save();
	}
	//--------------------------------------------------------------------------------
	//-- ...else, we are editing an existing item
	//--------------------------------------------------------------------------------
	else
	{
		$rootScope.currentTurtleId = $routeParams.turtle_id;
		$cookieStore.put('rootScopeCurrentTurtleId', $rootScope.currentTurtleId);

		turtleService.get($routeParams.turtle_id).then(
			function(result){ //-- success
				$scope.item = result;
				$scope.item.is_new = false;
				$rootScope.currentTurtleName = $scope.item.turtle_name;
				$cookieStore.put('rootScopeCurrentTurtleName', $rootScope.currentTurtleName);
			}
		);
	}
	
	recordCountService.resetAllForTurtle($rootScope.currentTurtleId);
};

var TurtleMorphometricListCtrl = function ($rootScope, $scope, $location, $dialog, turtleMorphometricService, recordCountService) {

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
        $scope.search();
    };

    $scope.delete = function(item) {
		util_open_delete_dialog($dialog, 'morphometric', item.date_measured, function(result) {
			if (result == 'yes') {
				turtleMorphometricService.delete(item.turtle_morphometric_id, function() {
					recordCountService.resetAllForTurtle($rootScope.currentTurtleId);
					$("#item_" + item.turtle_morphometric_id).fadeOut();
				});
			}
		});
	};
	
    $scope.sort_order = 'date_measured';
    $scope.sort_desc = false;
    $scope.search();
};

var TurtleMorphometricEditCtrl = function($rootScope, $scope, $routeParams, $location, turtleMorphometricService, codeTableService, recordCountService) {

	$rootScope.turtleActiveTabName = 'turtle_morphometric';

    $scope.cm_ins = codeTableService.getCodes('cm_in'); 
    $scope.kg_lbs = codeTableService.getCodes('kg_lb'); 
	
	$scope.save = function() {
        turtleMorphometricService.save($scope.item, function() {
			if ($scope.item.is_new)
			{
				recordCountService.resetAllForTurtle($rootScope.currentTurtleId);
				$scope.item.is_new = false;
			}
		});
    };

	//--------------------------------------------------------------------------------
	//-- if there in no ID in the route, then we are creating a new item...
	//--------------------------------------------------------------------------------
	if ($routeParams.turtle_morphometric_id == undefined)
	{
		$scope.item = { is_new: true, turtle_morphometric_id: util_new_guid(), turtle_id: $rootScope.currentTurtleId };
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

var TurtleTagListCtrl = function ($rootScope, $scope, $location, $dialog, turtleTagService, recordCountService) {

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
        $scope.search();
    };

    $scope.delete = function(item) {
		util_open_delete_dialog($dialog, 'tag', item.tag_number, function(result) {
			if (result == 'yes') {
				turtleTagService.delete(item.turtle_tag_id, function() {
					recordCountService.resetAllForTurtle($rootScope.currentTurtleId);
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

	$rootScope.turtleActiveTabName = 'turtle_tag';

    $scope.tag_locations = codeTableService.getCodes('tag_location'); 
    $scope.tag_types = codeTableService.getCodes('tag_type'); 
	
    $scope.item = turtleTagService.get($routeParams.turtle_tag_id);

	$scope.save = function() {
        turtleTagService.save($scope.item, function() {
			if ($scope.item.is_new)
			{
				recordCountService.resetAllForTurtle($rootScope.currentTurtleId);
				$scope.item.is_new = false;
			}
		});
    };

	//--------------------------------------------------------------------------------
	//-- if there in no ID in the route, then we are creating a new item...
	//--------------------------------------------------------------------------------
	if ($routeParams.turtle_tag_id == undefined)
	{
		$scope.item = { is_new: true, turtle_tag_id: util_new_guid(), turtle_id: $rootScope.currentTurtleId };
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

var UserListCtrl = function ($rootScope, $scope, $location, $dialog, userService, recordCountService) {

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
        $scope.search();
    };

    $scope.delete = function(item) {
		util_open_delete_dialog($dialog, 'user', item.user_name, function(result) {
			if (result == 'yes') {
				userService.delete(item.user_id, function() {
					recordCountService.resetAll($rootScope.currentUser.organizationId);
					$("#item_" + item.user_id).fadeOut();
				});
			}
		});
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
		$scope.item = { is_new: true, user_id: util_new_guid(), user_name: '[new user]', user_email: '[new email]' };
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

var WashbacksEventListCtrl = function ($rootScope, $scope, $location, $dialog, washbacksEventService, recordCountService) {

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
        $scope.search();
    };

    $scope.delete = function(item) {
		util_open_delete_dialog($dialog, 'washbacks ' + item.event_type_code + ' event', item.species_code + ' - ' + item.event_date, function(result) {
			if (result == 'yes') {
				washbacksEventService.delete(item.washbacks_event_id, item.event_type_code, function() {
					recordCountService.resetAll($rootScope.currentUser.organizationId);
					$("#item_" + item.washbacks_event_id).fadeOut();
				});
			}
		});
	};
	
    $scope.sort_order = 'event_date';
    $scope.sort_desc = false;
    $scope.search();
};

var WashbacksAcquiredEventEditCtrl = function($rootScope, $scope, $routeParams, $location, washbacksEventService, codeTableService, countyService, recordCountService) {
	
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

