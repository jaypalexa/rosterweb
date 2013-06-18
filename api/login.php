<?php
	require_once('util.php');
	require_once('db.php');
	require_once('lightopenid.php');
	session_start(); 

	// // Allow from any origin
    // if (isset($_SERVER['HTTP_ORIGIN'])) {
        // header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
        // header('Access-Control-Allow-Credentials: true');
        // header('Access-Control-Max-Age: 86400');    // cache for 1 day
    // }
    // // Access-Control headers are received during OPTIONS requests
    // if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {

        // if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD']))
            // header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");         

        // if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']))
            // header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");

    // }
	
	utilLog('[login.php] In doLogin()...');
	//var_dump('[login.php] In doLogin()...');
	//--------------------------------------------------------------------------------
	//-- if GET request does not have an OpenID identifier url in the querystring, 
	//-- then just exit; this should cause a return to the login page
	//--------------------------------------------------------------------------------
	if (empty($_GET['openid_identifier'])) {
		$error = "Expected an OpenID URL.";
		utilLog('[login.php] $error = ' . $error);
		exit(0);
	}

	utilLog('[login.php] $_GET[\'openid_identifier\'] = ' . $_GET['openid_identifier']);
	$openid_identifier = $_GET['openid_identifier'];
	
	if ($openid_identifier == 'guest')
	{
		utilLog('[login.php] Logging in via guest...');
		header('HTTP/1.1 201 Created', true, 201); //!!!IMPORTANT!!!
		//--------------------------------------------------------------------------------
		//-- set PHP session variables for use in subsequent resource requests
		//--------------------------------------------------------------------------------
		$_SESSION['is_logged_in'] = 'true';
		$_SESSION['fingerprint'] = utilGetFingerprint();
		
		//--------------------------------------------------------------------------------
		//-- redirect to front page
		//--------------------------------------------------------------------------------
		header('Location: /rosterweb/#/turtle');

		//--------------------------------------------------------------------------------
		//-- set cookies that expire in one hour for the entire domain
		//--------------------------------------------------------------------------------
		setcookie('user_id', 'guest@guest.com', time()+3600*1, '/');
		setcookie('is_logged_in', 'true', time()+3600*1, '/');
			
		exit();
	}

	//--------------------------------------------------------------------------------
	//-- instantiate a LightOpenID object
	//--------------------------------------------------------------------------------
	//-- change 'localhost' to your domain name..."do NOT use $_SERVER['HTTP_HOST'] for that unless you know what you are doing."
	//--------------------------------------------------------------------------------
	//$openid = new LightOpenID('localhost');
	utilLog('[login.php] Calling new LightOpenID($_SERVER[\'HTTP_HOST\']); $_SERVER[\'HTTP_HOST\'] = ' . $_SERVER['HTTP_HOST']);
	$openid = new LightOpenID($_SERVER['HTTP_HOST']);
	 
	utilLog('[login.php] $openid->mode = ' . $openid->mode);
	//--------------------------------------------------------------------------------
	//-- mode == '', so we are starting afresh; do discovery (via authUrl()) and redirect browsr
	//--------------------------------------------------------------------------------
	if (!$openid->mode)
	{
		//--------------------------------------------------------------------------------
		//-- the "identity" is the URL used by the OpenID provider to do the authentication
		//--------------------------------------------------------------------------------
		$openid->identity = $openid_identifier;
		 
		//--------------------------------------------------------------------------------
		//-- get additional account information about the user:  email address
		//--------------------------------------------------------------------------------
		$openid->required = array('contact/email'); 
		// $openid->required = array('contact/country/home'); 
		// $openid->required = array('namePerson/friendly'); 
		// $openid->required = array('namePerson/first'); 
		// $openid->required = array('namePerson/last'); 
		// $openid->required = array('pref/language'); 
		 
		//--------------------------------------------------------------------------------
		//-- for AngularJS, we MUST override the HTTP response code;  
		//-- otherwise, the 302 redirect code will be interpreted as an error...ugh...
		//-- needs to be 201 since PHP will ignore any other code and send 302 when Location is set below...
		//--------------------------------------------------------------------------------
		//http_response_code(201);
		header('HTTP/1.1 201 Created', true, 201); //!!!IMPORTANT!!!
		
		//--------------------------------------------------------------------------------
		//-- "discover" the OpenID provider and redirect browser to the authenticating URL
		//--------------------------------------------------------------------------------
		header('Location: ' . $openid->authUrl());

		echo($openid->authUrl()); //!!!IMPORTANT!!!
	}
	else if ($openid->mode == 'cancel')
	{
		echo 'User has canceled authentication!';
		//-- just fall through...back to login page...
	}
	else
	{
		//--------------------------------------------------------------------------------
		//-- mode == 'id_res', so validate the authentication
		//--------------------------------------------------------------------------------
		//-- (calls "check_authentication" which will "Ask an Identity Provider if a message is valid.")
		//--------------------------------------------------------------------------------
		utilLog('[login.php] Calling $openid->validate()...');
		if ($openid->validate())
		{
			utilLog('[login.php] User is authenticated and validated...');
			
			//--------------------------------------------------------------------------------
			//-- retrieve the extra requested Open ID attributes
			//--------------------------------------------------------------------------------
			$openIdAttributes = $openid->getAttributes();
			$contactEmail = $openIdAttributes['contact/email'];

			//--------------------------------------------------------------------------------
			//-- update the last login date for this user
			//--------------------------------------------------------------------------------
			$sql = 'UPDATE user SET ';
			$sql .= 'last_login = NOW() ';
			$sql .= 'WHERE user_email = :user_email';
			
			$stmt = $db->prepare($sql);
			$stmt->bindValue(':user_email', $contactEmail);
			$stmt->execute();
			
			//--------------------------------------------------------------------------------
			//-- set PHP session variables for use in subsequent resource requests
			//--------------------------------------------------------------------------------
			$_SESSION['is_logged_in'] = 'true';
			$_SESSION['fingerprint'] = utilGetFingerprint();
			
			//--------------------------------------------------------------------------------
			//-- redirect to front page
			//--------------------------------------------------------------------------------
			header('Location: /rosterweb/');

			//--------------------------------------------------------------------------------
			//-- set cookies that expire in one hour for the entire domain
			//--------------------------------------------------------------------------------
			setcookie('user_id', $contactEmail, time()+3600*1, '/');
			setcookie('is_logged_in', 'true', time()+3600*1, '/');
			
			exit();
		}
		else
		{
			utilLog('[login.php] User is NOT logged in...');
			//--------------------------------------------------------------------------------
			//-- validation (check_authentication) failed, so clear all user login settings
			//--------------------------------------------------------------------------------
			$_SESSION = array();
			setcookie('user_id', '', time() - 42000, '/');
			setcookie('is_logged_in', '', time() - 42000, '/');
		}
	}

?>