RosterWebApp.factory('County', function($resource) {
    return $resource('/rosterweb/api/county.php', {}, { 'update': { method: 'PUT' } });
});

RosterWebApp.factory('HatchlingsEvent', function($resource) {
    return $resource('/rosterweb/api/hatchlings_event.php', {}, { 'update': { method: 'PUT' } });
});

RosterWebApp.factory('HatchlingsAcquiredEvent', function($resource) {
    return $resource('/rosterweb/api/hatchlings_acquired_event.php', {}, { 'update': { method: 'PUT' } });
});

RosterWebApp.factory('HatchlingsDiedEvent', function($resource) {
    return $resource('/rosterweb/api/hatchlings_died_event.php', {}, { 'update': { method: 'PUT' } });
});

RosterWebApp.factory('HatchlingsDoaEvent', function($resource) {
    return $resource('/rosterweb/api/hatchlings_doa_event.php', {}, { 'update': { method: 'PUT' } });
});

RosterWebApp.factory('HatchlingsReleasedEvent', function($resource) {
    return $resource('/rosterweb/api/hatchlings_released_event.php', {}, { 'update': { method: 'PUT' } });
});

RosterWebApp.factory('Organization', function($resource) {
    return $resource('/rosterweb/api/organization.php', {}, { 'update': { method: 'PUT' } });
});

RosterWebApp.factory('OrganizationListItem', function($resource) {
    return $resource('/rosterweb/api/organization_listitem.php', {}, { 'update': { method: 'PUT' } });
});

RosterWebApp.factory('RecordCount', function($resource) {
    return $resource('/rosterweb/api/record_count.php', {}, { 'update': { method: 'PUT' } });
});

RosterWebApp.factory('Tank', function($resource) {
    return $resource('/rosterweb/api/tank.php', {}, { 'update': { method: 'PUT' } });
});

RosterWebApp.factory('TankWater', function($resource) {
    return $resource('/rosterweb/api/tank_water.php', {}, { 'update': { method: 'PUT' } });
});

RosterWebApp.factory('Turtle', function($resource) {
    return $resource('/rosterweb/api/turtle.php', {}, { 'update': { method: 'PUT' } });
});

RosterWebApp.factory('TurtleMorphometric', function($resource) {
    return $resource('/rosterweb/api/turtle_morphometric.php', {}, { 'update': { method: 'PUT' } });
});

RosterWebApp.factory('TurtleTag', function($resource) {
    return $resource('/rosterweb/api/turtle_tag.php', {}, { 'update': { method: 'PUT' } });
});

RosterWebApp.factory('User', function($resource) {
    return $resource('/rosterweb/api/user.php', {}, { 'update': { method: 'PUT' } });
});

RosterWebApp.factory('WashbacksEvent', function($resource) {
    return $resource('/rosterweb/api/washbacks_event.php', {}, { 'update': { method: 'PUT' } });
});

RosterWebApp.factory('WashbacksAcquiredEvent', function($resource) {
    return $resource('/rosterweb/api/washbacks_acquired_event.php', {}, { 'update': { method: 'PUT' } });
});

RosterWebApp.factory('WashbacksDiedEvent', function($resource) {
    return $resource('/rosterweb/api/washbacks_died_event.php', {}, { 'update': { method: 'PUT' } });
});

RosterWebApp.factory('WashbacksDoaEvent', function($resource) {
    return $resource('/rosterweb/api/washbacks_doa_event.php', {}, { 'update': { method: 'PUT' } });
});

RosterWebApp.factory('WashbacksReleasedEvent', function($resource) {
    return $resource('/rosterweb/api/washbacks_released_event.php', {}, { 'update': { method: 'PUT' } });
});
