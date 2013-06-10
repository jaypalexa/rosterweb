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
	utilLog('[record_count.php] $verb = ' . $verb);
	$parameters = utilParseHttpParameters();
	
	//--------------------------------------------------------------------------------
	//-- GET /api/record_count.php
	//--------------------------------------------------------------------------------
	//-- expecting turtle_id -OR- organization_id, but not both
	//--------------------------------------------------------------------------------
	if ($verb == 'GET') 
	{
		if (isset($parameters['turtle_id']))
		{
			$item['turtle_tag_count'] = 0;
			$sql = 'SELECT COUNT(*) AS record_count FROM turtle_tag ';
			$sql .= 'WHERE turtle_id = :turtle_id ';
			$stmt = $db->prepare($sql);
			$stmt->bindValue(':turtle_id', $parameters['turtle_id']);
			$stmt->execute();
			if ($row = $stmt->fetch(PDO::FETCH_ASSOC)) 
			{
				$item['turtle_tag_count'] = $row['record_count'];
			}

			$item['turtle_morphometric_count'] = 0;
			$sql = 'SELECT COUNT(*) AS record_count FROM turtle_morphometric ';
			$sql .= 'WHERE turtle_id = :turtle_id ';
			$stmt = $db->prepare($sql);
			$stmt->bindValue(':turtle_id', $parameters['turtle_id']);
			$stmt->execute();
			if ($row = $stmt->fetch(PDO::FETCH_ASSOC)) 
			{
				$item['turtle_morphometric_count'] = $row['record_count'];
			}
		}
		else
		{
			$item['county_count'] = 0;
			$sql = 'SELECT COUNT(*) AS record_count FROM county ';
			$stmt = $db->prepare($sql);
			$stmt->execute();
			if ($row = $stmt->fetch(PDO::FETCH_ASSOC)) 
			{
				$item['county_count'] = $row['record_count'];
			}

			$item['organization_count'] = 0;
			$sql = 'SELECT COUNT(*) AS record_count FROM organization ';
			$stmt = $db->prepare($sql);
			$stmt->execute();
			if ($row = $stmt->fetch(PDO::FETCH_ASSOC)) 
			{
				$item['organization_count'] = $row['record_count'];
			}

			$item['tank_count'] = 0;
			$sql = 'SELECT COUNT(*) AS record_count FROM tank ';
			$sql .= 'WHERE organization_id = :organization_id ';
			$stmt = $db->prepare($sql);
			$stmt->bindValue(':organization_id', $parameters['organization_id']);
			$stmt->execute();
			if ($row = $stmt->fetch(PDO::FETCH_ASSOC)) 
			{
				$item['tank_count'] = $row['record_count'];
			}

			$item['turtle_count'] = 0;
			$sql = 'SELECT COUNT(*) AS record_count FROM turtle ';
			$sql .= 'WHERE organization_id = :organization_id ';
			$stmt = $db->prepare($sql);
			$stmt->bindValue(':organization_id', $parameters['organization_id']);
			$stmt->execute();
			if ($row = $stmt->fetch(PDO::FETCH_ASSOC)) 
			{
				$item['turtle_count'] = $row['record_count'];
			}

			$item['user_count'] = 0;
			$sql = 'SELECT COUNT(*) AS record_count FROM user ';
			$stmt = $db->prepare($sql);
			$stmt->execute();
			if ($row = $stmt->fetch(PDO::FETCH_ASSOC)) 
			{
				$item['user_count'] = $row['record_count'];
			}

			$item['hatchling_count'] = 0;
			$sql = 'SELECT COUNT(*) AS record_count FROM (';
			$sql .= 'SELECT 1 FROM hatchlings_acquired_event ';
			$sql .= 'WHERE organization_id = :organization_id ';
			$sql .= 'UNION ALL ';
			$sql .= 'SELECT 1 ';
			$sql .= 'FROM hatchlings_died_event ';
			$sql .= 'WHERE organization_id = :organization_id ';
			$sql .= 'UNION ALL ';
			$sql .= 'SELECT 1 ';
			$sql .= 'FROM hatchlings_released_event ';
			$sql .= 'WHERE organization_id = :organization_id ';
			$sql .= 'UNION ALL ';
			$sql .= 'SELECT 1 ';
			$sql .= 'FROM hatchlings_doa_event ';
			$sql .= 'WHERE organization_id = :organization_id ';
			$sql .= ') AS hatchlings ';
			$stmt = $db->prepare($sql);
			$stmt->bindValue(':organization_id', $parameters['organization_id']);
			$stmt->execute();
			if ($row = $stmt->fetch(PDO::FETCH_ASSOC)) 
			{
				$item['hatchling_count'] = $row['record_count'];
			}

			$item['washback_count'] = 0;
			$sql = 'SELECT COUNT(*) AS record_count FROM (';
			$sql .= 'SELECT 1 FROM washbacks_acquired_event ';
			$sql .= 'WHERE organization_id = :organization_id ';
			$sql .= 'UNION ALL ';
			$sql .= 'SELECT 1 ';
			$sql .= 'FROM washbacks_died_event ';
			$sql .= 'WHERE organization_id = :organization_id ';
			$sql .= 'UNION ALL ';
			$sql .= 'SELECT 1 ';
			$sql .= 'FROM washbacks_released_event ';
			$sql .= 'WHERE organization_id = :organization_id ';
			$sql .= 'UNION ALL ';
			$sql .= 'SELECT 1 ';
			$sql .= 'FROM washbacks_doa_event ';
			$sql .= 'WHERE organization_id = :organization_id ';
			$sql .= ') AS washbacks ';
			$stmt = $db->prepare($sql);
			$stmt->bindValue(':organization_id', $parameters['organization_id']);
			$stmt->execute();
			if ($row = $stmt->fetch(PDO::FETCH_ASSOC)) 
			{
				$item['washback_count'] = $row['record_count'];
			}
		}
		
		echo json_encode($item);
	}

?>