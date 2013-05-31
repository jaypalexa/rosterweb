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
	if ($verb == 'GET') 
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
		
		//utilLog('[record_count.php] $item[\'county_count\'] = ' . $item['county_count']);
		//utilLog('[record_count.php] $item[\'organization_count\'] = ' . $item['organization_count']);
		//utilLog('[record_count.php] $item[\'tank_count\'] = ' . $item['tank_count']);
		//utilLog('[record_count.php] $item[\'turtle_count\'] = ' . $item['turtle_count']);
		//utilLog('[record_count.php] $item[\'user_count\'] = ' . $item['user_count']);

		echo json_encode($item);
	}

?>