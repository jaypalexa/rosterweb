<?php
	header('Content-Type: application/json');
	require_once('util.php');
	require_once('db.php');
	session_start(); 
	if (!utilIsSessionValid()) { header('Location: /rosterweb/'); exit(0); }

	utilLog('[user.php] In user.php...');

	function fillItem($row)
	{
		$item['user_id'] = $row['user_id'];
		$item['user_name'] = $row['user_name'];
		$item['user_email'] = $row['user_email'];
		$item['organization_id'] = $row['organization_id'];
		$item['is_admin'] = dbYNtoBoolean($row['is_admin']);
		$item['last_login'] = $row['last_login'];
		$item['organization_name'] = $row['organization_name'];
		$item['preferred_units_type'] = $row['preferred_units_type'];
		
		return $item;
	}
	
	//--------------------------------------------------------------------------------
	//-- get HTTP request stuff
	//--------------------------------------------------------------------------------
	$verb = strtoupper($_SERVER['REQUEST_METHOD']);
	utilLog('[user.php] $verb = ' . $verb);
	$parameters = utilParseHttpParameters();
	
	//--------------------------------------------------------------------------------
	//-- GET /api/user.php?desc=false&limit=20&offset=0&q=undefined&sort=user_name
	//-- GET /api/user.php?user_id=bdeb0af9-ea19-4b8e-853a-106108e4a14d
	//--------------------------------------------------------------------------------
	if ($verb == 'GET') 
	{
		$items = array();
		
		//--------------------------------------------------------------------------------
		//-- if there is no "user_id" or "user_email" query string parameter, 
		//-- then this HTTP GET should return ALL items
		//--------------------------------------------------------------------------------
		if (!array_key_exists('user_id', $parameters) && !array_key_exists('user_email', $parameters))
		{
			$sql = 'SELECT u.*, o.organization_name FROM user u LEFT JOIN organization o ON u.organization_id = o.organization_id ';

			if (array_key_exists('q', $parameters) && ($parameters['q'] != 'undefined'))
			{
				$sql .= 'WHERE user_name LIKE :search_user_name ';
			}

			$sql .= 'ORDER BY %sort_column% %sort_order%';
			
			$sql = str_replace('%sort_column%', $parameters['sort'], $sql);

			if ($parameters['desc'] == 'true')
			{
				$sql = str_replace('%sort_order%', 'DESC', $sql);
			}
			else
			{
				$sql = str_replace('%sort_order%', 'ASC', $sql);
			}
			
			$stmt = $db->prepare($sql);
			if (array_key_exists('q', $parameters) && ($parameters['q'] != 'undefined'))
			{
				$stmt->bindValue(':search_user_name', '%' . $parameters['q'] .'%');
			}
			$stmt->execute();
 
			while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) 
			{
				$items[] = fillItem($row);
			}

			echo json_encode($items);
		}
		//--------------------------------------------------------------------------------
		//-- else, there is an "user_id" query string parameter, 
		//-- so this HTTP GET should return the indicated item
		//--------------------------------------------------------------------------------
		else
		{
			$sql = 'SELECT u.*, o.organization_name, o.preferred_units_type FROM user u LEFT JOIN organization o ON u.organization_id = o.organization_id ';
			if (array_key_exists('user_id', $parameters))
			{
				$sql .= 'WHERE user_id = :user_id';
			}
			else if (array_key_exists('user_email', $parameters))
			{
				$sql .= 'WHERE user_email = :user_email';
			}
			
			$stmt = $db->prepare($sql);
			
			if (array_key_exists('user_id', $parameters))
			{
				$stmt->bindValue(':user_id', $parameters['user_id']);
			}
			else if (array_key_exists('user_email', $parameters))
			{
				$stmt->bindValue(':user_email', $parameters['user_email']);
			}

			$stmt->execute();

			if ($row = $stmt->fetch(PDO::FETCH_ASSOC)) 
			{
				echo json_encode(fillItem($row));
			}
		}
	}
	else if (($verb == 'PUT') || ($verb == 'POST'))
	{
		$sql = '';

		if ($verb == 'PUT')
		{
			$sql .= 'UPDATE user SET ';
			$sql .= 'user_name = :user_name, ';
			$sql .= 'user_email = :user_email, ';
			$sql .= 'organization_id = :organization_id, ';
			$sql .= 'is_admin = :is_admin, ';
			$sql .= 'last_login = :last_login ';
			$sql .= 'WHERE user_id = :user_id';
		}
		else if ($verb == 'POST')
		{
			$sql .= 'INSERT INTO user (';
			$sql .= 'user_id, user_name, user_email, organization_id, is_admin, last_login ';
			$sql .= ') VALUES (';
			$sql .= ':user_id, :user_name, :user_email, :organization_id, :is_admin, :last_login ';
			$sql .= ') ';
		}
		$stmt = $db->prepare($sql);
		
		$stmt->bindValue(':user_id', dbGetParameterValue($parameters, 'user_id'));
		$stmt->bindValue(':user_name', dbGetParameterValue($parameters, 'user_name'));
		$stmt->bindValue(':user_email', dbGetParameterValue($parameters, 'user_email'));
		$stmt->bindValue(':organization_id', dbGetParameterValue($parameters, 'organization_id'));
		$stmt->bindValue(':is_admin', dbGetParameterBoolean($parameters, 'is_admin'));
		$stmt->bindValue(':last_login', dbGetParameterDate($parameters, 'last_login'));

		$stmt->execute();
	}
	else if ($verb == 'DELETE')
	{
		$sql = 'DELETE FROM user WHERE user_id = :user_id';
		$stmt = $db->prepare($sql);
		$stmt->bindValue(':user_id', $parameters['user_id']);
		$stmt->execute();
	}

?>