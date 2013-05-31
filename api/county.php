<?php
	header('Content-Type: application/json');
	require_once('util.php');
	require_once('db.php');
	session_start(); 
	if (!utilIsSessionValid()) { header('Location: /rosterweb/'); exit(0); }
	
	function fillItem($row)
	{
		$item['county_id'] = $row['county_id'];
		$item['county_name'] = $row['county_name'];
		
		return $item;
	}
	
	//--------------------------------------------------------------------------------
	//-- get HTTP request stuff
	//--------------------------------------------------------------------------------
	$verb = strtoupper($_SERVER['REQUEST_METHOD']);
	utilLog('[county.php] $verb = ' . $verb);
	$parameters = utilParseHttpParameters();
	
	//--------------------------------------------------------------------------------
	//-- GET /api/county.php?desc=false&limit=20&offset=0&q=undefined&sort=county_name
	//-- GET /api/county.php?county_id=bdeb0af9-ea19-4b8e-853a-106108e4a14d
	//--------------------------------------------------------------------------------
	if ($verb == 'GET') 
	{
		$items = array();
		
		//--------------------------------------------------------------------------------
		//-- if there is no "county_id" query string parameter, 
		//-- then this HTTP GET should return ALL items
		//--------------------------------------------------------------------------------
		if (!array_key_exists('county_id', $parameters))
		{
			$sql = 'SELECT * FROM county ';
			
			if (isset($parameters['q']) && ($parameters['q'] != 'undefined'))
			{
				$sql .= 'WHERE county_name LIKE :search_county_name ';
			}
			
			$sql .= 'ORDER BY %sort_column% %sort_order%';
			
			$sql = str_replace('%sort_column%', $parameters['sort'], $sql);

			if (isset($parameters['desc']) && ($parameters['desc'] == 'true'))
			{
				$sql = str_replace('%sort_order%', 'DESC', $sql);
			}
			else
			{
				$sql = str_replace('%sort_order%', 'ASC', $sql);
			}
			
			$stmt = $db->prepare($sql);
			if (isset($parameters['q']) && ($parameters['q'] != 'undefined'))
			{
				$stmt->bindValue(':search_county_name', '%' . $parameters['q'] .'%');
			}
			$stmt->execute();
 
			while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) 
			{
				$items[] = fillItem($row);
			}

			echo json_encode($items);
		}
		//--------------------------------------------------------------------------------
		//-- else, there is an "county_id" query string parameter, 
		//-- so this HTTP GET should return the indicated item
		//--------------------------------------------------------------------------------
		else
		{
			$sql = 'SELECT * FROM county WHERE county_id = :county_id';
			$stmt = $db->prepare($sql);
			$stmt->bindValue(':county_id', $parameters['county_id']);
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
		$county_id = '';
		if ($verb == 'PUT')
		{
			$sql .= 'UPDATE county SET ';
			$sql .= 'county_name = :county_name ';
			$sql .= 'WHERE county_id = :county_id';
			
			$county_id = $parameters['county_id'];
		}
		else if ($verb == 'POST')
		{
			$sql .= 'INSERT INTO county ';
			$sql .= '(county_id, county_name) ';
			$sql .= 'VALUES ';
			$sql .= '(:county_id, :county_name) ';
			
			$county_id = utilCreateGuid();
		}
		$stmt = $db->prepare($sql);
		
		$stmt->bindValue(':county_id', $county_id);
		$stmt->bindValue(':county_name', dbGetParameterValue($parameters, 'county_name'));

		$stmt->execute();
	}
	else if ($verb == 'DELETE')
	{
		$sql = 'DELETE FROM county WHERE county_id = :county_id';
		$stmt = $db->prepare($sql);
		$stmt->bindValue(':county_id', $parameters['county_id']);
		$stmt->execute();
	}

?>