RosterWebApp.service('codeTableService', function() {
    this.getCodes = function(code_type) {
		switch(code_type)
		{
			case 'capture_project_type':
				return [
					{"id": "N", "name": "N - Nesting beach"},
					{"id": "T", "name": "T - Tangle net"},
					{"id": "P", "name": "P - Pound net"},
					{"id": "H", "name": "H - Hand catch"},
					{"id": "S", "name": "S - Stranding"},
					{"id": "O", "name": "O - Other"}
				]; 
				break;
			case 'cm_in':
				return [
					{"id": "cm", "name": "cm"},
					{"id": "in", "name": "in"}
				]; 
				break;
			case 'kg_lb':
				return [
					{"id": "kg", "name": "kg"},
					{"id": "lb", "name": "lb"}
				]; 
				break;
			case 'recapture_type':
				return [
					{"id": "S", "name": "S - Recapture of same project turtle"},
					{"id": "D", "name": "D - Recapture of different project turtle"}
				]; 
				break;
			case 'species':
				return [
					{"id": "CC", "name": "CC - Caretta caretta (Loggerhead)"},
					{"id": "CM", "name": "CM - Chelonia mydas (Green)"},
					{"id": "DC", "name": "DC - Dermochelys coriacea (Leatherback)"},
					{"id": "EI", "name": "EI - Eretmochelys imbricata (Hawksbill)"},
					{"id": "LK", "name": "LK - Lepidochelys kempii (Kemp's Ridley)"},
					{"id": "LO", "name": "LO - Lepidochelys olivacea (Olive Ridley)"},
					{"id": "HB", "name": "HB - Hybrid"},
					{"id": "XX", "name": "XX - Unknown"}
				]; 
				break;
			case 'state':
				return [
					{"id": "AL", "name": "Alabama"},
					{"id": "AK", "name": "Alaska"},
					{"id": "AZ", "name": "Arizona"},
					{"id": "AR", "name": "Arkansas"},
					{"id": "CA", "name": "California"},
					{"id": "CO", "name": "Colorado"},
					{"id": "CT", "name": "Connecticut"},
					{"id": "DE", "name": "Delaware"},
					{"id": "DC", "name": "District of Columbia"},
					{"id": "FL", "name": "Florida"},
					{"id": "GA", "name": "Georgia"},
					{"id": "HI", "name": "Hawaii"},
					{"id": "ID", "name": "Idaho"},
					{"id": "IL", "name": "Illinois"},
					{"id": "IN", "name": "Indiana"},
					{"id": "IA", "name": "Iowa"},
					{"id": "KS", "name": "Kansas"},
					{"id": "KY", "name": "Kentucky"},
					{"id": "LA", "name": "Louisiana"},
					{"id": "ME", "name": "Maine"},
					{"id": "MD", "name": "Maryland"},
					{"id": "MA", "name": "Massachusetts"},
					{"id": "MI", "name": "Michigan"},
					{"id": "MN", "name": "Minnesota"},
					{"id": "MS", "name": "Mississippi"},
					{"id": "MO", "name": "Missouri"},
					{"id": "MT", "name": "Montana"},
					{"id": "NE", "name": "Nebraska"},
					{"id": "NV", "name": "Nevada"},
					{"id": "NH", "name": "New Hampshire"},
					{"id": "NJ", "name": "New Jersey"},
					{"id": "NM", "name": "New Mexico"},
					{"id": "NY", "name": "New York"},
					{"id": "NC", "name": "North Carolina"},
					{"id": "ND", "name": "North Dakota"},
					{"id": "OH", "name": "Ohio"},
					{"id": "OK", "name": "Oklahoma"},
					{"id": "OR", "name": "Oregon"},
					{"id": "PA", "name": "Pennsylvania"},
					{"id": "RI", "name": "Rhode Island"},
					{"id": "SC", "name": "South Carolina"},
					{"id": "SD", "name": "South Dakota"},
					{"id": "TN", "name": "Tennessee"},
					{"id": "TX", "name": "Texas"},
					{"id": "UT", "name": "Utah"},
					{"id": "VT", "name": "Vermont"},
					{"id": "VA", "name": "Virginia"},
					{"id": "WA", "name": "Washington"},
					{"id": "WV", "name": "West Virginia"},
					{"id": "WI", "name": "Wisconsin"},
					{"id": "WY", "name": "Wyoming"}
				];
				break;
			case 'status':
				return [
					{"id": "UR", "name": "UR - Undergoing rehab"},
					{"id": "ED", "name": "ED - Educational display"},
					{"id": "UO", "name": "UO - Unknown origin"},
					{"id": "PD", "name": "PD - Permanently disabled"},
					{"id": "PREACT", "name": "PREACT - Pre-act animal"},
					{"id": "RESEARCH", "name": "RESEARCH (requires pre-approval)"},
					{"id": "RFR", "name": "RFR - Ready for release"},
					{"id": "TSTR", "name": "TSTR - Holding until reaches size"},
					{"id": "Unknown", "name": "Unknown"}
				]; 
				break;
			case 'tag_location':
				return [
					{"id": "RFF", "name": "RFF"},
					{"id": "LFF", "name": "LFF"},
					{"id": "RRF", "name": "RRF"},
					{"id": "LRF", "name": "LRF"},
					{"id": "Other", "name": "Other"}
				]; 
				break;
			case 'tag_type':
				return [
					{"id": "Inconel", "name": "Inconel"},
					{"id": "Monel", "name": "Monel"},
					{"id": "PIT", "name": "PIT"},
					{"id": "Roto", "name": "Roto"},
					{"id": "Other", "name": "Other"}
				]; 
				break;
			case 'turtle_size':
				return [
					{"id": "Hatchling", "name": "Hatchling"},
					{"id": "Post-hatchling", "name": "Post-hatchling"},
					{"id": "Juvenile", "name": "Juvenile"},
					{"id": "Subadult", "name": "Subadult"},
					{"id": "Adult", "name": "Adult"},
					{"id": "Unknown", "name": "Unknown"}
				]; 
				break;
			case 'unit_type':
				return [
					{"id": "", "name": ""},
					{"id": "M", "name": "Metric (cm, kg, etc.)"},
					{"id": "I", "name": "Imperial (inches, lbs, etc.)"}
				]; 
				break;
			case 'yes_no_undetermined':
				return [
					{"id": "Y", "name": "Y - Yes"},
					{"id": "N", "name": "N - No"},
					{"id": "U", "name": "U - Undetermined"}
				]; 
				break;
			default:
				return [];
		}
    };
});

