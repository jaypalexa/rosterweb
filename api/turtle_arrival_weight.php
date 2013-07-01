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
	utilLog('[turtle_arrival_weight.php] $verb = ' . $verb);
	$parameters = utilParseHttpParameters();
	
	//--------------------------------------------------------------------------------
	//-- GET /api/turtle_arrival_weight.php?turtle_id=GUID
	//--------------------------------------------------------------------------------
	if ($verb == 'GET') 
	{
		$item['weight_value'] = 'none recorded';
		$item['weight_units'] = '';
		
		$sql = 'SELECT weight_value, weight_units FROM turtle_morphometric ';
		$sql .= 'WHERE turtle_id = :turtle_id ';
		$sql .= 'ORDER BY date_measured ';
		$sql .= 'LIMIT 1 ';
		$stmt = $db->prepare($sql);
		$stmt->bindValue(':turtle_id', $parameters['turtle_id']);
		$stmt->execute();
		if ($row = $stmt->fetch(PDO::FETCH_ASSOC)) 
		{
			$item['weight_value'] = $row['weight_value'];
			$item['weight_units'] = $row['weight_units'];
		}
		
		echo json_encode($item);
	}

?>