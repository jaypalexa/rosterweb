<?php
	header('Content-Type: application/json');
	require_once('util.php');
	require_once('db.php');
	session_start(); 
	if (!utilIsSessionValid()) { header('Location: /rosterweb/'); exit(0); }
	
	//*** CONSOLIDATED HATCHLINGS EVENT LIST ITEMS ONLY ***
	
	//--------------------------------------------------------------------------------
	//-- get HTTP request stuff
	//--------------------------------------------------------------------------------
	$verb = strtoupper($_SERVER['REQUEST_METHOD']);
	utilLog('[hatchlings_event.php] $verb = ' . $verb);
	$parameters = utilParseHttpParameters();
	
	//--------------------------------------------------------------------------------
	//-- GET /api/hatchling.php?desc=false&limit=20&offset=0&q=undefined&sort=hatchling_name
	//--------------------------------------------------------------------------------
	if ($verb == 'GET') 
	{
		$items = array();
		
		$sql = 'SELECT * FROM (';
		$sql .= 'SELECT hatchlings_acquired_event_id AS hatchlings_event_id, species_code, event_date, \'Acquired\' AS event_type, \'acquired\' AS event_type_code, IFNULL(event_count, 0) AS event_count, acquired_from_county AS county_name ';
		$sql .= 'FROM hatchlings_acquired_event ';
		$sql .= 'WHERE organization_id = :organization_id ';
		$sql .= 'UNION ALL ';
		$sql .= 'SELECT hatchlings_died_event_id AS hatchlings_event_id, species_code, event_date, \'Died\' AS event_type, \'died\' AS event_type_code, IFNULL(event_count, 0) AS event_count, \'\' AS county_name ';
		$sql .= 'FROM hatchlings_died_event ';
		$sql .= 'WHERE organization_id = :organization_id ';
		$sql .= 'UNION ALL ';
		$sql .= 'SELECT hatchlings_released_event_id AS hatchlings_event_id, species_code, event_date, \'Released\' AS event_type, \'released\' AS event_type_code, IFNULL(beach_event_count, 0) + IFNULL(offshore_event_count, 0) AS event_count, \'\' AS county_name ';
		$sql .= 'FROM hatchlings_released_event ';
		$sql .= 'WHERE organization_id = :organization_id ';
		$sql .= 'UNION ALL ';
		$sql .= 'SELECT hatchlings_doa_event_id AS hatchlings_event_id, species_code, event_date, \'DOA\' AS event_type, \'doa\' AS event_type_code, IFNULL(event_count, 0) AS event_count, doa_from_county AS county_name ';
		$sql .= 'FROM hatchlings_doa_event ';
		$sql .= 'WHERE organization_id = :organization_id ';
		$sql .= ') tbl ';

		if (array_key_exists('q', $parameters) && ($parameters['q'] != 'undefined'))
		{
			$sql .= 'WHERE species_code LIKE :q OR event_type LIKE :q OR county_name LIKE :q ';
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
		if (array_key_exists('q', $parameters) && ($parameters['q'] != 'undefined'))
		{
			$stmt->bindValue(':q', '%' . $parameters['q'] .'%');
		}
		$stmt->execute();

		while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) 
		{
			$item['hatchlings_event_id'] = $row['hatchlings_event_id'];
			$item['species_code'] = $row['species_code'];
			$item['event_date'] = dbDateOnly($row['event_date']);
			$item['event_type'] = $row['event_type'];
			$item['event_type_code'] = $row['event_type_code'];
			$item['event_count'] = dbIntOrNull($row['event_count']);
			$item['county_name'] = $row['county_name'];
	
			$items[] = $item;
		}

		echo json_encode($items);
	}

?>