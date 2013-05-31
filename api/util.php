<?php
	require_once('chromephp.php');
	
	function utilLog() 
	{
		$args = func_get_args();
	 
		if ( 1 == count( $args ) )
			ChromePhp::log( $args[0] );
		else
			ChromePhp::log( $args[1], $args[1] );
	};

	function utilCreateGuid()
	{
		if (function_exists('com_create_guid'))
		{
			return strtolower(trim(com_create_guid(), '{}'));
		}
		else
		{
			mt_srand((double)microtime()*10000);//optional for php 4.2.0 and up.
			$charid = strtoupper(md5(uniqid(rand(), true)));
			$hyphen = chr(45);// "-"
			$uuid = substr($charid, 0, 8).$hyphen
				.substr($charid, 8, 4).$hyphen
				.substr($charid,12, 4).$hyphen
				.substr($charid,16, 4).$hyphen
				.substr($charid,20,12);

			return strtolower($uuid);
		}
	}
	
	function utilParseHttpParameters() 
	{
        $parameters = array();
 
		//--------------------------------------------------------------------------------
        //-- first, parse the GET parameters
		//--------------------------------------------------------------------------------
        if (isset($_SERVER['QUERY_STRING'])) 
		{
            parse_str($_SERVER['QUERY_STRING'], $parameters);
        }
 
		//--------------------------------------------------------------------------------
		//-- now try PUT/POST bodies; these override anything we parse from GET
		//--------------------------------------------------------------------------------
		$body = file_get_contents("php://input");
		
		$body_params = json_decode($body);
		if($body_params) 
		{
			foreach($body_params as $param_name => $param_value) 
			{
				$parameters[$param_name] = $param_value;
			}
		}
		
        return $parameters;
    }

	function utilSortBySubkey(&$array, $subkey, $sortType = SORT_ASC) 
	{
		//--------------------------------------------------------------------------------
		//-- USAGE:
		//--------------------------------------------------------------------------------
		// $sortType = SORT_ASC;
		// if ($parameters['desc'] == 'true')
		// {
		// 		$sortType = SORT_DESC;
		// }
		// utilSortBySubkey($items, 'organization_name', $sortType);
		//--------------------------------------------------------------------------------

		foreach ($array as $subarray) 
		{
			$keys[] = $subarray[$subkey];
		}
		array_multisort($keys, $sortType, $array);
	}

	/**
	 * Logs messages/variables/data to browser console from within php
	 *
	 * @param $name: message to be shown for optional data/vars
	 * @param $data: variable (scalar/mixed) arrays/objects, etc to be logged
	 * @param $jsEval: whether to apply JS eval() to arrays/objects
	 *
	 * @return none
	 * @author Sarfraz
	 */
	//logConsole('$name var', $name, true);
	//logConsole('An array of fruits', $fruits, true);
	//logConsole('$user object', $user, true);
	function utilLogConsole($name, $data = NULL, $jsEval = FALSE)
	{
		if (! $name) return false;

		$isevaled = false;
		$type = ($data || gettype($data)) ? 'Type: ' . gettype($data) : '';

		if ($jsEval && (is_array($data) || is_object($data)))
		{
			$data = 'eval(' . preg_replace('#[\s\r\n\t\0\x0B]+#', '', json_encode($data)) . ')';
			$isevaled = true;
		}
		else
		{
			$data = json_encode($data);
		}

		# sanitalize
		$data = $data ? $data : '';
		$search_array = array("#'#", '#""#', "#''#", "#\n#", "#\r\n#");
		$replace_array = array('"', '', '', '\\n', '\\n');
		$data = preg_replace($search_array,  $replace_array, $data);
		$data = ltrim(rtrim($data, '"'), '"');
		$data = $isevaled ? $data : ($data[0] === "'") ? $data : "'" . $data . "'";

		$js = '
		\n<script>
			// fallback - to deal with IE (or browsers that do not have console)
			if (! window.console) console = {};
			console.log = console.log || function(name, data){};
			// end of fallback

			console.log(\'$name\');
			console.log(\'------------------------------------------\');
			console.log(\'$type\');
			console.log($data);
			console.log(\'\\n\');
		</script>
		';
		echo $js;
	}
 
	function utilGetFingerprint()
	{
		//-- must only get first part of User-Agent as sometimes PHP only gets the first bit anyway?...ugh...sometimes it is not there at all...
		//return md5('969CA064-57EC-4ECF-92C4-AB4EEF46B461' . substr($_SERVER['HTTP_USER_AGENT'], 0, 32) . session_id());
		//-- the above is broken...the below is worthless...actually, it is all worthless outside of HTTPS...but I was trying to make it a bit harder...
		return md5('969CA064-57EC-4ECF-92C4-AB4EEF46B461' . session_id());
	}
	
	function utilIsSessionValid()
	{
		if ((isset($_SESSION['fingerprint'])) &&(utilGetFingerprint() == $_SESSION['fingerprint']) && (isset($_SESSION['is_logged_in'])) && ($_SESSION['is_logged_in'] == 'true'))
		{
			return true;
		}
		else
		{
			return false;
		}
	}
?>