var CountyListItemCtrl = function($scope, $location, $dialog, countyService, recordCountService) {
	$scope.edit = function() {
		$scope.item_copy = angular.copy($scope.item);
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
					recordCountService.resetAll();
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

var CountyCreateCtrl = function($scope, $location, countyService, recordCountService) {
	$scope.item = { county_id: null };

    $scope.save = function() {
        countyService.save($scope.item, function() {
			recordCountService.resetAll();
            $location.path('/county/');
        });
    };
};

var HatchlingsEventListCtrl = function ($scope, $location, $dialog, hatchlingsEventService, recordCountService) {

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
		util_open_delete_dialog($dialog, 'hatchlings event', item.event_date, function(result) {
			if (result == 'yes') {
				hatchlingsEventService.delete(item.hatchlings_event_id, item.event_type_code, function() {
					recordCountService.resetAll();
					$("#item_" + item.hatchlings_event_id).fadeOut();
				});
			}
		});
	};
	
    $scope.sort_order = 'event_date';
    $scope.sort_desc = false;
    $scope.search();
};

var HatchlingsAcquiredEventCreateCtrl = function($rootScope, $scope, $location, hatchlingsEventService, codeTableService, countyService, recordCountService) {
	
    $scope.species = codeTableService.getCodes('species'); 
	$scope.counties = countyService.getAll('county_name', false);

	$scope.item = { hatchlings_event_id: null, organization_id: $rootScope.currentUser.organizationId, event_type_code: 'acquired', event_type: 'Acquired' };

    $scope.save = function() {
        hatchlingsEventService.save($scope.item, function() {
			recordCountService.resetAll();
            $location.path('/hatchlings_event/');
        });
    };
};

var HatchlingsAcquiredEventEditCtrl = function($rootScope, $scope, $routeParams, $location, hatchlingsEventService, codeTableService, countyService) {
	
    $scope.species = codeTableService.getCodes('species'); 
	$scope.counties = countyService.getAll('county_name', false);

    $scope.item = hatchlingsEventService.get($routeParams.hatchlings_event_id, 'acquired');

    $scope.save = function() {
        hatchlingsEventService.save($scope.item, function() {
            $location.path('/hatchlings_event/');
        });
    };
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
					$rootScope.currentUser = { userName : $currentUser.user_name, organizationId : $currentUser.organization_id, organizationName : $currentUser.organization_name, isLoggedIn : true, isAdmin : $currentUser.is_admin };
					$cookieStore.put('rootScopeCurrentUser', $rootScope.currentUser);
					recordCountService.resetAll();
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

var MainCtrl = function ($rootScope, $scope, $location, $route, $cookieStore, recordCountService, organizationListItemService) {

	$scope.rootOrganizations = organizationListItemService.getAll();

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
				recordCountService.resetAll();
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

var OrganizationListCtrl = function ($scope, $location, $dialog, organizationService, recordCountService) {

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
					recordCountService.resetAll();
					$("#item_" + item.organization_id).fadeOut();
				});
			}
		});
	};
	
    $scope.sort_order = 'organization_name';
    $scope.sort_desc = false;
    $scope.search();
};

var OrganizationCreateCtrl = function($scope, $location, organizationService, codeTableService, recordCountService) {
    $scope.states = codeTableService.getCodes('state'); 
    $scope.unit_types = codeTableService.getCodes('unit_type'); 
	
	$scope.item = { organization_id: null };

	$scope.save = function() {
        organizationService.save($scope.item, function() {
			recordCountService.resetAll();
			window.history.back();
		});
    };

    $scope.cancel = function() {
		window.history.back();
    };
};

var OrganizationEditCtrl = function($rootScope, $scope, $routeParams, $location, organizationService, codeTableService) {
    $scope.states = codeTableService.getCodes('state'); 
    $scope.unit_types = codeTableService.getCodes('unit_type'); 

    $scope.item = organizationService.get($routeParams.organization_id);

	$scope.save = function() {
        organizationService.save($scope.item, function() {
			window.history.back();
		});
    };

    $scope.cancel = function() {
		window.history.back();
    };
};