RosterWebApp.service('countyService', function(County) {
    this.search = function(q, sort_order, sort_desc, success, error) {
        return County.query({ q: q, sort: sort_order, desc: sort_desc, ver: util_new_guid() }, success, error);
    };	
	
    this.getAll = function(sort_order, sort_desc, success, error) {
        return County.query({ sort: sort_order, desc: sort_desc, ver: util_new_guid() }, success, error);
    };	
	
    this.get = function(county_id, success, error) {
        return County.get({ county_id: county_id }, success, error);
    };
	
	this.save = function(county, success, error) {
		if (county.is_new) {
			//-- insert
			County.save(county, success, error);
		} else {
			//-- update
			County.update({ county_id: county.county_id }, county, success, error);
		}
	};
	
    this.delete = function(county_id, success, error) {
        return County.delete({ county_id: county_id }, success, error);
    };
});

RosterWebApp.service('hatchlingsEventService', function($rootScope, HatchlingsEvent, HatchlingsAcquiredEvent, HatchlingsDiedEvent, HatchlingsDoaEvent, HatchlingsReleasedEvent) {
    this.search = function(q, sort_order, sort_desc, success, error) {
        return HatchlingsEvent.query({ q: q, sort: sort_order, desc: sort_desc, ver: util_new_guid(), organization_id: $rootScope.currentUser.organizationId }, success, error);
    };	
	
    this.getAll = function(sort_order, sort_desc, success, error) {
        return HatchlingsEvent.query({ sort: sort_order, desc: sort_desc, ver: util_new_guid(), organization_id: $rootScope.currentUser.organizationId }, success, error);
    };	
	
    this.get = function(hatchlings_event_id, event_type_code, success, error) {
		switch(event_type_code)
		{
			case 'acquired':
				return HatchlingsAcquiredEvent.get({ hatchlings_acquired_event_id: hatchlings_event_id }, success, error);
				break;
			case 'died':
				return HatchlingsDiedEvent.get({ hatchlings_died_event_id: hatchlings_event_id }, success, error);
				break;
			case 'released':
				return HatchlingsReleasedEvent.get({ hatchlings_released_event_id: hatchlings_event_id }, success, error);
				break;
			case 'doa':
				return HatchlingsDoaEvent.get({ hatchlings_doa_event_id: hatchlings_event_id }, success, error);
				break;
			default:
				return;
		}
    };
	
	this.save = function(hatchlings_event, success, error) {
		//console.log('[hatchlingsEventService.save()] hatchlings_event.event_type_code = ' + hatchlings_event.event_type_code);
		//console.log('[hatchlingsEventService.save()] hatchlings_event.hatchlings_event_id = ' + hatchlings_event.hatchlings_event_id);

		switch(hatchlings_event.event_type_code)
		{
			case 'acquired':
				hatchlings_event.hatchlings_acquired_event_id = hatchlings_event.hatchlings_event_id;
				if (hatchlings_event.is_new) {
					//-- insert
					HatchlingsAcquiredEvent.save(hatchlings_event, success, error);
				} else {
					//-- update
					HatchlingsAcquiredEvent.update({ hatchlings_acquired_event_id: hatchlings_event.hatchlings_acquired_event_id }, hatchlings_event, success, error);
				}
				break;
			case 'died':
				hatchlings_event.hatchlings_died_event_id = hatchlings_event.hatchlings_event_id;
				if (hatchlings_event.is_new) {
					//-- insert
					HatchlingsDiedEvent.save(hatchlings_event, success, error);
				} else {
					//-- update
					HatchlingsDiedEvent.update({ hatchlings_died_event_id: hatchlings_event.hatchlings_died_event_id }, hatchlings_event, success, error);
				}
				break;
			case 'released':
				hatchlings_event.hatchlings_released_event_id = hatchlings_event.hatchlings_event_id;
				if (hatchlings_event.is_new) {
					//-- insert
					HatchlingsReleasedEvent.save(hatchlings_event, success, error);
				} else {
					//-- update
					HatchlingsReleasedEvent.update({ hatchlings_released_event_id: hatchlings_event.hatchlings_released_event_id }, hatchlings_event, success, error);
				}
				break;
			case 'doa':
				hatchlings_event.hatchlings_doa_event_id = hatchlings_event.hatchlings_event_id;
				if (hatchlings_event.is_new) {
					//-- insert
					HatchlingsDoaEvent.save(hatchlings_event, success, error);
				} else {
					//-- update
					HatchlingsDoaEvent.update({ hatchlings_doa_event_id: hatchlings_event.hatchlings_doa_event_id }, hatchlings_event, success, error);
				}
				break;
			default:
				return;
		}
	};
	
    this.delete = function(hatchlings_event_id, event_type_code, success, error) {
		switch(event_type_code)
		{
			case 'acquired':
				return HatchlingsAcquiredEvent.delete({ hatchlings_acquired_event_id: hatchlings_event_id }, success, error);
				break;
			case 'died':
				return HatchlingsDiedEvent.delete({ hatchlings_died_event_id: hatchlings_event_id }, success, error);
				break;
			case 'released':
				return HatchlingsReleasedEvent.delete({ hatchlings_released_event_id: hatchlings_event_id }, success, error);
				break;
			case 'doa':
				return HatchlingsDoaEvent.delete({ hatchlings_doa_event_id: hatchlings_event_id }, success, error);
				break;
			default:
				return;
		}
	};
});

