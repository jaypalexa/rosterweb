<?php
	require_once('util.php');
	session_start(); 
	if (!utilIsSessionValid()) { header('Location: /rosterweb/'); exit(0); }

	if(isset($_FILES['uploadfile'])) {
	
		if ($_FILES['uploadfile']['error'] == UPLOAD_ERR_OK) {

			//-- permitted file extensions
			$allowed = array('gif', 'jpg', 'jpeg', 'png');

			$baseFileName = $_FILES['uploadfile']['name'];
			$extension = pathinfo($baseFileName, PATHINFO_EXTENSION);

			//utilLog('[upload_brochure_image.php] $extension = ' . $extension);

			if (!in_array(strtolower($extension), $allowed)) {
				header('HTTP/1.1 415 Unsupported Media Type', true, 415); 
				echo 'Allowed file types: gif, jpg, png';
				exit;
			}

			$turtleId = $_REQUEST['turtle_id'];
		  
			$tmpFileName = $_FILES['uploadfile']['tmp_name'];
			//$fileType = $_FILES['uploadfile']['type'];
			//$fileContent = file_get_contents($tmpFileName);
			//$dataUrl = 'data:' . $fileType . ';base64,' . chunk_split(base64_encode($fileContent));
			
			$uriPath = '/rosterweb/uploads/brochure_images';
			$relPath = '../uploads/brochure_images';
			$permBaseFileName = $turtleId . '-' . $baseFileName;
			$permFileName = $relPath . '/' . $permBaseFileName;
			
			//utilLog('[upload_brochure_image.php] $permFileName = ' . $permFileName);

			if (move_uploaded_file($tmpFileName, $permFileName)) {
				//echo $dataUrl;
				echo $uriPath . '/' . $permBaseFileName;
				exit;
			}
		} else {
			header('HTTP/1.1 500 Internal Server Error', true, 500); 
			echo codeToMessage($_FILES['uploadfile']['error']);
			exit;
		}
	}

	function codeToMessage($code) 
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

?>
