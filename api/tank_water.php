<?php
	header('Content-Type: application/json');
	require_once('util.php');
	require_once('db.php');
	session_start(); 
	if (!utilIsSessionValid()) { header('Location: /rosterweb/'); exit(0); }
	
	function fillItem($row)
	{
		$item['tank_water_id'] = $row['tank_water_id'];
		$item['date_measured'] = $row['date_measured'];
		$item['tank_id'] = $row['tank_id'];
		$item['temperature'] = $row['temperature'];
		$item['salinity'] = $row['salinity'];
		$item['ph'] = $row['ph'];
		
		return $item;
	}
	
	//--------------------------------------------------------------------------------
	//-- get HTTP request stuff
	//--------------------------------------------------------------------------------
	$verb = strtoupper($_SERVER['REQUEST_METHOD']);
	utilLog('[tank_water.php] $verb = ' . $verb);
	$parameters = utilParseHttpParameters();
	
	//--------------------------------------------------------------------------------
	//-- GET /api/tank_water.php?desc=false&limit=20&offset=0&q=undefined&sort=turtle_name
	//-- GET /api/tank_water.php?tank_water_id=bdeb0af9-ea19-4b8e-853a-106108e4a14d
	//--------------------------------------------------------------------------------
	if ($verb == 'GET') 
	{
		$items = array();
		
		//--------------------------------------------------------------------------------
		//-- if there is no "tank_water_id" query string parameter, 
		//-- then this HTTP GET should return ALL items
		//--------------------------------------------------------------------------------
		if (!array_key_exists('tank_water_id', $parameters))
		{
			$sql = 'SELECT * FROM tank_water ';
			$sql .= 'WHERE tank_id = :tank_id ';
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
			$stmt->bindValue(':tank_id', $parameters['tank_id']);
			$stmt->execute();
 
			while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) 
			{
				$items[] = fillItem($row);
			}

			echo json_encode($items);
		}
		//--------------------------------------------------------------------------------
		//-- else, there is an "tank_water_id" query string parameter, 
		//-- so this HTTP GET should return the indicated item
		//--------------------------------------------------------------------------------
		else
		{
			$sql = 'SELECT * FROM tank_water WHERE tank_water_id = :tank_water_id';
			$stmt = $db->prepare($sql);
			$stmt->bindValue(':tank_water_id', $parameters['tank_water_id']);
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
		$tank_water_id = '';
		if ($verb == 'PUT')
		{
			$sql .= 'UPDATE tank_water SET ';
			$sql .= 'date_measured = :date_measured, ';
			$sql .= 'tank_id = :tank_id, ';
			$sql .= 'temperature = :temperature, ';
			$sql .= 'salinity = :salinity, ';
			$sql .= 'ph = :ph ';
			$sql .= 'WHERE tank_water_id = :tank_water_id';
			
			$tank_water_id = $parameters['tank_water_id'];
		}
		else if ($verb == 'POST')
		{
			$sql .= 'INSERT INTO tank_water (';
			$sql .= 'date_measured, tank_water_id, tank_id, temperature, salinity, ph ';
			$sql .= ') VALUES (';
			$sql .= ':date_measured, :tank_water_id, :tank_id, :temperature, :salinity, :ph ';
			$sql .= ') ';
			
			$tank_water_id = utilCreateGuid();
		}
		$stmt = $db->prepare($sql);
		
		$stmt->bindValue(':tank_water_id', $tank_water_id);
		$stmt->bindValue(':tank_id', dbGetParameterValue($parameters, 'tank_id'));
		$stmt->bindValue(':date_measured', dbGetParameterDate($parameters, 'date_measured'));
		$stmt->bindValue(':temperature', dbGetParameterValue($parameters, 'temperature'));
		$stmt->bindValue(':salinity', dbGetParameterValue($parameters, 'salinity'));
		$stmt->bindValue(':ph', dbGetParameterValue($parameters, 'ph'));

		$stmt->execute();
	}
	else if ($verb == 'DELETE')
	{
		$sql = 'DELETE FROM tank_water WHERE tank_water_id = :tank_water_id';
		$stmt = $db->prepare($sql);
		$stmt->bindValue(':tank_water_id', $parameters['tank_water_id']);
		$stmt->execute();
	}

?>