RosterWebApp.service('loginService', function($rootScope, $http, $location) {
    this.doLogin = function(openidIdentifier) {
	
		var changeLocation = function(url, forceReload) {
			$rootScope = $rootScope || angular.element(document).scope();
			if(forceReload || $rootScope.$$phase) {
				window.location = url;
			}
			else {
				//only use this if you want to replace the history stack
				//$location.path(url).replace();

				//this this if you want to change the URL and add it to the history stack
				$location.path(url);
				$rootScope.$apply();
			}
		};
		
		//$http.defaults.useXDomain = true;
		
		$http({
			method: 'GET', 
			url: '/rosterweb/api/login.php', 
			params: {openid_identifier: openidIdentifier} 
		})
		.success(function(data, status, headers, config) {
			console.log('[loginService::doLogin().success] data = ' + data);
			console.log('[loginService::doLogin().success] status = ' + status);
			console.log('[loginService::doLogin().success] headers = ' + util_print_hash(headers));
			console.log('[loginService::doLogin().success] config = ' + config);
		})
		.error(function(data, status, headers, config) {
			console.error('[loginService::doLogin().error] data = ' + data);
			console.error('[loginService::doLogin().error] status = ' + status);
			console.error('[loginService::doLogin().error] headers = ' + util_print_hash(headers));
			console.error('[loginService::doLogin().error] headers(\'Content-Type\') = ' + headers('Content-Type'));
			console.error('[loginService::doLogin().error] headers(\'Location\') = ' + headers('Location'));
			console.error('[loginService::doLogin().error] config = ' + config);
			console.error('[loginService::doLogin().error] config.url = ' + config.url);

			$rootScope.currentUser = null;
		})
		.then(function (response) {
			// The then function here is an opportunity to modify the response
			console.log('[loginService::doLogin().then] response.data = ' + response.data);
			// The return value gets picked up by the then in the controller.
			changeLocation(response.data, true);
			//return response.data;
		})
		;
	};	
});

