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
	utilLog('[washbacks_event.php] $verb = ' . $verb);
	$parameters = utilParseHttpParameters();
	
	//--------------------------------------------------------------------------------
	//-- GET /api/washback.php?desc=false&limit=20&offset=0&q=undefined&sort=washback_name
	//--------------------------------------------------------------------------------
	if ($verb == 'GET') 
	{
		$items = array();
		
		$sql = 'SELECT washbacks_acquired_event_id AS washbacks_event_id, species_code, event_date, \'Acquired\' AS event_type, \'acquired\' AS event_type_code, event_count, acquired_from_county AS county_name ';
		$sql .= 'FROM washbacks_acquired_event ';
		$sql .= 'WHERE organization_id = :organization_id ';
		$sql .= 'UNION ALL ';
		$sql .= 'SELECT washbacks_died_event_id AS washbacks_event_id, species_code, event_date, \'Died\' AS event_type, \'died\' AS event_type_code, event_count, \'\' AS county_name ';
		$sql .= 'FROM washbacks_died_event ';
		$sql .= 'WHERE organization_id = :organization_id ';
		$sql .= 'UNION ALL ';
		$sql .= 'SELECT washbacks_released_event_id AS washbacks_event_id, species_code, event_date, \'Released\' AS event_type, \'released\' AS event_type_code, IFNULL(beach_event_count, 0) + IFNULL(offshore_event_count, 0) AS event_count, \'\' AS county_name ';
		$sql .= 'FROM washbacks_released_event ';
		$sql .= 'WHERE organization_id = :organization_id ';
		$sql .= 'UNION ALL ';
		$sql .= 'SELECT washbacks_doa_event_id AS washbacks_event_id, species_code, event_date, \'DOA\' AS event_type, \'doa\' AS event_type_code, event_count, doa_from_county AS county_name ';
		$sql .= 'FROM washbacks_doa_event ';
		$sql .= 'WHERE organization_id = :organization_id ';
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
		//utilLog('[washbacks_event.php] $sql = ' . $sql);
		$stmt->execute();

		while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) 
		{
			$item['washbacks_event_id'] = $row['washbacks_event_id'];
			$item['species_code'] = $row['species_code'];
			$item['event_date'] = dbDateOnly($row['event_date']);
			$item['event_type'] = $row['event_type'];
			$item['event_type_code'] = $row['event_type_code'];
			$item['event_count'] = $row['event_count'];
			$item['county_name'] = $row['county_name'];
	
			$items[] = $item;
		}

		echo json_encode($items);
	}

?>