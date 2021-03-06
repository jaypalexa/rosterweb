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
	utilLog('[washbacks_died_event.php] $verb = ' . $verb);
	$parameters = utilParseHttpParameters();
	
	//--------------------------------------------------------------------------------
	//-- GET /api/washbacks_died_event.php?desc=false&limit=20&offset=0&q=undefined&sort=washbacks_died_event_name
	//-- GET /api/washbacks_died_event.php?washbacks_died_event_id=bdeb0af9-ea19-4b8e-853a-106108e4a14d
	//--------------------------------------------------------------------------------
	if ($verb == 'GET') 
	{
		$sql = 'SELECT * FROM washbacks_died_event WHERE washbacks_died_event_id = :washbacks_died_event_id';
		$stmt = $db->prepare($sql);
		$stmt->bindValue(':washbacks_died_event_id', $parameters['washbacks_died_event_id']);
		$stmt->execute();

		if ($row = $stmt->fetch(PDO::FETCH_ASSOC)) 
		{
			$item['washbacks_died_event_id'] = $row['washbacks_died_event_id'];
			$item['organization_id'] = $row['organization_id'];
			$item['species_code'] = $row['species_code'];
			$item['event_date'] = dbDateOnly($row['event_date']);
			$item['event_count'] = dbIntOrNull($row['event_count']);
			$item['under_5cm_clsl'] = dbYNtoBoolean($row['under_5cm_clsl']);
			
			//-- fields to support a consolidated washbacks event concept
			$item['washbacks_event_id'] = $row['washbacks_died_event_id'];
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
			$sql .= 'UPDATE washbacks_died_event SET ';
			$sql .= 'organization_id = :organization_id, ';
			$sql .= 'species_code = :species_code, ';
			$sql .= 'event_date = :event_date, ';
			$sql .= 'event_count = :event_count, ';
			$sql .= 'under_5cm_clsl = :under_5cm_clsl ';
			$sql .= 'WHERE washbacks_died_event_id = :washbacks_died_event_id';
		}
		else if ($verb == 'POST')
		{
			$sql .= 'INSERT INTO washbacks_died_event ';
			$sql .= '(washbacks_died_event_id, organization_id, species_code, event_date, event_count, under_5cm_clsl) ';
			$sql .= 'VALUES ';
			$sql .= '(:washbacks_died_event_id, :organization_id, :species_code, :event_date, :event_count, :under_5cm_clsl) ';
		}
		$stmt = $db->prepare($sql);
		
		$stmt->bindValue(':washbacks_died_event_id', dbGetParameterValue($parameters, 'washbacks_died_event_id'));
		$stmt->bindValue(':organization_id', dbGetParameterValue($parameters, 'organization_id'));
		$stmt->bindValue(':species_code', dbGetParameterValue($parameters, 'species_code'));
		$stmt->bindValue(':event_date', dbGetParameterDate($parameters, 'event_date'));
		$stmt->bindValue(':event_count', dbGetParameterInt($parameters, 'event_count'));
		$stmt->bindValue(':under_5cm_clsl', dbGetParameterBoolean($parameters, 'under_5cm_clsl'));

		$stmt->execute();
	}
	else if ($verb == 'DELETE')
	{
		$sql = 'DELETE FROM washbacks_died_event WHERE washbacks_died_event_id = :washbacks_died_event_id';
		$stmt = $db->prepare($sql);
		$stmt->bindValue(':washbacks_died_event_id', $parameters['washbacks_died_event_id']);
		$stmt->execute();
	}

?>