RosterWebApp.service('logoutService', function($rootScope, $http, $location, $cookieStore) {
    this.doLogout = function() {
		
		$http({
			method: 'GET', 
			url: '/rosterweb/api/logout.php'
		})
		.success(function(data, status, headers, config) {
			console.log('[logoutService::doLogout().success] data = ' + data);
			console.log('[logoutService::doLogout().success] status = ' + status);
			console.log('[logoutService::doLogout().success] headers = ' + util_print_hash(headers));
			console.log('[logoutService::doLogout().success] config = ' + config);
			
		})
		.error(function(data, status, headers, config) {
			console.error('[logoutService::doLogout().error] data = ' + data);
			console.error('[logoutService::doLogout().error] status = ' + status);
			console.error('[logoutService::doLogout().error] headers = ' + util_print_hash(headers));
			console.error('[logoutService::doLogout().error] headers(\'Content-Type\') = ' + headers('Content-Type'));
			console.error('[logoutService::doLogout().error] headers(\'Location\') = ' + headers('Location'));
			console.error('[logoutService::doLogout().error] config = ' + config);
			console.error('[logoutService::doLogout().error] config.url = ' + config.url);
		});
		
		$.removeCookie('user_id', { path: '/' });
		$.removeCookie('is_logged_in', { path: '/' });
		$cookieStore.remove('is_registered');
		$cookieStore.remove('rootScopeCurrentUser');
		$cookieStore.remove('rootScopeCurrentTurtleId');
		$cookieStore.remove('rootScopeCurrentTurtleName');
		$cookieStore.remove('rootScopeCurrentTankId');
		$cookieStore.remove('rootScopeCurrentTankName');
		$rootScope.currentUser = null;
		$rootScope.currentTurtleId = null;
		console.log('[logoutService::doLogout()] *** USER IS LOGGED OUT ***');
	};	
});

RosterWebApp.service('organizationListItemService', function(OrganizationListItem) {
    this.getAll = function(success, error) {
        return OrganizationListItem.query({ ver: util_new_guid() }, success, error);
    };	
});

