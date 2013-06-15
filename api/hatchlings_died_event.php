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
	utilLog('[hatchlings_died_event.php] $verb = ' . $verb);
	$parameters = utilParseHttpParameters();
	
	//--------------------------------------------------------------------------------
	//-- GET /api/hatchlings_died_event.php?desc=false&limit=20&offset=0&q=undefined&sort=hatchlings_died_event_name
	//-- GET /api/hatchlings_died_event.php?hatchlings_died_event_id=bdeb0af9-ea19-4b8e-853a-106108e4a14d
	//--------------------------------------------------------------------------------
	if ($verb == 'GET') 
	{
		$sql = 'SELECT * FROM hatchlings_died_event WHERE hatchlings_died_event_id = :hatchlings_died_event_id';
		$stmt = $db->prepare($sql);
		$stmt->bindValue(':hatchlings_died_event_id', $parameters['hatchlings_died_event_id']);
		$stmt->execute();

		if ($row = $stmt->fetch(PDO::FETCH_ASSOC)) 
		{
			$item['hatchlings_died_event_id'] = $row['hatchlings_died_event_id'];
			$item['organization_id'] = $row['organization_id'];
			$item['species_code'] = $row['species_code'];
			$item['event_date'] = dbDateOnly($row['event_date']);
			$item['event_count'] = dbIntOrNull($row['event_count']);
			
			//-- fields to support a consolidated hatchlings event concept
			$item['hatchlings_event_id'] = $row['hatchlings_died_event_id'];
			$item['event_type'] = 'Died';
			$item['event_type_code'] = 'died';

			echo json_encode($item);
		}
	}
	else if (($verb == 'PUT') || ($verb == 'POST'))
	{
		$sql = '';

		if ($verb == 'PUT')
		{
			$sql .= 'UPDATE hatchlings_died_event SET ';
			$sql .= 'organization_id = :organization_id, ';
			$sql .= 'species_code = :species_code, ';
			$sql .= 'event_date = :event_date, ';
			$sql .= 'event_count = :event_count ';
			$sql .= 'WHERE hatchlings_died_event_id = :hatchlings_died_event_id';
		}
		else if ($verb == 'POST')
		{
			$sql .= 'INSERT INTO hatchlings_died_event ';
			$sql .= '(hatchlings_died_event_id, organization_id, species_code, event_date, event_count) ';
			$sql .= 'VALUES ';
			$sql .= '(:hatchlings_died_event_id, :organization_id, :species_code, :event_date, :event_count) ';
		}
		$stmt = $db->prepare($sql);
		
		$stmt->bindValue(':hatchlings_died_event_id', dbGetParameterValue($parameters, 'hatchlings_died_event_id'));
		$stmt->bindValue(':organization_id', dbGetParameterValue($parameters, 'organization_id'));
		$stmt->bindValue(':species_code', dbGetParameterValue($parameters, 'species_code'));
		$stmt->bindValue(':event_date', dbGetParameterDate($parameters, 'event_date'));
		$stmt->bindValue(':event_count', dbGetParameterValue($parameters, 'event_count'));

		$stmt->execute();
	}
	else if ($verb == 'DELETE')
	{
		$sql = 'DELETE FROM hatchlings_died_event WHERE hatchlings_died_event_id = :hatchlings_died_event_id';
		$stmt = $db->prepare($sql);
		$stmt->bindValue(':hatchlings_died_event_id', $parameters['hatchlings_died_event_id']);
		$stmt->execute();
	}

?>