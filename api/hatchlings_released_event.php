<?php
	header('Content-Type: application/json');
	require_once('util.php');
	require_once('db.php');
	session_start(); 
	if (!utilIsSessionValid()) { header('Location: /rosterweb/'); exit(0); }
	
	//--------------------------------------------------------------------------------
	//-- get HTTP request stuff
	//--------------------------------------------------------------------------------
	$verb = strtoupper($_SERVER['REQUEST_METHOD']);
	utilLog('[hatchlings_released_event.php] $verb = ' . $verb);
	$parameters = utilParseHttpParameters();
	
	//--------------------------------------------------------------------------------
	//-- GET /api/hatchlings_released_event.php?desc=false&limit=20&offset=0&q=undefined&sort=hatchlings_released_event_name
	//-- GET /api/hatchlings_released_event.php?hatchlings_released_event_id=bdeb0af9-ea19-4b8e-853a-106108e4a14d
	//--------------------------------------------------------------------------------
	if ($verb == 'GET') 
	{
		$sql = 'SELECT * FROM hatchlings_released_event WHERE hatchlings_released_event_id = :hatchlings_released_event_id';
		$stmt = $db->prepare($sql);
		$stmt->bindValue(':hatchlings_released_event_id', $parameters['hatchlings_released_event_id']);
		$stmt->execute();

		if ($row = $stmt->fetch(PDO::FETCH_ASSOC)) 
		{
			$item['hatchlings_released_event_id'] = $row['hatchlings_released_event_id'];
			$item['organization_id'] = $row['organization_id'];
			$item['species_code'] = $row['species_code'];
			$item['event_date'] = dbDateOnly($row['event_date']);
			$item['beach_event_count'] = dbIntOrNull($row['beach_event_count']);
			$item['offshore_event_count'] = dbIntOrNull($row['offshore_event_count']);
			
			//-- fields to support a consolidated hatchlings event concept
			$item['hatchlings_event_id'] = $row['hatchlings_released_event_id'];
			$item['event_type'] = 'Released';
			$item['event_type_code'] = 'released';

			echo json_encode($item);
		}
	}
	else if (($verb == 'PUT') || ($verb == 'POST'))
	{
		$sql = '';

		if ($verb == 'PUT')
		{
			$sql .= 'UPDATE hatchlings_released_event SET ';
			$sql .= 'organization_id = :organization_id, ';
			$sql .= 'species_code = :species_code, ';
			$sql .= 'event_date = :event_date, ';
			$sql .= 'beach_event_count = :beach_event_count, ';
			$sql .= 'offshore_event_count = :offshore_event_count ';
			$sql .= 'WHERE hatchlings_released_event_id = :hatchlings_released_event_id';
		}
		else if ($verb == 'POST')
		{
			$sql .= 'INSERT INTO hatchlings_released_event ';
			$sql .= '(hatchlings_released_event_id, organization_id, species_code, event_date, beach_event_count, offshore_event_count) ';
			$sql .= 'VALUES ';
			$sql .= '(:hatchlings_released_event_id, :organization_id, :species_code, :event_date, :beach_event_count, :offshore_event_count) ';
		}
		$stmt = $db->prepare($sql);
		
		$stmt->bindValue(':hatchlings_released_event_id', dbGetParameterValue($parameters, 'hatchlings_released_event_id'));
		$stmt->bindValue(':organization_id', dbGetParameterValue($parameters, 'organization_id'));
		$stmt->bindValue(':species_code', dbGetParameterValue($parameters, 'species_code'));
		$stmt->bindValue(':event_date', dbGetParameterDate($parameters, 'event_date'));
		$stmt->bindValue(':beach_event_count', dbGetParameterValue($parameters, 'beach_event_count'));
		$stmt->bindValue(':offshore_event_count', dbGetParameterValue($parameters, 'offshore_event_count'));

		$stmt->execute();
	}
	else if ($verb == 'DELETE')
	{
		$sql = 'DELETE FROM hatchlings_released_event WHERE hatchlings_released_event_id = :hatchlings_released_event_id';
		$stmt = $db->prepare($sql);
		$stmt->bindValue(':hatchlings_released_event_id', $parameters['hatchlings_released_event_id']);
		$stmt->execute();
	}

?>