RosterWebApp.service('organizationService', function($q, $http, Organization) {
    this.search = function(q, sort_order, sort_desc, success, error) {
        return Organization.query({ q: q, sort: sort_order, desc: sort_desc, ver: util_new_guid() }, success, error);
    };	
	
    this.getAll = function(sort_order, sort_desc, success, error) {
        return Organization.query({ sort: sort_order, desc: sort_desc, ver: util_new_guid() }, success, error);
    };	
	
    this.get = function(organization_id, success, error) {
		var deferred = $q.defer();
		
		$http({
			method: 'GET', 
			url: '/rosterweb/api/organization.php', 
			params: {organization_id: organization_id} 
		})
		.success(function(data, status, headers, config) {
			deferred.resolve(data);
		})
		.error(function(data, status, headers, config) {
			deferred.reject();
		})
		;

		return deferred.promise;		
    };
		
	this.save = function(organization, success, error) {
		if (organization.is_new) {
			//-- insert / POST
			Organization.save(organization, success, error);
		} else {
			//-- update / PUT
			Organization.update({ organization_id: organization.organization_id }, organization, success, error);
		}
	};
	
    this.delete = function(organization_id, success, error) {
        return Organization.delete({ organization_id: organization_id }, success, error);
    };
});

RosterWebApp.service('recordCountService', function($q, $http, $rootScope, RecordCount) {
    this.resetAll = function(organization_id, success, error) {
        RecordCount.get({ ver: util_new_guid(), organization_id: organization_id }, 
			function(result, success) {
				$recordCounts = result;
				$rootScope.recordCounts = { 
					countyCount : $recordCounts.county_count, 				//-- system-level
					organizationCount : $recordCounts.organization_count, 	//-- system-level
					userCount : $recordCounts.user_count, 					//-- system-level
					turtleCount : $recordCounts.turtle_count, 				//-- organization-level
					tankCount : $recordCounts.tank_count, 					//-- organization-level
					hatchlingCount : $recordCounts.hatchling_count, 		//-- organization-level	
					washbackCount : $recordCounts.washback_count			//-- organization-level
				};
				success(result);
			}, error);
    };	
	
    this.resetAllForTurtle = function(turtleId, success, error) {
		if (turtleId != null)
		{
			RecordCount.get({ ver: util_new_guid(), turtle_id: turtleId }, 
				function(result, success) {
					$recordCounts = result;
					$rootScope.recordCounts.turtleTagCount = $recordCounts.turtle_tag_count; 
					$rootScope.recordCounts.turtleMorphometricCount = $recordCounts.turtle_morphometric_count;
					success(result);
				}, error);
		}
		else
		{
			$rootScope.recordCounts.turtleTagCount = 0; 
			$rootScope.recordCounts.turtleMorphometricCount = 0;
		}
    };	
	
    this.resetAllForTank = function(tankId, success, error) {
		if (tankId != null)
		{
			RecordCount.get({ ver: util_new_guid(), tank_id: tankId }, 
				function(result, success) {
					$recordCounts = result;
					$rootScope.recordCounts.tankWaterCount = $recordCounts.tank_water_count; 
					success(result);
				}, error);
		}
		else
		{
			$rootScope.recordCounts.tankWaterCount = 0; 
		}
    };	
});

