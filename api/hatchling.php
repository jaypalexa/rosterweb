<?php
	header('Content-Type: application/json');
	require_once('util.php');
	require_once('db.php');
	session_start(); 
	if (!utilIsSessionValid()) { header('Location: /rosterweb/'); exit(0); }
	
	function fillItem($row)
	{
		$item['hatchling_id'] = $row['hatchling_id'];
		$item['organization_id'] = $row['organization_id'];
		$item['hatchling_name'] = $row['hatchling_name'];
		
		return $item;
	}
	
	//--------------------------------------------------------------------------------
	//-- get HTTP request stuff
	//--------------------------------------------------------------------------------
	$verb = strtoupper($_SERVER['REQUEST_METHOD']);
	utilLog('[hatchling.php] $verb = ' . $verb);
	$parameters = utilParseHttpParameters();
	
	//--------------------------------------------------------------------------------
	//-- GET /api/hatchling.php?desc=false&limit=20&offset=0&q=undefined&sort=hatchling_name
	//-- GET /api/hatchling.php?hatchling_id=bdeb0af9-ea19-4b8e-853a-106108e4a14d
	//--------------------------------------------------------------------------------
	if ($verb == 'GET') 
	{
		$items = array();
		
		//--------------------------------------------------------------------------------
		//-- if there is no "hatchling_id" query string parameter, 
		//-- then this HTTP GET should return ALL items
		//--------------------------------------------------------------------------------
		if (!array_key_exists('hatchling_id', $parameters))
		{
			$sql = 'SELECT hatchlings_acquired_event_id AS hatchlings_event_id, species_code, event_date, \'Acquired\' AS event_type, \'acquired\' AS event_type_code, event_count, acquired_from_county AS county_name ';
			$sql .= 'FROM hatchlings_acquired_event ';
			$sql .= 'WHERE organization_id = :organization_id ';
			$sql .= 'UNION ALL ';
			$sql .= 'SELECT hatchlings_died_event_id AS hatchlings_event_id, species_code, event_date, \'Died\' AS event_type, \'died\' AS event_type_code, event_count, \'\' AS county_name ';
			$sql .= 'FROM hatchlings_died_event ';
			$sql .= 'WHERE organization_id = :organization_id ';
			$sql .= 'UNION ALL ';
			$sql .= 'SELECT hatchlings_released_event_id AS hatchlings_event_id, species_code, event_date, \'Released\' AS event_type, \'released\' AS event_type_code, IFNULL(\'beach_event_count\', 0) + IFNULL(\'offshore_event_count\', 0) AS event_count, \'\' AS county_name ';
			$sql .= 'FROM hatchlings_released_event ';
			$sql .= 'WHERE organization_id = :organization_id ';
			$sql .= 'UNION ALL ';
			$sql .= 'SELECT hatchlings_doa_event_id AS hatchlings_event_id, species_code, event_date, \'DOA\' AS event_type, \'doa\' AS event_type_code, event_count, doa_from_county AS county_name ';
			$sql .= 'FROM hatchlings_doa_event ';
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
			$stmt->execute();
 
			while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) 
			{
				$item['hatchlings_event_id'] = $row['hatchlings_event_id'];
				$item['species_code'] = $row['species_code'];
				$item['event_date'] = $row['event_date'];
				$item['event_type'] = $row['event_type'];
				$item['event_type_code'] = $row['event_type_code'];
				$item['event_count'] = $row['event_count'];
				$item['county_name'] = $row['county_name'];
		
				$items[] = $item;
			}

			echo json_encode($items);
		}
		//--------------------------------------------------------------------------------
		//-- else, there is an "hatchling_id" query string parameter, 
		//-- so this HTTP GET should return the indicated item
		//--------------------------------------------------------------------------------
		else
		{
			$sql = 'SELECT * FROM hatchling WHERE hatchling_id = :hatchling_id';
			$stmt = $db->prepare($sql);
			$stmt->bindValue(':hatchling_id', $parameters['hatchling_id']);
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
		$hatchling_id = '';
		if ($verb == 'PUT')
		{
			$sql .= 'UPDATE hatchling SET ';
			$sql .= 'organization_id = :organization_id, ';
			$sql .= 'hatchling_name = :hatchling_name ';
			$sql .= 'WHERE hatchling_id = :hatchling_id';
			
			$hatchling_id = $parameters['hatchling_id'];
		}
		else if ($verb == 'POST')
		{
			$sql .= 'INSERT INTO hatchling ';
			$sql .= '(hatchling_id, organization_id, hatchling_name) ';
			$sql .= 'VALUES ';
			$sql .= '(:hatchling_id, :organization_id, :hatchling_name) ';
			
			$hatchling_id = utilCreateGuid();
		}
		$stmt = $db->prepare($sql);
		
		$stmt->bindValue(':hatchling_id', $hatchling_id);
		$stmt->bindValue(':organization_id', dbGetParameterValue($parameters, 'organization_id'));
		$stmt->bindValue(':hatchling_name', dbGetParameterValue($parameters, 'hatchling_name'));

		$stmt->execute();
	}
	else if ($verb == 'DELETE')
	{
		$sql = 'DELETE FROM hatchling WHERE hatchling_id = :hatchling_id';
		$stmt = $db->prepare($sql);
		$stmt->bindValue(':hatchling_id', $parameters['hatchling_id']);
		$stmt->execute();
	}

?>