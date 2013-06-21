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
	utilLog('[turtle_attachment.php] $verb = ' . $verb);
	$parameters = utilParseHttpParameters();
	
	//--------------------------------------------------------------------------------
	//-- GET /api/turtle_attachment.php?desc=false&limit=20&offset=0&q=undefined&sort=base_file_name
	//--------------------------------------------------------------------------------
	if ($verb == 'GET') 
	{
		$turtleId = $parameters['turtle_id'];
		
		$items = array();
		
		foreach (glob($utilUploadsAttachmentsRelPath . '/' . $turtleId . '-' . '*.*') as $filename) 
		{
			$item['turtle_attachment_id'] = utilCreateGuid();	//-- fake GUID used for id tag in list, for deleting HTML table row
			$item['turtle_id'] = $turtleId;
			$item['full_file_name'] = str_replace($utilUploadsAttachmentsRelPath, $utilUploadsAttachmentsUriPath, $filename);
			$item['base_file_name'] = str_replace($utilUploadsAttachmentsRelPath . '/' . $turtleId . '-', '', $filename);

			$items[] = $item;
		}
		
		$dir = SORT_ASC;
		if ($parameters['desc'] == 'true')
		{
			$dir = SORT_DESC;
		}
		
		utilArraySortByColumn($items, 'base_file_name', $dir);

		echo json_encode($items);
	}
	else if ($verb == 'DELETE')
	{
		$turtleId = $parameters['turtle_id'];
		$baseFileName = $parameters['base_file_name'];
	
		$permBaseFileName = $turtleId . '-' . $baseFileName;
		$permFileName = $utilUploadsAttachmentsRelPath . '/' . $permBaseFileName;
		//utilLog('[turtle_attachment.php] $permFileName = ' . $permFileName);
		$realFileName = realpath($permFileName);
		//utilLog('[turtle_attachment.php] $realFileName = ' . $realFileName);
		unlink($realFileName);
	}

?>