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
	utilLog('[hatchlings_acquired_event.php] $verb = ' . $verb);
	$parameters = utilParseHttpParameters();
	
	//--------------------------------------------------------------------------------
	//-- GET /api/hatchlings_acquired_event.php?desc=false&limit=20&offset=0&q=undefined&sort=hatchlings_acquired_event_name
	//-- GET /api/hatchlings_acquired_event.php?hatchlings_acquired_event_id=bdeb0af9-ea19-4b8e-853a-106108e4a14d
	//--------------------------------------------------------------------------------
	if ($verb == 'GET') 
	{
		$sql = 'SELECT * FROM hatchlings_acquired_event WHERE hatchlings_acquired_event_id = :hatchlings_acquired_event_id';
		$stmt = $db->prepare($sql);
		$stmt->bindValue(':hatchlings_acquired_event_id', $parameters['hatchlings_acquired_event_id']);
		$stmt->execute();

		if ($row = $stmt->fetch(PDO::FETCH_ASSOC)) 
		{
			$item['hatchlings_acquired_event_id'] = $row['hatchlings_acquired_event_id'];
			$item['organization_id'] = $row['organization_id'];
			$item['species_code'] = $row['species_code'];
			$item['event_date'] = dbDateOnly($row['event_date']);
			$item['event_count'] = $row['event_count'];
			$item['acquired_from_county'] = $row['acquired_from_county'];
			
			//-- fields to support a consolidated hatchlings event concept
			$item['hatchlings_event_id'] = $row['hatchlings_acquired_event_id'];
			$item['event_type'] = 'Acquired';
			$item['event_type_code'] = 'acquired';

			echo json_encode($item);
		}
	}
	else if (($verb == 'PUT') || ($verb == 'POST'))
	{
		$sql = '';
		$hatchlings_acquired_event_id = '';
		if ($verb == 'PUT')
		{
			$sql .= 'UPDATE hatchlings_acquired_event SET ';
			$sql .= 'organization_id = :organization_id, ';
			$sql .= 'species_code = :species_code, ';
			$sql .= 'event_date = :event_date, ';
			$sql .= 'event_count = :event_count, ';
			$sql .= 'acquired_from_county = :acquired_from_county ';
			$sql .= 'WHERE hatchlings_acquired_event_id = :hatchlings_acquired_event_id';
			
			$hatchlings_acquired_event_id = $parameters['hatchlings_acquired_event_id'];
		}
		else if ($verb == 'POST')
		{
			$sql .= 'INSERT INTO hatchlings_acquired_event ';
			$sql .= '(hatchlings_acquired_event_id, organization_id, species_code, event_date, event_count, acquired_from_county) ';
			$sql .= 'VALUES ';
			$sql .= '(:hatchlings_acquired_event_id, :organization_id, :species_code, :event_date, :event_count, :acquired_from_county) ';
			
			$hatchlings_acquired_event_id = utilCreateGuid();
		}
		$stmt = $db->prepare($sql);
		
		$stmt->bindValue(':hatchlings_acquired_event_id', $hatchlings_acquired_event_id);
		$stmt->bindValue(':organization_id', dbGetParameterValue($parameters, 'organization_id'));
		$stmt->bindValue(':species_code', dbGetParameterValue($parameters, 'species_code'));
		$stmt->bindValue(':event_date', dbGetParameterDate($parameters, 'event_date'));
		$stmt->bindValue(':event_count', dbGetParameterValue($parameters, 'event_count'));
		$stmt->bindValue(':acquired_from_county', dbGetParameterValue($parameters, 'acquired_from_county'));

		$stmt->execute();
	}
	else if ($verb == 'DELETE')
	{
		$sql = 'DELETE FROM hatchlings_acquired_event WHERE hatchlings_acquired_event_id = :hatchlings_acquired_event_id';
		$stmt = $db->prepare($sql);
		$stmt->bindValue(':hatchlings_acquired_event_id', $parameters['hatchlings_acquired_event_id']);
		$stmt->execute();
	}

?>