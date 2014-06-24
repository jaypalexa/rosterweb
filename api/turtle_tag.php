<?php
	header('Content-Type: application/json');
	require_once('util.php');
	require_once('db.php');
	session_start(); 
	if (!utilIsSessionValid()) { header('Location: /rosterweb/'); exit(0); }
	
	function fillItem($row)
	{
		$item['turtle_tag_id'] = $row['turtle_tag_id'];
		$item['turtle_id'] = $row['turtle_id'];
		$item['tag_number'] = $row['tag_number'];
		$item['tag_type'] = $row['tag_type'];
		$item['location'] = $row['location'];
		$item['date_tagged'] = dbDateOnly($row['date_tagged']);
		
		return $item;
	}
	
	//--------------------------------------------------------------------------------
	//-- get HTTP request stuff
	//--------------------------------------------------------------------------------
	$verb = strtoupper($_SERVER['REQUEST_METHOD']);
	utilLog('[turtle_tag.php] $verb = ' . $verb);
	$parameters = utilParseHttpParameters();
	
	//--------------------------------------------------------------------------------
	//-- GET /api/turtle_tag.php?desc=false&limit=20&offset=0&q=undefined&sort=turtle_name
	//-- GET /api/turtle_tag.php?turtle_tag_id=bdeb0af9-ea19-4b8e-853a-106108e4a14d
	//--------------------------------------------------------------------------------
	if ($verb == 'GET') 
	{
		$items = array();
		
		//--------------------------------------------------------------------------------
		//-- if there is no "turtle_tag_id" query string parameter, 
		//-- then this HTTP GET should return ALL items
		//--------------------------------------------------------------------------------
		if (!array_key_exists('turtle_tag_id', $parameters))
		{
			$sql = 'SELECT * FROM turtle_tag ';
			$sql .= 'WHERE turtle_id = :turtle_id ';
			
			if (array_key_exists('q', $parameters) && ($parameters['q'] != 'undefined'))
			{
				$sql .= 'AND turtle_name LIKE :search_turtle_name ';
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
			$stmt->bindValue(':turtle_id', $parameters['turtle_id']);
			if (array_key_exists('q', $parameters) && ($parameters['q'] != 'undefined'))
			{
				$stmt->bindValue(':search_turtle_name', '%' . $parameters['q'] .'%');
			}
			$stmt->execute();
 
			while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) 
			{
				$items[] = fillItem($row);
			}

			echo json_encode($items);
		}
		//--------------------------------------------------------------------------------
		//-- else, there is an "turtle_tag_id" query string parameter, 
		//-- so this HTTP GET should return the indicated item
		//--------------------------------------------------------------------------------
		else
		{
			$sql = 'SELECT * FROM turtle_tag WHERE turtle_tag_id = :turtle_tag_id';
			$stmt = $db->prepare($sql);
			$stmt->bindValue(':turtle_tag_id', $parameters['turtle_tag_id']);
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

		if ($verb == 'PUT')
		{
			$sql .= 'UPDATE turtle_tag SET ';
			$sql .= 'turtle_id = :turtle_id, ';
			$sql .= 'tag_number = :tag_number, ';
			$sql .= 'tag_type = :tag_type, ';
			$sql .= 'location = :location, ';
			$sql .= 'date_tagged = :date_tagged ';
			$sql .= 'WHERE turtle_tag_id = :turtle_tag_id';
		}
		else if ($verb == 'POST')
		{
			$sql .= 'INSERT INTO turtle_tag (';
			$sql .= 'turtle_tag_id, turtle_id, tag_number, tag_type, location, date_tagged ';
			$sql .= ') VALUES (';
			$sql .= ':turtle_tag_id, :turtle_id, :tag_number, :tag_type, :location, :date_tagged ';
			$sql .= ') ';
		}
		$stmt = $db->prepare($sql);
		
		$stmt->bindValue(':turtle_tag_id', dbGetParameterValue($parameters, 'turtle_tag_id'));
		$stmt->bindValue(':turtle_id', dbGetParameterValue($parameters, 'turtle_id'));
		$stmt->bindValue(':tag_number', dbGetParameterValue($parameters, 'tag_number'));
		$stmt->bindValue(':tag_type', dbGetParameterValue($parameters, 'tag_type'));
		$stmt->bindValue(':location', dbGetParameterValue($parameters, 'location'));
		$stmt->bindValue(':date_tagged', dbGetParameterDate($parameters, 'date_tagged'));

		$stmt->execute();
	}
	else if ($verb == 'DELETE')
	{
		$sql = 'INSERT INTO deleted_turtle_tag SELECT * FROM turtle_tag WHERE turtle_tag_id = :turtle_tag_id';
		$stmt = $db->prepare($sql);
		$stmt->bindValue(':turtle_tag_id', $parameters['turtle_tag_id']);
		$stmt->execute();
	
		$sql = 'DELETE FROM turtle_tag WHERE turtle_tag_id = :turtle_tag_id';
		$stmt = $db->prepare($sql);
		$stmt->bindValue(':turtle_tag_id', $parameters['turtle_tag_id']);
		$stmt->execute();
	}

?>