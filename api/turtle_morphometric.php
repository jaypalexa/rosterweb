<?php
	header('Content-Type: application/json');
	require_once('util.php');
	require_once('db.php');
	session_start(); 
	if (!utilIsSessionValid()) { header('Location: /rosterweb/'); exit(0); }
	
	function fillItem($row)
	{
		$item['turtle_morphometric_id'] = $row['turtle_morphometric_id'];
		$item['turtle_id'] = $row['turtle_id'];
		$item['date_measured'] = dbDateOnly($row['date_measured']);
		$item['scl_notch_notch_value'] = $row['scl_notch_notch_value'];
		$item['scl_notch_notch_units'] = $row['scl_notch_notch_units'];
		$item['scl_notch_tip_value'] = $row['scl_notch_tip_value'];
		$item['scl_notch_tip_units'] = $row['scl_notch_tip_units'];
		$item['scl_tip_tip_value'] = $row['scl_tip_tip_value'];
		$item['scl_tip_tip_units'] = $row['scl_tip_tip_units'];
		$item['scw_value'] = $row['scw_value'];
		$item['scw_units'] = $row['scw_units'];
		$item['ccl_notch_notch_value'] = $row['ccl_notch_notch_value'];
		$item['ccl_notch_notch_units'] = $row['ccl_notch_notch_units'];
		$item['ccl_notch_tip_value'] = $row['ccl_notch_tip_value'];
		$item['ccl_notch_tip_units'] = $row['ccl_notch_tip_units'];
		$item['ccl_tip_tip_value'] = $row['ccl_tip_tip_value'];
		$item['ccl_tip_tip_units'] = $row['ccl_tip_tip_units'];
		$item['ccw_value'] = $row['ccw_value'];
		$item['ccw_units'] = $row['ccw_units'];
		$item['weight_value'] = $row['weight_value'];
		$item['weight_units'] = $row['weight_units'];
		
		return $item;
	}
	
	//--------------------------------------------------------------------------------
	//-- get HTTP request stuff
	//--------------------------------------------------------------------------------
	$verb = strtoupper($_SERVER['REQUEST_METHOD']);
	utilLog('[turtle_morphometric.php] $verb = ' . $verb);
	$parameters = utilParseHttpParameters();
	
	//--------------------------------------------------------------------------------
	//-- GET /api/turtle_morphometric.php?desc=false&limit=20&offset=0&q=undefined&sort=turtle_name
	//-- GET /api/turtle_morphometric.php?turtle_morphometric_id=bdeb0af9-ea19-4b8e-853a-106108e4a14d
	//--------------------------------------------------------------------------------
	if ($verb == 'GET') 
	{
		$items = array();
		
		//--------------------------------------------------------------------------------
		//-- if there is no "turtle_morphometric_id" query string parameter, 
		//-- then this HTTP GET should return ALL items
		//--------------------------------------------------------------------------------
		if (!array_key_exists('turtle_morphometric_id', $parameters))
		{
			$sql = 'SELECT * FROM turtle_morphometric ';
			$sql .= 'WHERE turtle_id = :turtle_id ';
			
			if ($parameters['q'] != 'undefined')
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
			if ($parameters['q'] != 'undefined')
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
		//-- else, there is an "turtle_morphometric_id" query string parameter, 
		//-- so this HTTP GET should return the indicated item
		//--------------------------------------------------------------------------------
		else
		{
			$sql = 'SELECT * FROM turtle_morphometric WHERE turtle_morphometric_id = :turtle_morphometric_id';
			$stmt = $db->prepare($sql);
			$stmt->bindValue(':turtle_morphometric_id', $parameters['turtle_morphometric_id']);
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
		$turtle_morphometric_id = '';
		if ($verb == 'PUT')
		{
			$sql .= 'UPDATE turtle_morphometric SET ';
			$sql .= 'turtle_id = :turtle_id, ';
			$sql .= 'date_measured = :date_measured ';
			$sql .= 'scl_notch_notch_value = :scl_notch_notch_value, ';
			$sql .= 'scl_notch_notch_units = :scl_notch_notch_units, ';
			$sql .= 'scl_notch_tip_value = :scl_notch_tip_value, ';
			$sql .= 'scl_notch_tip_units = :scl_notch_tip_units, ';
			$sql .= 'scl_tip_tip_value = :scl_tip_tip_value, ';
			$sql .= 'scl_tip_tip_units = :scl_tip_tip_units, ';
			$sql .= 'scw_value = :scw_value, ';
			$sql .= 'scw_units = :scw_units, ';
			$sql .= 'ccl_notch_notch_value = :ccl_notch_notch_value, ';
			$sql .= 'ccl_notch_notch_units = :ccl_notch_notch_units, ';
			$sql .= 'ccl_notch_tip_value = :ccl_notch_tip_value, ';
			$sql .= 'ccl_notch_tip_units = :ccl_notch_tip_units, ';
			$sql .= 'ccl_tip_tip_value = :ccl_tip_tip_value, ';
			$sql .= 'ccl_tip_tip_units = :ccl_tip_tip_units, ';
			$sql .= 'ccw_value = :ccw_value, ';
			$sql .= 'ccw_units = :ccw_units, ';
			$sql .= 'weight_value = :weight_value, ';
			$sql .= 'weight_units = :weight_units ';
			$sql .= 'WHERE turtle_morphometric_id = :turtle_morphometric_id';
			
			$turtle_morphometric_id = $parameters['turtle_morphometric_id'];
		}
		else if ($verb == 'POST')
		{
			$sql .= 'INSERT INTO turtle_morphometric (';
			$sql .= 'turtle_morphometric_id, turtle_id, date_measured, ';
			$sql .= 'scl_notch_notch_value, scl_notch_notch_units, scl_notch_tip_value, scl_notch_tip_units, ';
			$sql .= 'scl_tip_tip_value, scl_tip_tip_units, scw_value, scw_units, ';
			$sql .= 'ccl_notch_notch_value, ccl_notch_notch_units, ccl_notch_tip_value, ccl_notch_tip_units, ';
			$sql .= 'ccl_tip_tip_value, ccl_tip_tip_units, ccw_value, ccw_units, ';
			$sql .= 'weight_value, weight_units ';
			$sql .= ') VALUES (';
			$sql .= ':turtle_morphometric_id, :turtle_id, :date_measured, ';
			$sql .= ':scl_notch_notch_value, :scl_notch_notch_units, :scl_notch_tip_value, :scl_notch_tip_units, ';
			$sql .= ':scl_tip_tip_value, :scl_tip_tip_units, :scw_value, :scw_units, ';
			$sql .= ':ccl_notch_notch_value, :ccl_notch_notch_units, :ccl_notch_tip_value, :ccl_notch_tip_units, ';
			$sql .= ':ccl_tip_tip_value, :ccl_tip_tip_units, :ccw_value, :ccw_units, ';
			$sql .= ':weight_value, :weight_units ';
			$sql .= ') ';
			
			$turtle_morphometric_id = utilCreateGuid();
		}
		$stmt = $db->prepare($sql);
		
		$stmt->bindValue(':turtle_morphometric_id', $turtle_morphometric_id);
		$stmt->bindValue(':turtle_id', dbGetParameterValue($parameters, 'turtle_id'));
		$stmt->bindValue(':date_measured', dbGetParameterDate($parameters, 'date_measured'));
		$stmt->bindValue(':scl_notch_notch_value', dbGetParameterValue($parameters, 'scl_notch_notch_value'));
		$stmt->bindValue(':scl_notch_notch_units', dbGetParameterValue($parameters, 'scl_notch_notch_units'));
		$stmt->bindValue(':scl_notch_tip_value', dbGetParameterValue($parameters, 'scl_notch_tip_value'));
		$stmt->bindValue(':scl_notch_tip_units', dbGetParameterValue($parameters, 'scl_notch_tip_units'));
		$stmt->bindValue(':scl_tip_tip_value', dbGetParameterValue($parameters, 'scl_tip_tip_value'));
		$stmt->bindValue(':scl_tip_tip_units', dbGetParameterValue($parameters, 'scl_tip_tip_units'));
		$stmt->bindValue(':scw_value', dbGetParameterValue($parameters, 'scw_value'));
		$stmt->bindValue(':scw_units', dbGetParameterValue($parameters, 'scw_units'));
		$stmt->bindValue(':ccl_notch_notch_value', dbGetParameterValue($parameters, 'ccl_notch_notch_value'));
		$stmt->bindValue(':ccl_notch_notch_units', dbGetParameterValue($parameters, 'ccl_notch_notch_units'));
		$stmt->bindValue(':ccl_notch_tip_value', dbGetParameterValue($parameters, 'ccl_notch_tip_value'));
		$stmt->bindValue(':ccl_notch_tip_units', dbGetParameterValue($parameters, 'ccl_notch_tip_units'));
		$stmt->bindValue(':ccl_tip_tip_value', dbGetParameterValue($parameters, 'ccl_tip_tip_value'));
		$stmt->bindValue(':ccl_tip_tip_units', dbGetParameterValue($parameters, 'ccl_tip_tip_units'));
		$stmt->bindValue(':ccw_value', dbGetParameterValue($parameters, 'ccw_value'));
		$stmt->bindValue(':ccw_units', dbGetParameterValue($parameters, 'ccw_units'));
		$stmt->bindValue(':weight_value', dbGetParameterValue($parameters, 'weight_value'));
		$stmt->bindValue(':weight_units', dbGetParameterValue($parameters, 'weight_units'));

		$stmt->execute();
	}
	else if ($verb == 'DELETE')
	{
		$sql = 'DELETE FROM turtle_morphometric WHERE turtle_morphometric_id = :turtle_morphometric_id';
		$stmt = $db->prepare($sql);
		$stmt->bindValue(':turtle_morphometric_id', $parameters['turtle_morphometric_id']);
		$stmt->execute();
	}

?>