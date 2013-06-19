'use strict';

var RosterWebApp = angular.module('RosterWebApp', ['ngResource', 'ui.bootstrap', '$strap.directives', 'ngCookies'])
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider
            .when('/', { templateUrl: '/rosterweb/views/home_detail.html' })
            .when('/login/', { controller: LoginCtrl, templateUrl: '/rosterweb/views/login_detail.html' })
            .when('/logout/', { controller: LogoutCtrl, templateUrl: '/rosterweb/views/login_detail.html' })
            .when('/notregistered/', { controller: NotRegisteredCtrl, templateUrl: '/rosterweb/views/login_notregistered.html' })
            .when('/county/', { controller: CountyListCtrl, templateUrl: '/rosterweb/views/county_list.html' })
            .when('/county/new', { controller: CountyCreateCtrl, templateUrl: '/rosterweb/views/county_detail.html' })
            .when('/hatchlings_event/', { controller: HatchlingsEventListCtrl, templateUrl: '/rosterweb/views/hatchlings_event_list.html' })
            .when('/hatchlings_acquired_event/new', { controller: HatchlingsAcquiredEventEditCtrl, templateUrl: '/rosterweb/views/hatchlings_acquired_event_detail.html' })
            .when('/hatchlings_acquired_event/edit/:hatchlings_event_id', { controller: HatchlingsAcquiredEventEditCtrl, templateUrl: '/rosterweb/views/hatchlings_acquired_event_detail.html' })
            .when('/hatchlings_died_event/new', { controller: HatchlingsDiedEventEditCtrl, templateUrl: '/rosterweb/views/hatchlings_died_event_detail.html' })
            .when('/hatchlings_died_event/edit/:hatchlings_event_id', { controller: HatchlingsDiedEventEditCtrl, templateUrl: '/rosterweb/views/hatchlings_died_event_detail.html' })
            .when('/hatchlings_doa_event/new', { controller: HatchlingsDoaEventEditCtrl, templateUrl: '/rosterweb/views/hatchlings_doa_event_detail.html' })
            .when('/hatchlings_doa_event/edit/:hatchlings_event_id', { controller: HatchlingsDoaEventEditCtrl, templateUrl: '/rosterweb/views/hatchlings_doa_event_detail.html' })
            .when('/hatchlings_released_event/new', { controller: HatchlingsReleasedEventEditCtrl, templateUrl: '/rosterweb/views/hatchlings_released_event_detail.html' })
            .when('/hatchlings_released_event/edit/:hatchlings_event_id', { controller: HatchlingsReleasedEventEditCtrl, templateUrl: '/rosterweb/views/hatchlings_released_event_detail.html' })
            .when('/organization/', { controller: OrganizationListCtrl, templateUrl: '/rosterweb/views/organization_list.html' })
            .when('/organization/new', { controller: OrganizationEditCtrl, templateUrl: '/rosterweb/views/organization_detail.html' })
            .when('/organization/edit/:organization_id', { controller: OrganizationEditCtrl, templateUrl: '/rosterweb/views/organization_detail.html' })
            .when('/tank/', { controller: TankListCtrl, templateUrl: '/rosterweb/views/tank_list.html' })
            .when('/tank/new', { controller: TankEditCtrl, templateUrl: '/rosterweb/views/tank_detail.html' })
            .when('/tank/edit/:tank_id', { controller: TankEditCtrl, templateUrl: '/rosterweb/views/tank_detail.html' })
            .when('/tank_water/', { controller: TankWaterListCtrl, templateUrl: '/rosterweb/views/tank_water_list.html' })
            .when('/tank_water/new', { controller: TankWaterEditCtrl, templateUrl: '/rosterweb/views/tank_water_detail.html' })
            .when('/tank_water/edit/:tank_water_id', { controller: TankWaterEditCtrl, templateUrl: '/rosterweb/views/tank_water_detail.html' })
            .when('/turtle/', { controller: TurtleListCtrl, templateUrl: '/rosterweb/views/turtle_list.html' })
            .when('/turtle/new', { controller: TurtleEditCtrl, templateUrl: '/rosterweb/views/turtle_detail.html' })
            .when('/turtle/edit/:turtle_id', { controller: TurtleEditCtrl, templateUrl: '/rosterweb/views/turtle_detail.html' })
            .when('/turtle_morphometric/', { controller: TurtleMorphometricListCtrl, templateUrl: '/rosterweb/views/turtle_morphometric_list.html' })
            .when('/turtle_morphometric/new', { controller: TurtleMorphometricEditCtrl, templateUrl: '/rosterweb/views/turtle_morphometric_detail.html' })
            .when('/turtle_morphometric/edit/:turtle_morphometric_id', { controller: TurtleMorphometricEditCtrl, templateUrl: '/rosterweb/views/turtle_morphometric_detail.html' })
            .when('/turtle_tag/', { controller: TurtleTagListCtrl, templateUrl: '/rosterweb/views/turtle_tag_list.html' })
            .when('/turtle_tag/new', { controller: TurtleTagEditCtrl, templateUrl: '/rosterweb/views/turtle_tag_detail.html' })
            .when('/turtle_tag/edit/:turtle_tag_id', { controller: TurtleTagEditCtrl, templateUrl: '/rosterweb/views/turtle_tag_detail.html' })
            .when('/user/', { controller: UserListCtrl, templateUrl: '/rosterweb/views/user_list.html' })
            .when('/user/new', { controller: UserEditCtrl, templateUrl: '/rosterweb/views/user_detail.html' })
            .when('/user/edit/:user_id', { controller: UserEditCtrl, templateUrl: '/rosterweb/views/user_detail.html' })
            .when('/washbacks_event/', { controller: WashbacksEventListCtrl, templateUrl: '/rosterweb/views/washbacks_event_list.html' })
            .when('/washbacks_acquired_event/new', { controller: WashbacksAcquiredEventEditCtrl, templateUrl: '/rosterweb/views/washbacks_acquired_event_detail.html' })
            .when('/washbacks_acquired_event/edit/:washbacks_event_id', { controller: WashbacksAcquiredEventEditCtrl, templateUrl: '/rosterweb/views/washbacks_acquired_event_detail.html' })
            .when('/washbacks_died_event/new', { controller: WashbacksDiedEventEditCtrl, templateUrl: '/rosterweb/views/washbacks_died_event_detail.html' })
            .when('/washbacks_died_event/edit/:washbacks_event_id', { controller: WashbacksDiedEventEditCtrl, templateUrl: '/rosterweb/views/washbacks_died_event_detail.html' })
            .when('/washbacks_doa_event/new', { controller: WashbacksDoaEventEditCtrl, templateUrl: '/rosterweb/views/washbacks_doa_event_detail.html' })
            .when('/washbacks_doa_event/edit/:washbacks_event_id', { controller: WashbacksDoaEventEditCtrl, templateUrl: '/rosterweb/views/washbacks_doa_event_detail.html' })
            .when('/washbacks_released_event/new', { controller: WashbacksReleasedEventEditCtrl, templateUrl: '/rosterweb/views/washbacks_released_event_detail.html' })
            .when('/washbacks_released_event/edit/:washbacks_event_id', { controller: WashbacksReleasedEventEditCtrl, templateUrl: '/rosterweb/views/washbacks_released_event_detail.html' })
            .otherwise({ redirectTo: '/' });
    }]
	)
	.run(function($rootScope, $location, $window, $cookieStore, recordCountService) {
        $rootScope.$on("$routeChangeStart", function(event, next, current) {
			// if (current == undefined) 
			// {
			// 	console.log('[RosterWebApp.run().$rootScope.$on("$routeChangeStart")] current = undefined');
			// }
			// else
			// {
			// 	if (current.templateUrl != undefined) {	console.log('[RosterWebApp.run().$rootScope.$on("$routeChangeStart")] current.templateUrl = ' + current.templateUrl); }
			// 	if (current.redirectTo != undefined) { console.log('[RosterWebApp.run().$rootScope.$on("$routeChangeStart")] current.redirectTo = ' + current.redirectTo); }
			// }
			// if (next.templateUrl != undefined) { console.log('[RosterWebApp.run().$rootScope.$on("$routeChangeStart")] next.templateUrl = ' + next.templateUrl); }
			// if (next.redirectTo != undefined) {	console.log('[RosterWebApp.run().$rootScope.$on("$routeChangeStart")] next.redirectTo = ' + next.redirectTo); }
			
			if (next.templateUrl == '/rosterweb/views/login_detail.html') { return; }
			if (next.templateUrl == '/rosterweb/views/login_notregistered.html') { return; }

            if ($cookieStore.get('is_registered') != 'true') 
			{
				//-- no authenticated user, we should be going to #login
				$location.url('/login/');
			}
			else
			{
				//-- if the current route object is undefined, this is the first time or a refresh/F5, so restore state...
				if (current == undefined) 
				{
					//console.log('[RosterWebApp.run().$rootScope.$on("$routeChangeStart")] Resetting $rootScope from $cookieStore...');
					$rootScope.currentUser = $cookieStore.get('rootScopeCurrentUser');
					$rootScope.currentTurtle = $cookieStore.get('rootScopeCurrentTurtle');
					$rootScope.currentTank = $cookieStore.get('rootScopeCurrentTank');
					recordCountService.resetAll($rootScope.currentUser.organizationId);
				}
			}
        });
	});
