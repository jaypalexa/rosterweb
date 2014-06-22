<!DOCTYPE html>
<html ng-app="RosterWebApp" xmlns="http://www.w3.org/1999/xhtml">
<head>
    <title>RosterWeb</title>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<link rel="shortcut icon" href="/rosterweb/favicon.ico">
	
	<!-- stylesheets -->
	<link rel="stylesheet" type="text/css" href="/rosterweb/styles/bootstrap.min.css" />
	<link rel="stylesheet" type="text/css" href="/rosterweb/styles/bootstrap-combined.min.css" />
	<link rel="stylesheet" type="text/css" href="/rosterweb/styles/bootstrap-responsive.min.css" />
	<link rel="stylesheet" type="text/css" href="/rosterweb/styles/bootstrap-datepicker.css" />
	<link rel="stylesheet" type="text/css" href="/rosterweb/styles/openid.css" />
	<link rel="stylesheet" type="text/css" href="/rosterweb/styles/dropzone.css" />
	<link rel="stylesheet" type="text/css" href="/rosterweb/styles/rosterweb.css" />

	<!-- third-party libraries -->
	<script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?v=3.exp&sensor=false"></script>
	<script type="text/javascript" src="/rosterweb/js/lib/jquery/jquery-1.9.1.min.js"></script>
	<script type="text/javascript" src="/rosterweb/js/lib/angular/angular.min.js"></script>
	<script type="text/javascript" src="/rosterweb/js/lib/angular/angular-resource.js"></script>
	<script type="text/javascript" src="/rosterweb/js/lib/angular/angular-cookies.js"></script>
	<script type="text/javascript" src="/rosterweb/js/lib/ui-bootstrap/ui-bootstrap-tpls-0.11.0.min.js"></script>
	<script type="text/javascript" src="/rosterweb/js/lib/polyfills/number-polyfill.js"></script>
	<script type="text/javascript" src="/rosterweb/js/lib/angular-strap/angular-strap-0.7.5.min.js"></script>
	<script type="text/javascript" src="/rosterweb/js/lib/bootstrap-datepicker/bootstrap-datepicker.js"></script>
	<script type="text/javascript" src="/rosterweb/js/lib/bootstrap-tooltip/bootstrap-tooltip.js"></script>
	<script type="text/javascript" src="/rosterweb/js/lib/bootstrap/js/bootstrap.min.js"></script>
	<script type="text/javascript" src="/rosterweb/js/lib/jquery/jquery-cookie.js"></script>
	<script type="text/javascript" src="/rosterweb/js/lib/jquery/jquery.ui.widget.js"></script>
	<script type="text/javascript" src="/rosterweb/js/lib/jquery/jquery.iframe-transport.js"></script>
	<script type="text/javascript" src="/rosterweb/js/lib/jquery/jquery.fileupload.js"></script>
	<script type="text/javascript" src="/rosterweb/js/lib/d3/d3.min.js"></script>
	<script type="text/javascript" src="/rosterweb/js/lib/dropzone/dropzone.js"></script>
	
    <!-- app-specific scripts -->
	<script type="text/javascript" src="/rosterweb/js/app.js"></script>
	<script type="text/javascript" src="/rosterweb/js/util.js"></script>
	<script type="text/javascript" src="/rosterweb/js/controllers.js"></script>
	<script type="text/javascript" src="/rosterweb/js/directives.js"></script>
	<script type="text/javascript" src="/rosterweb/js/resources.js"></script>
	<script type="text/javascript" src="/rosterweb/js/services.js"></script>
</head>
<body ng-controller="MainCtrl">
	<h1 style="text-align: center; margin-bottom: 0px;"><a href='#/turtle' style='text-decoration: none'>RosterWeb</a></h1>
	<div style="text-align: center; font-size: small; margin-bottom: 6px;"><a href='http://www.turtlegeek.com'>TurtleGeek.com</a></div>
	<div style="text-align: center; font-size: small; margin-bottom: 6px;" ng-hide="$root.currentUser.isLoggedIn">Not logged in</div>
	<div style="text-align: center; font-size: small; margin-bottom: 6px;" ng-show="$root.currentUser.isLoggedIn">Logged in as:  <span style="font-weight: bold;">{{ $root.currentUser.userName }}</span>&nbsp;&nbsp;<a href='#/logout/'>(log out)</a></div>
	<div style="text-align: center; font-size: small; margin-bottom: 6px; height: 24px; line-height: 24px;" ng-show="$root.currentUser.isAdmin">Organization:  <select id="root_organization_id" name="root_organization_id" ng-model="$root.currentUser.organizationId" ng-change="organizationChanged();" ng-options="o.organization_id as o.organization_name for o in $root.organizations | orderBy: 'organization_name'" style="height: 24px; margin-top: -3px; margin-bottom: 0px; font-size: small; padding: 0px;"></select>&nbsp;&nbsp;<a href="#/organization/edit/{{$root.currentUser.organizationId}}" bs-tooltip="'Edit organization information, hatchling and washback starting balances, and preferences'">(edit)</a></div>
	<div style="text-align: center; font-size: small; margin-bottom: 6px;" ng-show="$root.currentUser.isLoggedIn && !$root.currentUser.isAdmin">Organization:  <span style="font-weight: bold;">{{ $root.currentUser.organizationName }}</span>&nbsp;&nbsp;<a href="#/organization/edit/{{$root.currentUser.organizationId}}" bs-tooltip="'Edit organization information, hatchling and washback starting balances, and preferences'">(edit)</a></div>
	<hr />
	<div style="text-align: center; font-size: larger; font-weight: 650; margin-bottom: 12px;">
		<span ng-show="$root.currentUser.isLoggedIn"><a href='#/turtle'>Sea Turtles ({{ $root.recordCounts.turtleCount }})</a>&nbsp;&nbsp;|&nbsp;&nbsp;</span>
		<span ng-show="$root.currentUser.isLoggedIn"><a href='#/tank'>Holding Tanks ({{ $root.recordCounts.tankCount }})</a>&nbsp;&nbsp;|&nbsp;&nbsp;</span>
		<span ng-show="$root.currentUser.isLoggedIn"><a href='#/hatchlings_event'>Hatchlings ({{ $root.recordCounts.hatchlingCount }})</a>&nbsp;&nbsp;|&nbsp;&nbsp;</span>
		<span ng-show="$root.currentUser.isLoggedIn"><a href='#/washbacks_event'>Washbacks ({{ $root.recordCounts.washbackCount }})</a></span>
		<span ng-show="$root.currentUser.isAdmin">&nbsp;&nbsp;|&nbsp;&nbsp;<a href='#/organization'>Organizations ({{ $root.recordCounts.organizationCount }})</a>&nbsp;&nbsp;|&nbsp;&nbsp;</span>
		<span ng-show="$root.currentUser.isAdmin"><a href='#/county'>Counties ({{ $root.recordCounts.countyCount }})</a>&nbsp;&nbsp;|&nbsp;&nbsp;</span>
		<span ng-show="$root.currentUser.isAdmin"><a href='#/user'>Users ({{ $root.recordCounts.userCount }})</a></span>
	</div>
	<div class="container">
		<div ng-view></div>
	</div>
</body>
</html>