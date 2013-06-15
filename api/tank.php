<?php
	header('Content-Type: application/json');
	require_once('util.php');
	require_once('db.php');
	session_start(); 
	if (!utilIsSessionValid()) { header('Location: /rosterweb/'); exit(0); }
	
	function fillItem($row)
	{
		$item['tank_id'] = $row['tank_id'];
		$item['organization_id'] = $row['organization_id'];
		$item['tank_name'] = $row['tank_name'];
		
		return $item;
	}
	
	//--------------------------------------------------------------------------------
	//-- get HTTP request stuff
	//--------------------------------------------------------------------------------
	$verb = strtoupper($_SERVER['REQUEST_METHOD']);
	utilLog('[tank.php] $verb = ' . $verb);
	$parameters = utilParseHttpParameters();
	
	//--------------------------------------------------------------------------------
	//-- GET /api/tank.php?desc=false&limit=20&offset=0&q=undefined&sort=tank_name
	//-- GET /api/tank.php?tank_id=bdeb0af9-ea19-4b8e-853a-106108e4a14d
	//--------------------------------------------------------------------------------
	if ($verb == 'GET') 
	{
		$items = array();
		
		//--------------------------------------------------------------------------------
		//-- if there is no "tank_id" query string parameter, 
		//-- then this HTTP GET should return ALL items
		//--------------------------------------------------------------------------------
		if (!array_key_exists('tank_id', $parameters))
		{
			$sql = 'SELECT * FROM tank ';
			$sql .= 'WHERE organization_id = :organization_id ';
			
			if ($parameters['q'] != 'undefined')
			{
				$sql .= 'AND tank_name LIKE :search_tank_name ';
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
			$stmt->bindValue(':organization_id', $parameters['organization_id']);
			if ($parameters['q'] != 'undefined')
			{
				$stmt->bindValue(':search_tank_name', '%' . $parameters['q'] .'%');
			}
			$stmt->execute();
 
			while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) 
			{
				$items[] = fillItem($row);
			}

			echo json_encode($items);
		}
		//--------------------------------------------------------------------------------
		//-- else, there is an "tank_id" query string parameter, 
		//-- so this HTTP GET should return the indicated item
		//--------------------------------------------------------------------------------
		else
		{
			$sql = 'SELECT * FROM tank WHERE tank_id = :tank_id';
			$stmt = $db->prepare($sql);
			$stmt->bindValue(':tank_id', $parameters['tank_id']);
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
			$sql .= 'UPDATE tank SET ';
			$sql .= 'organization_id = :organization_id, ';
			$sql .= 'tank_name = :tank_name ';
			$sql .= 'WHERE tank_id = :tank_id';
		}
		else if ($verb == 'POST')
		{
			$sql .= 'INSERT INTO tank ';
			$sql .= '(tank_id, organization_id, tank_name) ';
			$sql .= 'VALUES ';
			$sql .= '(:tank_id, :organization_id, :tank_name) ';
		}
		$stmt = $db->prepare($sql);
		
		$stmt->bindValue(':tank_id', dbGetParameterValue($parameters, 'tank_id'));
		$stmt->bindValue(':organization_id', dbGetParameterValue($parameters, 'organization_id'));
		$stmt->bindValue(':tank_name', dbGetParameterValue($parameters, 'tank_name'));

		$stmt->execute();
	}
	else if ($verb == 'DELETE')
	{
		$sql = 'DELETE FROM tank WHERE tank_id = :tank_id';
		$stmt = $db->prepare($sql);
		$stmt->bindValue(':tank_id', $parameters['tank_id']);
		$stmt->execute();
	}

?>