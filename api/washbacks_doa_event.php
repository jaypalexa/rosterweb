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
	utilLog('[washbacks_doa_event.php] $verb = ' . $verb);
	$parameters = utilParseHttpParameters();
	
	//--------------------------------------------------------------------------------
	//-- GET /api/washbacks_doa_event.php?desc=false&limit=20&offset=0&q=undefined&sort=washbacks_doa_event_name
	//-- GET /api/washbacks_doa_event.php?washbacks_doa_event_id=bdeb0af9-ea19-4b8e-853a-106108e4a14d
	//--------------------------------------------------------------------------------
	if ($verb == 'GET') 
	{
		$sql = 'SELECT * FROM washbacks_doa_event WHERE washbacks_doa_event_id = :washbacks_doa_event_id';
		$stmt = $db->prepare($sql);
		$stmt->bindValue(':washbacks_doa_event_id', $parameters['washbacks_doa_event_id']);
		$stmt->execute();

		if ($row = $stmt->fetch(PDO::FETCH_ASSOC)) 
		{
			$item['washbacks_doa_event_id'] = $row['washbacks_doa_event_id'];
			$item['organization_id'] = $row['organization_id'];
			$item['species_code'] = $row['species_code'];
			$item['event_date'] = dbDateOnly($row['event_date']);
			$item['event_count'] = dbIntOrNull($row['event_count']);
			$item['doa_from_county'] = $row['doa_from_county'];
			$item['under_5cm_clsl'] = dbYNtoBoolean($row['under_5cm_clsl']);
			
			//-- fields to support a consolidated washbacks event concept
			$item['washbacks_event_id'] = $row['washbacks_doa_event_id'];
			$item['event_type'] = 'DOA';
			$item['event_type_code'] = 'doa';

			echo json_encode($item);
		}
	}
	else if (($verb == 'PUT') || ($verb == 'POST'))
	{
		$sql = '';

		if ($verb == 'PUT')
		{
			$sql .= 'UPDATE washbacks_doa_event SET ';
			$sql .= 'organization_id = :organization_id, ';
			$sql .= 'species_code = :species_code, ';
			$sql .= 'event_date = :event_date, ';
			$sql .= 'event_count = :event_count, ';
			$sql .= 'doa_from_county = :doa_from_county, ';
			$sql .= 'under_5cm_clsl = :under_5cm_clsl ';
			$sql .= 'WHERE washbacks_doa_event_id = :washbacks_doa_event_id';
		}
		else if ($verb == 'POST')
		{
			$sql .= 'INSERT INTO washbacks_doa_event ';
			$sql .= '(washbacks_doa_event_id, organization_id, species_code, event_date, event_count, doa_from_county, under_5cm_clsl) ';
			$sql .= 'VALUES ';
			$sql .= '(:washbacks_doa_event_id, :organization_id, :species_code, :event_date, :event_count, :doa_from_county, :under_5cm_clsl) ';
		}
		$stmt = $db->prepare($sql);
		
		$stmt->bindValue(':washbacks_doa_event_id', dbGetParameterValue($parameters, 'washbacks_doa_event_id'));
		$stmt->bindValue(':organization_id', dbGetParameterValue($parameters, 'organization_id'));
		$stmt->bindValue(':species_code', dbGetParameterValue($parameters, 'species_code'));
		$stmt->bindValue(':event_date', dbGetParameterDate($parameters, 'event_date'));
		$stmt->bindValue(':event_count', dbGetParameterValue($parameters, 'event_count'));
		$stmt->bindValue(':doa_from_county', dbGetParameterValue($parameters, 'doa_from_county'));
		$stmt->bindValue(':under_5cm_clsl', dbGetParameterBoolean($parameters, 'under_5cm_clsl'));

		$stmt->execute();
	}
	else if ($verb == 'DELETE')
	{
		$sql = 'DELETE FROM washbacks_doa_event WHERE washbacks_doa_event_id = :washbacks_doa_event_id';
		$stmt = $db->prepare($sql);
		$stmt->bindValue(':washbacks_doa_event_id', $parameters['washbacks_doa_event_id']);
		$stmt->execute();
	}

?>