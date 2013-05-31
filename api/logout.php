<?php
	require_once('util.php');
	session_start(); 

	utilLog('[logout.php] In logout.php...');

	//--------------------------------------------------------------------------------
	//-- unset all of the session variables
	//--------------------------------------------------------------------------------
	$_SESSION = array();

	//--------------------------------------------------------------------------------
	//-- delete the session cookies
	//--------------------------------------------------------------------------------
	//-- Note: This will destroy the session, and not just the session data!
	//--------------------------------------------------------------------------------
	if (ini_get("session.use_cookies")) {
		$params = session_get_cookie_params();
		setcookie(session_name(), '', time() - 42000,
			$params["path"], $params["domain"],
			$params["secure"], $params["httponly"]
		);
	}

	//--------------------------------------------------------------------------------
	//-- delete the client cookies
	//--------------------------------------------------------------------------------
	setcookie('user_id', '', time() - 42000, '/');
	setcookie('is_logged_in', '', time() - 42000, '/');
					
	//--------------------------------------------------------------------------------
	//-- finally, destroy the session
	//--------------------------------------------------------------------------------
	session_destroy();
?>