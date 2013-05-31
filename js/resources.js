RosterWebApp.factory('County', function($resource) {
    return $resource('/rosterweb/api/county.php', {}, { 'update': { method: 'PUT' } });
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
