<?php

	//--------------------------------------------------------------------------------
	//-- initialize database connection
	//--------------------------------------------------------------------------------
	$db = new PDO('mysql:host=localhost;dbname=turtlege_rosterwebdb', 'turtlege_rwuser', 'abc.123.PDQ');

	//--------------------------------------------------------------------------------
	//-- set the default timezone for PHP
	//--------------------------------------------------------------------------------
	date_default_timezone_set('UTC');

	//--------------------------------------------------------------------------------
	//-- wrapper to prevent "PHP Notice: Undefined index:" message when getting input parameters
	//--------------------------------------------------------------------------------
	function dbGetParameterValue($parameters, $name)
	{
		if (isset($parameters[$name]))
		{
			return $parameters[$name];
		}
		else
		{
			return null;
		}
	}	

	function dbGetParameterDate($parameters, $name)
	{
		$value = dbGetParameterValue($parameters, $name);
		
		if ($value != null)
		{
			//-- receiving dates like '2013-05-01T00:00:00.000Z', which MySQL does NOT like, so re-formatting... 
			$value = date_format(date_create($value), 'Y-m-d');
		}
		
		return $value;
	}	

	function dbGetParameterBoolean($parameters, $name)
	{
		$value = dbGetParameterValue($parameters, $name);
		
		if ($value != null)
		{
			if ($value == true)
			{
				$value = 'Y';
			}
			else
			{
				$value = 'N';
			}
		}
		else
		{
			$value = 'N';
		}
		
		return $value;
	}	

	function dbGetParameterFloat($parameters, $name, $decimals = 0)
	{
		$value = dbGetParameterValue($parameters, $name);
	
		return dbFloatOrNull($value, $decimals);
	}

	function dbGetParameterInt($parameters, $name)
	{
		$value = dbGetParameterValue($parameters, $name);
	
		return dbIntOrNull($value);
	}

	function dbDateOnly($value)
	{
		if ($value != null)
		{
			//-- retrieving dates like '2013-05-01 00:00:00', which JavaScript datepicker does NOT like, so re-formatting... 
			$value = date_format(date_create($value), 'Y-m-d');
		}
		
		return $value;
	}	

	function dbFloatOrNull($value, $decimals = 0)
	{
		if (($value == null) || !(is_numeric($value)))
		{
			return null;
		}
		else
		{
			return number_format((float)$value, $decimals);
		}
	}	

	function dbIntOrNull($value)
	{
		if (($value == null) || !(is_int($value)))
		{
			return null;
		}
		else
		{
			return (int)$value;
		}
	}	

	function dbYNtoBoolean($value)
	{
		if ($value == null) { return false; }
		
		$value = strtoupper($value);
		if ($value == 'Y')
		{
			return true;
		}
		else
		{
			return false;
		}
	}	
?>