RosterWebApp.service('tankService', function($q, $http, $rootScope, Tank) {
    this.search = function(q, sort_order, sort_desc, success, error) {
        return Tank.query({ q: q, sort: sort_order, desc: sort_desc, ver: util_new_guid(), organization_id: $rootScope.currentUser.organizationId }, success, error);
    };	
	
    this.getAll = function(sort_order, sort_desc, success, error) {
        return Tank.query({ sort: sort_order, desc: sort_desc, ver: util_new_guid(), organization_id: $rootScope.currentUser.organizationId }, success, error);
    };	
	
    this.get = function(tank_id, success, error) {
        //return Tank.get({ tank_id: tank_id }, success, error);
		var deferred = $q.defer();
		
		$http({
			method: 'GET', 
			url: '/rosterweb/api/tank.php', 
			params: {tank_id: tank_id} 
		})
		.success(function(data, status, headers, config) {
			deferred.resolve(data);
		})
		.error(function(data, status, headers, config) {
			deferred.reject();
		})
		;

		return deferred.promise;		
    };
	
	this.save = function(tank, success, error) {
		if (tank.is_new) {
			//-- insert
			Tank.save(tank, success, error);
		} else {
			//-- update
			Tank.update({ tank_id: tank.tank_id }, tank, success, error);
		}
	};
	
    this.delete = function(tank_id, success, error) {
        return Tank.delete({ tank_id: tank_id }, success, error);
    };
});

RosterWebApp.service('tankWaterService', function($rootScope, TankWater) {
    this.search = function(q, sort_order, sort_desc, success, error) {
        return TankWater.query({ q: q, sort: sort_order, desc: sort_desc, ver: util_new_guid(), tank_id: $rootScope.currentTankId }, success, error);
    };	
	
    this.getAll = function(sort_order, sort_desc, success, error) {
        return TankWater.query({ sort: sort_order, desc: sort_desc, ver: util_new_guid(), tank_id: $rootScope.currentTankId }, success, error);
    };	
	
    this.get = function(tank_water_id, success, error) {
        return TankWater.get({ tank_water_id: tank_water_id }, success, error);
    };
	
	this.save = function(tank_water, success, error) {
		if (tank_water.is_new) {
			//-- insert
			TankWater.save(tank_water, success, error);
		} else {
			//-- update
			TankWater.update({ tank_water_id: tank_water.tank_water_id }, tank_water, success, error);
		}
	};
	
    this.delete = function(tank_water_id, success, error) {
        return TankWater.delete({ tank_water_id: tank_water_id }, success, error);
    };
});

RosterWebApp.service('turtleService', function($q, $http, $rootScope, Turtle) {
    this.search = function(q, sort_order, sort_desc, success, error) {
        return Turtle.query({ q: q, sort: sort_order, desc: sort_desc, ver: util_new_guid(), organization_id: $rootScope.currentUser.organizationId }, success, error);
    };	
	
    this.getAll = function(sort_order, sort_desc, success, error) {
        return Turtle.query({ sort: sort_order, desc: sort_desc, ver: util_new_guid(), organization_id: $rootScope.currentUser.organizationId }, success, error);
    };	
	
    this.get = function(turtle_id, success, error) {
        //return Turtle.get({ turtle_id: turtle_id }, success, error);
		var deferred = $q.defer();
		
		$http({
			method: 'GET', 
			url: '/rosterweb/api/turtle.php', 
			params: {turtle_id: turtle_id} 
		})
		.success(function(data, status, headers, config) {
			deferred.resolve(data);
		})
		.error(function(data, status, headers, config) {
			deferred.reject();
		})
		;

		return deferred.promise;		
    };
	
	this.save = function(turtle, success, error) {
		if (turtle.is_new) {
			//-- insert
			Turtle.save(turtle, success, error);
		} else {
			//-- update
			Turtle.update({ turtle_id: turtle.turtle_id }, turtle, success, error);
		}
	};
	
    this.delete = function(turtle_id, success, error) {
        return Turtle.delete({ turtle_id: turtle_id }, success, error);
    };
});

