<?php
	header('Content-Type: application/json');
	require_once('util.php');
	require_once('db.php');
	session_start(); 
	if (!utilIsSessionValid()) { header('Location: /rosterweb/'); exit(0); }
	
	function fillItem($row)
	{
		$item['turtle_id'] = $row['turtle_id'];
		$item['organization_id'] = $row['organization_id'];
		$item['turtle_name'] = $row['turtle_name'];
		$item['sid_number'] = $row['sid_number'];
		$item['stranding_id_number'] = $row['stranding_id_number'];
		$item['species'] = $row['species'];
		$item['turtle_size'] = $row['turtle_size'];
		$item['status'] = $row['status'];
		$item['date_captured'] = dbDateOnly($row['date_captured']);
		$item['date_acquired'] = dbDateOnly($row['date_acquired']);
		$item['acquired_from'] = $row['acquired_from'];
		$item['acquired_county'] = $row['acquired_county'];
		$item['acquired_latitude'] = $row['acquired_latitude'];
		$item['acquired_longitude'] = $row['acquired_longitude'];
		$item['date_relinquished'] = dbDateOnly($row['date_relinquished']);
		$item['relinquished_to'] = $row['relinquished_to'];
		$item['relinquished_county'] = $row['relinquished_county'];
		$item['relinquished_latitude'] = $row['relinquished_latitude'];
		$item['relinquished_longitude'] = $row['relinquished_longitude'];
		$item['anomalies'] = $row['anomalies'];
		$item['injury_boat_strike'] = dbYNtoBoolean($row['injury_boat_strike']);
		$item['injury_intestinal_impaction'] = dbYNtoBoolean($row['injury_intestinal_impaction']);
		$item['injury_line_entanglement'] = dbYNtoBoolean($row['injury_line_entanglement']);
		$item['injury_fish_hook'] = dbYNtoBoolean($row['injury_fish_hook']);
		$item['injury_upper_respiratory'] = dbYNtoBoolean($row['injury_upper_respiratory']);
		$item['injury_animal_bite'] = dbYNtoBoolean($row['injury_animal_bite']);
		$item['injury_fibropapilloma'] = dbYNtoBoolean($row['injury_fibropapilloma']);
		$item['injury_misc_epidemic'] = dbYNtoBoolean($row['injury_misc_epidemic']);
		$item['injury_doa'] = dbYNtoBoolean($row['injury_doa']);
		$item['injury_other'] = dbYNtoBoolean($row['injury_other']);
		$item['was_carrying_tags_when_enc'] = dbYNtoBoolean($row['was_carrying_tags_when_enc']);
		$item['recapture_type'] = $row['recapture_type'];
		$item['tag_return_address'] = $row['tag_return_address'];
		$item['capture_project_type'] = $row['capture_project_type'];
		$item['did_turtle_nest'] = $row['did_turtle_nest'];
		$item['capture_project_other'] = $row['capture_project_other'];
		$item['inspected_for_tag_scars'] = dbYNtoBoolean($row['inspected_for_tag_scars']);
		$item['tag_scars_located'] = $row['tag_scars_located'];
		$item['scanned_for_pit_tags'] = dbYNtoBoolean($row['scanned_for_pit_tags']);
		$item['pit_tags_scan_frequency'] = $row['pit_tags_scan_frequency'];
		$item['scanned_for_magnetic_wires'] = dbYNtoBoolean($row['scanned_for_magnetic_wires']);
		$item['magnetic_wires_located'] = $row['magnetic_wires_located'];
		$item['inspected_for_living_tags'] = dbYNtoBoolean($row['inspected_for_living_tags']);
		$item['living_tags_located'] = $row['living_tags_located'];
		$item['brochure_comments'] = $row['brochure_comments'];
		$item['brochure_background_color'] = $row['brochure_background_color'];
		$item['brochure_image_file_attachment_id'] = $row['brochure_image_file_attachment_id'];
		
		return $item;
	}
	
	//--------------------------------------------------------------------------------
	//-- get HTTP request stuff
	//--------------------------------------------------------------------------------
	$verb = strtoupper($_SERVER['REQUEST_METHOD']);
	utilLog('[turtle.php] $verb = ' . $verb);
	$parameters = utilParseHttpParameters();
	
	//--------------------------------------------------------------------------------
	//-- GET /api/turtle.php?desc=false&limit=20&offset=0&q=undefined&sort=turtle_name
	//-- GET /api/turtle.php?turtle_id=bdeb0af9-ea19-4b8e-853a-106108e4a14d
	//--------------------------------------------------------------------------------
	if ($verb == 'GET') 
	{
		$items = array();
		
		//--------------------------------------------------------------------------------
		//-- if there is no "turtle_id" query string parameter, 
		//-- then this HTTP GET should return ALL items
		//--------------------------------------------------------------------------------
		if (!array_key_exists('turtle_id', $parameters))
		{
			$sql = 'SELECT * FROM turtle ';
			$sql .= 'WHERE organization_id = :organization_id ';
			
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
			$stmt->bindValue(':organization_id', $parameters['organization_id']);
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
		//-- else, there is an "turtle_id" query string parameter, 
		//-- so this HTTP GET should return the indicated item
		//--------------------------------------------------------------------------------
		else
		{
			$sql = 'SELECT * FROM turtle WHERE turtle_id = :turtle_id';
			$stmt = $db->prepare($sql);
			$stmt->bindValue(':turtle_id', $parameters['turtle_id']);
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
			$sql .= 'UPDATE turtle SET ';
			$sql .= 'organization_id = :organization_id, ';
			$sql .= 'turtle_name = :turtle_name, ';
			$sql .= 'sid_number = :sid_number, ';
			$sql .= 'stranding_id_number = :stranding_id_number, ';
			$sql .= 'species = :species, ';
			$sql .= 'turtle_size = :turtle_size, ';
			$sql .= 'status = :status, ';
			$sql .= 'date_captured = :date_captured, ';
			$sql .= 'date_acquired = :date_acquired, ';
			$sql .= 'acquired_county = :acquired_county, ';
			$sql .= 'acquired_from = :acquired_from, ';
			$sql .= 'acquired_latitude = :acquired_latitude, ';
			$sql .= 'acquired_longitude = :acquired_longitude, ';
			$sql .= 'date_relinquished = :date_relinquished, ';
			$sql .= 'relinquished_county = :relinquished_county, ';
			$sql .= 'relinquished_to = :relinquished_to, ';
			$sql .= 'relinquished_latitude = :relinquished_latitude, ';
			$sql .= 'relinquished_longitude = :relinquished_longitude, ';
			$sql .= 'anomalies = :anomalies, ';
			$sql .= 'injury_boat_strike = :injury_boat_strike, ';
			$sql .= 'injury_intestinal_impaction = :injury_intestinal_impaction, ';
			$sql .= 'injury_line_entanglement = :injury_line_entanglement, ';
			$sql .= 'injury_fish_hook = :injury_fish_hook, ';
			$sql .= 'injury_upper_respiratory = :injury_upper_respiratory, ';
			$sql .= 'injury_animal_bite = :injury_animal_bite, ';
			$sql .= 'injury_fibropapilloma = :injury_fibropapilloma, ';
			$sql .= 'injury_misc_epidemic = :injury_misc_epidemic, ';
			$sql .= 'injury_doa = :injury_doa, ';
			$sql .= 'injury_other = :injury_other, ';
			$sql .= 'was_carrying_tags_when_enc = :was_carrying_tags_when_enc, ';
			$sql .= 'recapture_type = :recapture_type, ';
			$sql .= 'tag_return_address = :tag_return_address, ';
			$sql .= 'capture_project_type = :capture_project_type, ';
			$sql .= 'did_turtle_nest = :did_turtle_nest, ';
			$sql .= 'capture_project_other = :capture_project_other, ';
			$sql .= 'inspected_for_tag_scars = :inspected_for_tag_scars, ';
			$sql .= 'tag_scars_located = :tag_scars_located, ';
			$sql .= 'scanned_for_pit_tags = :scanned_for_pit_tags, ';
			$sql .= 'pit_tags_scan_frequency = :pit_tags_scan_frequency, ';
			$sql .= 'scanned_for_magnetic_wires = :scanned_for_magnetic_wires, ';
			$sql .= 'magnetic_wires_located = :magnetic_wires_located, ';
			$sql .= 'inspected_for_living_tags = :inspected_for_living_tags, ';
			$sql .= 'living_tags_located = :living_tags_located, ';
			$sql .= 'brochure_comments = :brochure_comments, ';
			$sql .= 'brochure_background_color = :brochure_background_color, ';
			$sql .= 'brochure_image_file_attachment_id = :brochure_image_file_attachment_id ';
			$sql .= 'WHERE turtle_id = :turtle_id';
		}
		else if ($verb == 'POST')
		{
			$sql .= 'INSERT INTO turtle (';
			$sql .= 'turtle_id, organization_id, turtle_name, sid_number, stranding_id_number, species, turtle_size, status, date_captured, ';
			$sql .= 'date_acquired, acquired_from, acquired_county, acquired_latitude, acquired_longitude, ';
			$sql .= 'date_relinquished, relinquished_to, relinquished_county, relinquished_latitude, relinquished_longitude, anomalies, ';
			$sql .= 'injury_boat_strike, injury_intestinal_impaction, injury_line_entanglement, injury_fish_hook, injury_upper_respiratory, ';
			$sql .= 'injury_animal_bite, injury_fibropapilloma, injury_misc_epidemic, injury_doa, injury_other, ';
			$sql .= 'was_carrying_tags_when_enc, recapture_type, tag_return_address, capture_project_type, did_turtle_nest, capture_project_other, ';
			$sql .= 'inspected_for_tag_scars, tag_scars_located, scanned_for_pit_tags, pit_tags_scan_frequency, ';
			$sql .= 'scanned_for_magnetic_wires, magnetic_wires_located, inspected_for_living_tags, living_tags_located, ';
			$sql .= 'brochure_comments, brochure_background_color, brochure_image_file_attachment_id ';
			$sql .= ') VALUES (';
			$sql .= ':turtle_id, :organization_id, :turtle_name, :sid_number, :stranding_id_number, :species, :turtle_size, :status, :date_captured, ';
			$sql .= ':date_acquired, :acquired_from, :acquired_county, :acquired_latitude, :acquired_longitude, ';
			$sql .= ':date_relinquished, :relinquished_to, :relinquished_county, :relinquished_latitude, :relinquished_longitude, :anomalies, ';
			$sql .= ':injury_boat_strike, :injury_intestinal_impaction, :injury_line_entanglement, :injury_fish_hook, :injury_upper_respiratory, ';
			$sql .= ':injury_animal_bite, :injury_fibropapilloma, :injury_misc_epidemic, :injury_doa, :injury_other, ';
			$sql .= ':was_carrying_tags_when_enc, :recapture_type, :tag_return_address, :capture_project_type, :did_turtle_nest, :capture_project_other, ';
			$sql .= ':inspected_for_tag_scars, :tag_scars_located, :scanned_for_pit_tags, :pit_tags_scan_frequency, ';
			$sql .= ':scanned_for_magnetic_wires, :magnetic_wires_located, :inspected_for_living_tags, :living_tags_located, ';
			$sql .= ':brochure_comments, :brochure_background_color, :brochure_image_file_attachment_id ';
			$sql .= ') ';
		}
		$stmt = $db->prepare($sql);
		
		$stmt->bindValue(':turtle_id', dbGetParameterValue($parameters, 'turtle_id'));
		$stmt->bindValue(':organization_id', dbGetParameterValue($parameters, 'organization_id'));
		$stmt->bindValue(':turtle_name', dbGetParameterValue($parameters, 'turtle_name'));
		$stmt->bindValue(':sid_number', dbGetParameterValue($parameters, 'sid_number'));
		$stmt->bindValue(':stranding_id_number', dbGetParameterValue($parameters, 'stranding_id_number'));
		$stmt->bindValue(':species', dbGetParameterValue($parameters, 'species'));
		$stmt->bindValue(':turtle_size', dbGetParameterValue($parameters, 'turtle_size'));
		$stmt->bindValue(':status', dbGetParameterValue($parameters, 'status'));
		$stmt->bindValue(':date_captured', dbGetParameterDate($parameters, 'date_captured'));
		$stmt->bindValue(':date_acquired', dbGetParameterDate($parameters, 'date_acquired'));
		$stmt->bindValue(':acquired_from', dbGetParameterValue($parameters, 'acquired_from'));
		$stmt->bindValue(':acquired_county', dbGetParameterValue($parameters, 'acquired_county'));
		$stmt->bindValue(':acquired_latitude', dbGetParameterValue($parameters, 'acquired_latitude'));
		$stmt->bindValue(':acquired_longitude', dbGetParameterValue($parameters, 'acquired_longitude'));
		$stmt->bindValue(':date_relinquished', dbGetParameterDate($parameters, 'date_relinquished'));
		$stmt->bindValue(':relinquished_to', dbGetParameterValue($parameters, 'relinquished_to'));
		$stmt->bindValue(':relinquished_county', dbGetParameterValue($parameters, 'relinquished_county'));
		$stmt->bindValue(':relinquished_latitude', dbGetParameterValue($parameters, 'relinquished_latitude'));
		$stmt->bindValue(':relinquished_longitude', dbGetParameterValue($parameters, 'relinquished_longitude'));
		$stmt->bindValue(':anomalies', dbGetParameterValue($parameters, 'anomalies'));
		$stmt->bindValue(':injury_boat_strike', dbGetParameterBoolean($parameters, 'injury_boat_strike'));
		$stmt->bindValue(':injury_intestinal_impaction', dbGetParameterBoolean($parameters, 'injury_intestinal_impaction'));
		$stmt->bindValue(':injury_line_entanglement', dbGetParameterBoolean($parameters, 'injury_line_entanglement'));
		$stmt->bindValue(':injury_fish_hook', dbGetParameterBoolean($parameters, 'injury_fish_hook'));
		$stmt->bindValue(':injury_upper_respiratory', dbGetParameterBoolean($parameters, 'injury_upper_respiratory'));
		$stmt->bindValue(':injury_animal_bite', dbGetParameterBoolean($parameters, 'injury_animal_bite'));
		$stmt->bindValue(':injury_fibropapilloma', dbGetParameterBoolean($parameters, 'injury_fibropapilloma'));
		$stmt->bindValue(':injury_misc_epidemic', dbGetParameterBoolean($parameters, 'injury_misc_epidemic'));
		$stmt->bindValue(':injury_doa', dbGetParameterBoolean($parameters, 'injury_doa'));
		$stmt->bindValue(':injury_other', dbGetParameterBoolean($parameters, 'injury_other'));
		$stmt->bindValue(':was_carrying_tags_when_enc', dbGetParameterBoolean($parameters, 'was_carrying_tags_when_enc'));
		$stmt->bindValue(':recapture_type', dbGetParameterValue($parameters, 'recapture_type'));
		$stmt->bindValue(':tag_return_address', dbGetParameterValue($parameters, 'tag_return_address'));
		$stmt->bindValue(':capture_project_type', dbGetParameterValue($parameters, 'capture_project_type'));
		$stmt->bindValue(':did_turtle_nest', dbGetParameterValue($parameters, 'did_turtle_nest'));
		$stmt->bindValue(':capture_project_other', dbGetParameterValue($parameters, 'capture_project_other'));
		$stmt->bindValue(':inspected_for_tag_scars', dbGetParameterBoolean($parameters, 'inspected_for_tag_scars'));
		$stmt->bindValue(':tag_scars_located', dbGetParameterValue($parameters, 'tag_scars_located'));
		$stmt->bindValue(':scanned_for_pit_tags', dbGetParameterBoolean($parameters, 'scanned_for_pit_tags'));
		$stmt->bindValue(':pit_tags_scan_frequency', dbGetParameterValue($parameters, 'pit_tags_scan_frequency'));
		$stmt->bindValue(':scanned_for_magnetic_wires', dbGetParameterBoolean($parameters, 'scanned_for_magnetic_wires'));
		$stmt->bindValue(':magnetic_wires_located', dbGetParameterValue($parameters, 'magnetic_wires_located'));
		$stmt->bindValue(':inspected_for_living_tags', dbGetParameterBoolean($parameters, 'inspected_for_living_tags'));
		$stmt->bindValue(':living_tags_located', dbGetParameterValue($parameters, 'living_tags_located'));
		$stmt->bindValue(':brochure_comments', dbGetParameterValue($parameters, 'brochure_comments'));
		$stmt->bindValue(':brochure_background_color', dbGetParameterValue($parameters, 'brochure_background_color'));
		$stmt->bindValue(':brochure_image_file_attachment_id', dbGetParameterValue($parameters, 'brochure_image_file_attachment_id'));

		$stmt->execute();
	}
	else if ($verb == 'DELETE')
	{
		$sql = 'INSERT INTO deleted_turtle_morphometric SELECT * FROM turtle_morphometric WHERE turtle_id = :turtle_id';
		$stmt = $db->prepare($sql);
		$stmt->bindValue(':turtle_id', $parameters['turtle_id']);
		$stmt->execute();
	
		$sql = 'DELETE FROM turtle_morphometric WHERE turtle_id = :turtle_id';
		$stmt = $db->prepare($sql);
		$stmt->bindValue(':turtle_id', $parameters['turtle_id']);
		$stmt->execute();
	
		$sql = 'INSERT INTO deleted_turtle_tag SELECT * FROM turtle_tag WHERE turtle_id = :turtle_id';
		$stmt = $db->prepare($sql);
		$stmt->bindValue(':turtle_id', $parameters['turtle_id']);
		$stmt->execute();
	
		$sql = 'DELETE FROM turtle_tag WHERE turtle_id = :turtle_id';
		$stmt = $db->prepare($sql);
		$stmt->bindValue(':turtle_id', $parameters['turtle_id']);
		$stmt->execute();
	
		$sql = 'INSERT INTO deleted_turtle SELECT * FROM turtle WHERE turtle_id = :turtle_id';
		$stmt = $db->prepare($sql);
		$stmt->bindValue(':turtle_id', $parameters['turtle_id']);
		$stmt->execute();
	
		$sql = 'DELETE FROM turtle WHERE turtle_id = :turtle_id';
		$stmt = $db->prepare($sql);
		$stmt->bindvalue(':turtle_id', $parameters['turtle_id']);
		$stmt->execute();
	}

?>