var TankListCtrl = function ($scope, $location, $dialog, tankService, recordCountService) {

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
					recordCountService.resetAll();
					$("#item_" + item.tank_id).fadeOut();
				});
			}
		});
	};
	
    $scope.sort_order = 'tank_name';
    $scope.sort_desc = false;
    $scope.search();
};

var TankCreateCtrl = function($rootScope, $scope, $location, tankService, recordCountService) {
	
	$scope.item = { tank_id: null, organization_id: $rootScope.currentUser.organizationId };

    $scope.save = function() {
        tankService.save($scope.item, function() {
			recordCountService.resetAll();
            $location.path('/tank/');
        });
    };
};

var TankEditCtrl = function($rootScope, $scope, $routeParams, $location, $cookieStore, tankService) {
	
	$rootScope.currentTankId = $routeParams.tank_id;
	$cookieStore.put('rootScopeCurrentTankId', $rootScope.currentTankId);
    $scope.item = tankService.get($routeParams.tank_id);

    $scope.save = function() {
        tankService.save($scope.item, function() {
            $location.path('/tank/');
        });
    };
};

var TankWaterListCtrl = function ($scope, $location, $dialog, tankWaterService, recordCountService) {

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
					recordCountService.resetAll();
					$("#item_" + item.tank_water_id).fadeOut();
				});
			}
		});
	};
	
    $scope.sort_order = 'date_measured';
    $scope.sort_desc = false;
    $scope.search();
};

var TankWaterCreateCtrl = function($rootScope, $scope, $location, tankWaterService, codeTableService, recordCountService) {
	$scope.item = { tank_water_id: null, tank_id: $rootScope.currentTankId };

    $scope.save = function() {
        tankWaterService.save($scope.item, function() {
			recordCountService.resetAll();
            $location.path('/tank_water/');
        });
    };
};

var TankWaterEditCtrl = function($scope, $routeParams, $location, tankWaterService, codeTableService) {
    $scope.item = tankWaterService.get($routeParams.tank_water_id);

    $scope.save = function() {
        tankWaterService.save($scope.item, function() {
            $location.path('/tank_water/');
        });
    };
};

var TurtleListCtrl = function ($scope, $location, $dialog, turtleService, recordCountService) {

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
					recordCountService.resetAll();
					$("#item_" + item.turtle_id).fadeOut();
				});
			}
		});
	};
	
    $scope.sort_order = 'turtle_name';
    $scope.sort_desc = false;
    $scope.search();
};

var TurtleCreateCtrl = function($rootScope, $scope, $location, turtleService, codeTableService, countyService, recordCountService) {
    $scope.capture_project_types = codeTableService.getCodes('capture_project_type'); 
	$scope.counties = countyService.getAll('county_name', false);
    $scope.recapture_types = codeTableService.getCodes('recapture_type'); 
    $scope.species = codeTableService.getCodes('species'); 
    $scope.statuses = codeTableService.getCodes('status'); 
    $scope.turtle_sizes = codeTableService.getCodes('turtle_size'); 
    $scope.yes_no_undetermineds = codeTableService.getCodes('yes_no_undetermined'); 
	
	$scope.item = { turtle_id: null, organization_id: $rootScope.currentUser.organizationId };

    $scope.save = function() {
        turtleService.save($scope.item, function() {
			recordCountService.resetAll();
            $location.path('/turtle/');
        });
    };
};

var TurtleEditCtrl = function($rootScope, $scope, $routeParams, $location, $cookieStore, turtleService, codeTableService, countyService) {
    $scope.capture_project_types = codeTableService.getCodes('capture_project_type'); 
	$scope.counties = countyService.getAll('county_name', false);
    $scope.recapture_types = codeTableService.getCodes('recapture_type'); 
    $scope.species = codeTableService.getCodes('species'); 
    $scope.statuses = codeTableService.getCodes('status'); 
    $scope.turtle_sizes = codeTableService.getCodes('turtle_size'); 
    $scope.yes_no_undetermineds = codeTableService.getCodes('yes_no_undetermined'); 
	
    $scope.item = turtleService.get($routeParams.turtle_id);
	$rootScope.currentTurtleId = $routeParams.turtle_id;
	$cookieStore.put('rootScopeCurrentTurtleId', $rootScope.currentTurtleId);
	
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
            $location.path('/turtle/');
        });
    };
};