RosterWebApp.service('turtleMorphometricService', function($q, $http, $rootScope, TurtleMorphometric) {
    this.search = function(q, sort_order, sort_desc, success, error) {
        return TurtleMorphometric.query({ q: q, sort: sort_order, desc: sort_desc, ver: util_new_guid(), turtle_id: $rootScope.currentTurtleId }, success, error);
    };	
	
    this.getAll = function(sort_order, sort_desc, success, error) {
        return TurtleMorphometric.query({ sort: sort_order, desc: sort_desc, ver: util_new_guid(), turtle_id: $rootScope.currentTurtleId }, success, error);
    };	
	
    this.get = function(turtle_morphometric_id, success, error) {
		var deferred = $q.defer();
		
		$http({
			method: 'GET', 
			url: '/rosterweb/api/turtle_morphometric.php', 
			params: {turtle_morphometric_id: turtle_morphometric_id} 
		})
		.success(function(data, status, headers, config) {
			deferred.resolve(data);
		})
		.error(function(data, status, headers, config) {
			deferred.reject();
		})
		;

		return deferred.promise;		
    };
	
	this.save = function(turtle_morphometric, success, error) {
		if (turtle_morphometric.is_new) {
			//-- insert
			TurtleMorphometric.save(turtle_morphometric, success, error);
		} else {
			//-- update
			TurtleMorphometric.update({ turtle_morphometric_id: turtle_morphometric.turtle_morphometric_id }, turtle_morphometric, success, error);
		}
	};
	
    this.delete = function(turtle_morphometric_id, success, error) {
        return TurtleMorphometric.delete({ turtle_morphometric_id: turtle_morphometric_id }, success, error);
    };
});

RosterWebApp.service('turtleTagService', function($rootScope, TurtleTag) {
    this.search = function(q, sort_order, sort_desc, success, error) {
        return TurtleTag.query({ q: q, sort: sort_order, desc: sort_desc, ver: util_new_guid(), turtle_id: $rootScope.currentTurtleId }, success, error);
    };	
	
    this.getAll = function(sort_order, sort_desc, success, error) {
        return TurtleTag.query({ sort: sort_order, desc: sort_desc, ver: util_new_guid(), turtle_id: $rootScope.currentTurtleId }, success, error);
    };	
	
    this.get = function(turtle_tag_id, success, error) {
        return TurtleTag.get({ turtle_tag_id: turtle_tag_id }, success, error);
    };
	
	this.save = function(turtle_tag, success, error) {
		if (turtle_tag.is_new) {
			//-- insert
			TurtleTag.save(turtle_tag, success, error);
		} else {
			//-- update
			TurtleTag.update({ turtle_tag_id: turtle_tag.turtle_tag_id }, turtle_tag, success, error);
		}
	};
	
    this.delete = function(turtle_tag_id, success, error) {
        return TurtleTag.delete({ turtle_tag_id: turtle_tag_id }, success, error);
    };
});

RosterWebApp.service('userService', function($q, $http, User) {
    this.search = function(q, sort_order, sort_desc, success, error) {
        return User.query({ q: q, sort: sort_order, desc: sort_desc, ver: util_new_guid() }, success, error);
    };	
	
    this.getAll = function(sort_order, sort_desc, success, error) {
        return User.query({ sort: sort_order, desc: sort_desc, ver: util_new_guid() }, success, error);
    };	
	
    this.get = function(user_id, success, error) {
        return User.get({ user_id: user_id }, success, error);
    };
	
    this.getByEmail = function(user_email, success, error) {
		var deferred = $q.defer();
		
		$http({
			method: 'GET', 
			url: '/rosterweb/api/user.php', 
			params: {user_email: user_email} 
		})
		.success(function(data, status, headers, config) {
			deferred.resolve(data);
		})
		.error(function(data, status, headers, config) {
			deferred.reject();
		})
		;

		return deferred.promise;		
    };
	
	this.save = function(user, success, error) {
		if (user.is_new) {
			//-- insert
			User.save(user, success, error);
		} else {
			//-- update
			User.update({ user_id: user.user_id }, user, success, error);
		}
	};
	
    this.delete = function(user_id, success, error) {
        return User.delete({ user_id: user_id }, success, error);
    };
});

