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
	utilLog('[organization_listitem.php] $verb = ' . $verb);
	$parameters = utilParseHttpParameters();
	
	//--------------------------------------------------------------------------------
	//-- GET /api/organization_listitem.php
	//--------------------------------------------------------------------------------
	if ($verb == 'GET') 
	{
		$items = array();
		
		$sql = 'SELECT organization_id, organization_name FROM organization ';

		$stmt = $db->prepare($sql);
		$stmt->execute();

		while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) 
		{
			$item['organization_id'] = $row['organization_id'];
			$item['organization_name'] = $row['organization_name'];
		
			$items[] = $item;
		}

		echo json_encode($items);
	}

?>