var TurtleMorphometricListCtrl = function ($scope, $location, $dialog, turtleMorphometricService, recordCountService) {

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
					recordCountService.resetAll();
					$("#item_" + item.turtle_morphometric_id).fadeOut();
				});
			}
		});
	};
	
    $scope.sort_order = 'date_measured';
    $scope.sort_desc = false;
    $scope.search();
};

var TurtleMorphometricCreateCtrl = function($rootScope, $scope, $location, turtleMorphometricService, codeTableService, recordCountService) {
    $scope.cm_ins = codeTableService.getCodes('cm_in'); 
    $scope.kg_lbs = codeTableService.getCodes('kg_lb'); 
	
	$scope.item = { turtle_morphometric_id: null, turtle_id: $rootScope.currentTurtleId };

    $scope.save = function() {
        turtleMorphometricService.save($scope.item, function() {
			recordCountService.resetAll();
            $location.path('/turtle_morphometric/');
        });
    };
};

var TurtleMorphometricEditCtrl = function($scope, $routeParams, $location, turtleMorphometricService, codeTableService) {
    $scope.cm_ins = codeTableService.getCodes('cm_in'); 
    $scope.kg_lbs = codeTableService.getCodes('kg_lb'); 
	
    $scope.item = turtleMorphometricService.get($routeParams.turtle_morphometric_id);

    $scope.save = function() {
        turtleMorphometricService.save($scope.item, function() {
            $location.path('/turtle_morphometric/');
        });
    };
};

var TurtleTagListCtrl = function ($scope, $location, $dialog, turtleTagService, recordCountService) {

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
					recordCountService.resetAll();
					$("#item_" + item.turtle_tag_id).fadeOut();
				});
			}
		});
	};
	
    $scope.sort_order = 'tag_number';
    $scope.sort_desc = false;
    $scope.search();
};

var TurtleTagCreateCtrl = function($rootScope, $scope, $location, turtleTagService, codeTableService, recordCountService) {
    $scope.tag_locations = codeTableService.getCodes('tag_location'); 
    $scope.tag_types = codeTableService.getCodes('tag_type'); 
	
	$scope.item = { turtle_tag_id: null, turtle_id: $rootScope.currentTurtleId };

    $scope.save = function() {
        turtleTagService.save($scope.item, function() {
			recordCountService.resetAll();
            $location.path('/turtle_tag/');
        });
    };
};

var TurtleTagEditCtrl = function($scope, $routeParams, $location, turtleTagService, codeTableService) {
    $scope.tag_locations = codeTableService.getCodes('tag_location'); 
    $scope.tag_types = codeTableService.getCodes('tag_type'); 
	
    $scope.item = turtleTagService.get($routeParams.turtle_tag_id);

    $scope.save = function() {
        turtleTagService.save($scope.item, function() {
            $location.path('/turtle_tag/');
        });
    };
};

var UserListCtrl = function ($scope, $location, $dialog, userService, recordCountService) {

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
					recordCountService.resetAll();
					$("#item_" + item.user_id).fadeOut();
				});
			}
		});
	};
	
    $scope.sort_order = 'user_name';
    $scope.sort_desc = false;
    $scope.search();
};

var UserCreateCtrl = function($scope, $location, userService, organizationListItemService, recordCountService) {
	$scope.organizations = organizationListItemService.getAll();

	$scope.item = { user_id: null };

    $scope.save = function() {
        userService.save($scope.item, function() {
			recordCountService.resetAll();
            $location.path('/user/');
        });
    };
};

var UserEditCtrl = function($scope, $routeParams, $location, userService, organizationListItemService) {
	$scope.organizations = organizationListItemService.getAll();
	
    $scope.item = userService.get($routeParams.user_id);

    $scope.save = function() {
        userService.save($scope.item, function() {
            $location.path('/user/');
        });
    };
};