RosterWebApp.service('washbacksEventService', function($rootScope, WashbacksEvent, WashbacksAcquiredEvent, WashbacksDiedEvent, WashbacksDoaEvent, WashbacksReleasedEvent) {
    this.search = function(q, sort_order, sort_desc, success, error) {
        return WashbacksEvent.query({ q: q, sort: sort_order, desc: sort_desc, ver: util_new_guid(), organization_id: $rootScope.currentUser.organizationId }, success, error);
    };	
	
    this.getAll = function(sort_order, sort_desc, success, error) {
        return WashbacksEvent.query({ sort: sort_order, desc: sort_desc, ver: util_new_guid(), organization_id: $rootScope.currentUser.organizationId }, success, error);
    };	
	
    this.get = function(washbacks_event_id, event_type_code, success, error) {
		switch(event_type_code)
		{
			case 'acquired':
				return WashbacksAcquiredEvent.get({ washbacks_acquired_event_id: washbacks_event_id }, success, error);
				break;
			case 'died':
				return WashbacksDiedEvent.get({ washbacks_died_event_id: washbacks_event_id }, success, error);
				break;
			case 'released':
				return WashbacksReleasedEvent.get({ washbacks_released_event_id: washbacks_event_id }, success, error);
				break;
			case 'doa':
				return WashbacksDoaEvent.get({ washbacks_doa_event_id: washbacks_event_id }, success, error);
				break;
			default:
				return;
		}
    };
	
	this.save = function(washbacks_event, success, error) {
		//console.log('[washbacksEventService.save()] washbacks_event.event_type_code = ' + washbacks_event.event_type_code);
		//console.log('[washbacksEventService.save()] washbacks_event.washbacks_event_id = ' + washbacks_event.washbacks_event_id);

		switch(washbacks_event.event_type_code)
		{
			case 'acquired':
				washbacks_event.washbacks_acquired_event_id = washbacks_event.washbacks_event_id;
				if (washbacks_event.is_new) {
					//-- insert
					WashbacksAcquiredEvent.save(washbacks_event, success, error);
				} else {
					//-- update
					WashbacksAcquiredEvent.update({ washbacks_acquired_event_id: washbacks_event.washbacks_acquired_event_id }, washbacks_event, success, error);
				}
				break;
			case 'died':
				washbacks_event.washbacks_died_event_id = washbacks_event.washbacks_event_id;
				if (washbacks_event.is_new) {
					//-- insert
					WashbacksDiedEvent.save(washbacks_event, success, error);
				} else {
					//-- update
					WashbacksDiedEvent.update({ washbacks_died_event_id: washbacks_event.washbacks_died_event_id }, washbacks_event, success, error);
				}
				break;
			case 'released':
				washbacks_event.washbacks_released_event_id = washbacks_event.washbacks_event_id;
				if (washbacks_event.is_new) {
					//-- insert
					WashbacksReleasedEvent.save(washbacks_event, success, error);
				} else {
					//-- update
					WashbacksReleasedEvent.update({ washbacks_released_event_id: washbacks_event.washbacks_released_event_id }, washbacks_event, success, error);
				}
				break;
			case 'doa':
				washbacks_event.washbacks_doa_event_id = washbacks_event.washbacks_event_id;
				if (washbacks_event.is_new) {
					//-- insert
					WashbacksDoaEvent.save(washbacks_event, success, error);
				} else {
					//-- update
					WashbacksDoaEvent.update({ washbacks_doa_event_id: washbacks_event.washbacks_doa_event_id }, washbacks_event, success, error);
				}
				break;
			default:
				return;
		}
	};
	
    this.delete = function(washbacks_event_id, event_type_code, success, error) {
		switch(event_type_code)
		{
			case 'acquired':
				return WashbacksAcquiredEvent.delete({ washbacks_acquired_event_id: washbacks_event_id }, success, error);
				break;
			case 'died':
				return WashbacksDiedEvent.delete({ washbacks_died_event_id: washbacks_event_id }, success, error);
				break;
			case 'released':
				return WashbacksReleasedEvent.delete({ washbacks_released_event_id: washbacks_event_id }, success, error);
				break;
			case 'doa':
				return WashbacksDoaEvent.delete({ washbacks_doa_event_id: washbacks_event_id }, success, error);
				break;
			default:
				return;
		}
	};
});
