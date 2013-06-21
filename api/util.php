<?php
	require_once('chromephp.php');
	
	$utilUploadsBrochureImagesUriPath = '/rosterweb/uploads/brochure_images';
	$utilUploadsBrochureImagesRelPath = '../uploads/brochure_images';
	$utilUploadsAttachmentsUriPath = '/rosterweb/uploads/attachments';
	$utilUploadsAttachmentsRelPath = '../uploads/attachments';

	function utilArraySortByColumn(&$arr, $col, $dir = SORT_ASC) 
	{
		$sort_col = array();
		foreach ($arr as $key=> $row) {
			$sort_col[$key] = $row[$col];
		}
		array_multisort($sort_col, $dir, $arr);
	}

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
	
	function utilGetFingerprint()
	{
		//-- must only get first part of User-Agent as sometimes PHP only gets the first bit anyway?...ugh...sometimes it is not there at all...
		//return md5('969CA064-57EC-4ECF-92C4-AB4EEF46B461' . substr($_SERVER['HTTP_USER_AGENT'], 0, 32) . session_id());
		//-- the above is broken...the below is worthless...actually, it is all worthless outside of HTTPS...but I was trying to make it a bit harder...
		return md5('969CA064-57EC-4ECF-92C4-AB4EEF46B461' . session_id());
	}

	function utilGetPhpFileUploadErrorMessage($code) 
    { 
        switch ($code) { 
            case UPLOAD_ERR_INI_SIZE: 
                $message = "The uploaded file exceeds the upload_max_filesize directive in php.ini"; 
                break; 
            case UPLOAD_ERR_FORM_SIZE: 
                $message = "The uploaded file exceeds the MAX_FILE_SIZE directive that was specified in the HTML form"; 
                break; 
            case UPLOAD_ERR_PARTIAL: 
                $message = "The uploaded file was only partially uploaded"; 
                break; 
            case UPLOAD_ERR_NO_FILE: 
                $message = "No file was uploaded"; 
                break; 
            case UPLOAD_ERR_NO_TMP_DIR: 
                $message = "Missing a temporary folder"; 
                break; 
            case UPLOAD_ERR_CANT_WRITE: 
                $message = "Failed to write file to disk"; 
                break; 
            case UPLOAD_ERR_EXTENSION: 
                $message = "File upload stopped by extension"; 
                break; 

            default: 
                $message = "Unknown upload error"; 
                break; 
        } 
        return $message; 
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

	function utilLog() 
	{
		$args = func_get_args();
	 
		if ( 1 == count( $args ) )
			ChromePhp::log( $args[0] );
		else
			ChromePhp::log( $args[1], $args[1] );
	};

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

?>