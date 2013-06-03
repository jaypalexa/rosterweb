var RosterWebApp = angular.module('RosterWebApp', ['ngResource', 'ui.bootstrap', '$strap.directives', 'ngCookies'])
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider
            .when('/', { templateUrl: '/rosterweb/views/home/detail.html' })
            .when('/login/', { controller: LoginCtrl, templateUrl: '/rosterweb/views/login/detail.html' })
            .when('/logout/', { controller: LogoutCtrl, templateUrl: '/rosterweb/views/login/detail.html' })
            .when('/notregistered/', { controller: NotRegisteredCtrl, templateUrl: '/rosterweb/views/login/notregistered.html' })
            .when('/county/', { controller: CountyListCtrl, templateUrl: '/rosterweb/views/county/list.html' })
            .when('/county/new', { controller: CountyCreateCtrl, templateUrl: '/rosterweb/views/county/detail.html' })
            .when('/hatchling/', { controller: HatchlingListCtrl, templateUrl: '/rosterweb/views/hatchling/list.html' })
            .when('/organization/', { controller: OrganizationListCtrl, templateUrl: '/rosterweb/views/organization/list.html' })
            .when('/organization/new', { controller: OrganizationCreateCtrl, templateUrl: '/rosterweb/views/organization/detail.html' })
            .when('/organization/edit/:organization_id', { controller: OrganizationEditCtrl, templateUrl: '/rosterweb/views/organization/detail.html' })
            .when('/tank/', { controller: TankListCtrl, templateUrl: '/rosterweb/views/tank/list.html' })
            .when('/tank/new', { controller: TankCreateCtrl, templateUrl: '/rosterweb/views/tank/detail.html' })
            .when('/tank/edit/:tank_id', { controller: TankEditCtrl, templateUrl: '/rosterweb/views/tank/detail.html' })
            .when('/tank_water/', { controller: TankWaterListCtrl, templateUrl: '/rosterweb/views/tank_water/list.html' })
            .when('/tank_water/new', { controller: TankWaterCreateCtrl, templateUrl: '/rosterweb/views/tank_water/detail.html' })
            .when('/tank_water/edit/:tank_water_id', { controller: TankWaterEditCtrl, templateUrl: '/rosterweb/views/tank_water/detail.html' })
            .when('/turtle/', { controller: TurtleListCtrl, templateUrl: '/rosterweb/views/turtle/list.html' })
            .when('/turtle/new', { controller: TurtleCreateCtrl, templateUrl: '/rosterweb/views/turtle/detail.html' })
            .when('/turtle/edit/:turtle_id', { controller: TurtleEditCtrl, templateUrl: '/rosterweb/views/turtle/detail.html' })
            .when('/turtle_morphometric/', { controller: TurtleMorphometricListCtrl, templateUrl: '/rosterweb/views/turtle_morphometric/list.html' })
            .when('/turtle_morphometric/new', { controller: TurtleMorphometricCreateCtrl, templateUrl: '/rosterweb/views/turtle_morphometric/detail.html' })
            .when('/turtle_morphometric/edit/:turtle_morphometric_id', { controller: TurtleMorphometricEditCtrl, templateUrl: '/rosterweb/views/turtle_morphometric/detail.html' })
            .when('/turtle_tag/', { controller: TurtleTagListCtrl, templateUrl: '/rosterweb/views/turtle_tag/list.html' })
            .when('/turtle_tag/new', { controller: TurtleTagCreateCtrl, templateUrl: '/rosterweb/views/turtle_tag/detail.html' })
            .when('/turtle_tag/edit/:turtle_tag_id', { controller: TurtleTagEditCtrl, templateUrl: '/rosterweb/views/turtle_tag/detail.html' })
            .when('/user/', { controller: UserListCtrl, templateUrl: '/rosterweb/views/user/list.html' })
            .when('/user/new', { controller: UserCreateCtrl, templateUrl: '/rosterweb/views/user/detail.html' })
            .when('/user/edit/:user_id', { controller: UserEditCtrl, templateUrl: '/rosterweb/views/user/detail.html' })
            .otherwise({ redirectTo: '/' });
    }]
	)
	.run(function($rootScope, $location, $window, $cookieStore, recordCountService) {
        $rootScope.$on("$routeChangeStart", function(event, next, current) {
			if (current == undefined) 
			{
				console.log('[RosterWebApp.run().$rootScope.$on("$routeChangeStart")] current = undefined');
			}
			else
			{
				if (current.templateUrl != undefined) {	console.log('[RosterWebApp.run().$rootScope.$on("$routeChangeStart")] current.templateUrl = ' + current.templateUrl); }
				if (current.redirectTo != undefined) { console.log('[RosterWebApp.run().$rootScope.$on("$routeChangeStart")] current.redirectTo = ' + current.redirectTo); }
			}
			if (next.templateUrl != undefined) { console.log('[RosterWebApp.run().$rootScope.$on("$routeChangeStart")] next.templateUrl = ' + next.templateUrl); }
			if (next.redirectTo != undefined) {	console.log('[RosterWebApp.run().$rootScope.$on("$routeChangeStart")] next.redirectTo = ' + next.redirectTo); }
			
			if (next.templateUrl == '/rosterweb/views/login/detail.html') { return; }
			if (next.templateUrl == '/rosterweb/views/login/notregistered.html') { return; }

			//console.log('[RosterWebApp.run().$rootScope.$on("$routeChangeStart")] $cookieStore.get(\'is_registered\') = ' + $cookieStore.get('is_registered'));
            if ($cookieStore.get('is_registered') != 'true') 
			{
				//console.log('[RosterWebApp.run().$rootScope.$on("$routeChangeStart")] Going to:  $location.url(\'/login/\')');
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
					//console.log('[RosterWebApp.run().$rootScope.$on("$routeChangeStart")] $rootScope.currentUser.organizationId = ' + $rootScope.currentUser.organizationId);
					$rootScope.currentTurtleId = $cookieStore.get('rootScopeCurrentTurtleId');
					$rootScope.currentTankId = $cookieStore.get('rootScopeCurrentTankId');
					recordCountService.resetAll();
				}
			}
        });
	});
