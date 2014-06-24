<?php
	header('Content-Type: application/json');
	require_once('util.php');
	require_once('db.php');
	session_start(); 
	if (!utilIsSessionValid()) { header('Location: /rosterweb/'); exit(0); }
	
	function fillItem($row)
	{
		$item['organization_id'] = $row['organization_id'];
		$item['organization_name'] = $row['organization_name'];
		$item['address_1'] = $row['address_1'];
		$item['address_2'] = $row['address_2'];
		$item['city'] = $row['city'];
		$item['state'] = $row['state'];
		$item['zip_code'] = $row['zip_code'];
		$item['phone'] = $row['phone'];
		$item['fax'] = $row['fax'];
		$item['email_address'] = $row['email_address'];
		$item['permit_number'] = $row['permit_number'];
		$item['contact_name'] = $row['contact_name'];
		$item['hatchling_balance_as_of_date'] = $row['hatchling_balance_as_of_date'];
		$item['cc_hatchling_starting_balance'] = dbIntOrNull($row['cc_hatchling_starting_balance']);
		$item['cm_hatchling_starting_balance'] = dbIntOrNull($row['cm_hatchling_starting_balance']);
		$item['dc_hatchling_starting_balance'] = dbIntOrNull($row['dc_hatchling_starting_balance']);
		$item['other_hatchling_starting_balance'] = dbIntOrNull($row['other_hatchling_starting_balance']);
		$item['unknown_hatchling_starting_balance'] = dbIntOrNull($row['unknown_hatchling_starting_balance']);
		$item['preferred_units_type'] = $row['preferred_units_type'];
		$item['washback_balance_as_of_date'] = $row['washback_balance_as_of_date'];
		$item['cc_washback_starting_balance'] = dbIntOrNull($row['cc_washback_starting_balance']);
		$item['cm_washback_starting_balance'] = dbIntOrNull($row['cm_washback_starting_balance']);
		$item['dc_washback_starting_balance'] = dbIntOrNull($row['dc_washback_starting_balance']);
		$item['other_washback_starting_balance'] = dbIntOrNull($row['other_washback_starting_balance']);
		$item['unknown_washback_starting_balance'] = dbIntOrNull($row['unknown_washback_starting_balance']);
		
		return $item;
	}
	
	//--------------------------------------------------------------------------------
	//-- get HTTP request stuff
	//--------------------------------------------------------------------------------
	$verb = strtoupper($_SERVER['REQUEST_METHOD']); 
	utilLog('[organization.php] $verb = ' . $verb);
	$parameters = utilParseHttpParameters();
	
	//--------------------------------------------------------------------------------
	//-- GET /api/organization.php?desc=false&limit=20&offset=0&q=undefined&sort=organization_name
	//-- GET /api/organization.php?organization_id=bdeb0af9-ea19-4b8e-853a-106108e4a14d
	//--------------------------------------------------------------------------------
	if ($verb == 'GET') 
	{
		$items = array();
		
		//--------------------------------------------------------------------------------
		//-- if there is no "organization_id" query string parameter, 
		//-- then this HTTP GET should return ALL items
		//--------------------------------------------------------------------------------
		if (!array_key_exists('organization_id', $parameters))
		{
			$sql = 'SELECT * FROM organization ';
			
			if (array_key_exists('q', $parameters) && ($parameters['q'] != 'undefined'))
			{
				$sql .= 'WHERE organization_name LIKE :search_organization_name ';
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
			if (array_key_exists('q', $parameters) && ($parameters['q'] != 'undefined'))
			{
				$stmt->bindValue(':search_organization_name', '%' . $parameters['q'] .'%');
			}
			$stmt->execute();
 
			while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) 
			{
				$items[] = fillItem($row);
			}

			echo json_encode($items);
		}
		//--------------------------------------------------------------------------------
		//-- else, there is an "organization_id" query string parameter, 
		//-- so this HTTP GET should return the indicated item
		//--------------------------------------------------------------------------------
		else
		{
			$sql = 'SELECT * FROM organization WHERE organization_id = :organization_id';
			$stmt = $db->prepare($sql);
			$stmt->bindValue(':organization_id', $parameters['organization_id']);
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
			$sql .= 'UPDATE organization SET ';
			$sql .= 'organization_name = :organization_name, ';
			$sql .= 'address_1 = :address_1, ';
			$sql .= 'address_2 = :address_2, ';
			$sql .= 'city = :city, ';
			$sql .= 'state = :state, ';
			$sql .= 'zip_code = :zip_code, ';
			$sql .= 'phone = :phone, ';
			$sql .= 'fax = :fax, ';
			$sql .= 'email_address = :email_address, ';
			$sql .= 'permit_number = :permit_number, ';
			$sql .= 'contact_name = :contact_name, ';
			$sql .= 'hatchling_balance_as_of_date = :hatchling_balance_as_of_date, ';
			$sql .= 'cc_hatchling_starting_balance = :cc_hatchling_starting_balance, ';
			$sql .= 'cm_hatchling_starting_balance = :cm_hatchling_starting_balance, ';
			$sql .= 'dc_hatchling_starting_balance = :dc_hatchling_starting_balance, ';
			$sql .= 'other_hatchling_starting_balance = :other_hatchling_starting_balance, ';
			$sql .= 'unknown_hatchling_starting_balance = :unknown_hatchling_starting_balance, ';
			$sql .= 'preferred_units_type = :preferred_units_type, ';
			$sql .= 'washback_balance_as_of_date = :washback_balance_as_of_date, ';
			$sql .= 'cc_washback_starting_balance = :cc_washback_starting_balance, ';
			$sql .= 'cm_washback_starting_balance = :cm_washback_starting_balance, ';
			$sql .= 'dc_washback_starting_balance = :dc_washback_starting_balance, ';
			$sql .= 'other_washback_starting_balance = :other_washback_starting_balance, ';
			$sql .= 'unknown_washback_starting_balance = :unknown_washback_starting_balance ';
			$sql .= 'WHERE organization_id = :organization_id';
		}
		else if ($verb == 'POST')
		{
			$sql .= 'INSERT INTO organization ';
			$sql .= '(organization_id, organization_name, address_1, address_2, city, state, zip_code, phone, fax, email_address, permit_number, contact_name, hatchling_balance_as_of_date, cc_hatchling_starting_balance, cm_hatchling_starting_balance, dc_hatchling_starting_balance, other_hatchling_starting_balance, unknown_hatchling_starting_balance, preferred_units_type, washback_balance_as_of_date, cc_washback_starting_balance, cm_washback_starting_balance, dc_washback_starting_balance, other_washback_starting_balance, unknown_washback_starting_balance) ';
			$sql .= 'VALUES ';
			$sql .= '(:organization_id, :organization_name, :address_1, :address_2, :city, :state, :zip_code, :phone, :fax, :email_address, :permit_number, :contact_name, :hatchling_balance_as_of_date, :cc_hatchling_starting_balance, :cm_hatchling_starting_balance, :dc_hatchling_starting_balance, :other_hatchling_starting_balance, :unknown_hatchling_starting_balance, :preferred_units_type, :washback_balance_as_of_date, :cc_washback_starting_balance, :cm_washback_starting_balance, :dc_washback_starting_balance, :other_washback_starting_balance, :unknown_washback_starting_balance) ';
		}
		$stmt = $db->prepare($sql);
		
		$stmt->bindValue(':organization_id', dbGetParameterValue($parameters, 'organization_id'));
		$stmt->bindValue(':organization_name', dbGetParameterValue($parameters, 'organization_name'));
		$stmt->bindValue(':address_1', dbGetParameterValue($parameters, 'address_1'));
		$stmt->bindValue(':address_2', dbGetParameterValue($parameters, 'address_2'));
		$stmt->bindValue(':city', dbGetParameterValue($parameters, 'city'));
		$stmt->bindValue(':state', dbGetParameterValue($parameters, 'state'));
		$stmt->bindValue(':zip_code', dbGetParameterValue($parameters, 'zip_code'));
		$stmt->bindValue(':phone', dbGetParameterValue($parameters, 'phone'));
		$stmt->bindValue(':fax', dbGetParameterValue($parameters, 'fax'));
		$stmt->bindValue(':email_address', dbGetParameterValue($parameters, 'email_address'));
		$stmt->bindValue(':permit_number', dbGetParameterValue($parameters, 'permit_number'));
		$stmt->bindValue(':contact_name', dbGetParameterValue($parameters, 'contact_name'));
		$stmt->bindValue(':hatchling_balance_as_of_date', dbGetParameterDate($parameters, 'hatchling_balance_as_of_date'));
		$stmt->bindValue(':cc_hatchling_starting_balance', dbGetParameterValue($parameters, 'cc_hatchling_starting_balance'));
		$stmt->bindValue(':cm_hatchling_starting_balance', dbGetParameterValue($parameters, 'cm_hatchling_starting_balance'));
		$stmt->bindValue(':dc_hatchling_starting_balance', dbGetParameterValue($parameters, 'dc_hatchling_starting_balance'));
		$stmt->bindValue(':other_hatchling_starting_balance', dbGetParameterValue($parameters, 'other_hatchling_starting_balance'));
		$stmt->bindValue(':unknown_hatchling_starting_balance', dbGetParameterValue($parameters, 'unknown_hatchling_starting_balance'));
		$stmt->bindValue(':preferred_units_type', dbGetParameterValue($parameters, 'preferred_units_type'));
		$stmt->bindValue(':washback_balance_as_of_date', dbGetParameterDate($parameters, 'washback_balance_as_of_date'));
		$stmt->bindValue(':cc_washback_starting_balance', dbGetParameterValue($parameters, 'cc_washback_starting_balance'));
		$stmt->bindValue(':cm_washback_starting_balance', dbGetParameterValue($parameters, 'cm_washback_starting_balance'));
		$stmt->bindValue(':dc_washback_starting_balance', dbGetParameterValue($parameters, 'dc_washback_starting_balance'));
		$stmt->bindValue(':other_washback_starting_balance', dbGetParameterValue($parameters, 'other_washback_starting_balance'));
		$stmt->bindValue(':unknown_washback_starting_balance', dbGetParameterValue($parameters, 'unknown_washback_starting_balance'));

		$stmt->execute();
	}
	else if ($verb == 'DELETE')
	{
		$sql = 'DELETE FROM organization WHERE organization_id = :organization_id';
		$stmt = $db->prepare($sql);
		$stmt->bindValue(':organization_id', $parameters['organization_id']);
		$stmt->execute();
	}

?>