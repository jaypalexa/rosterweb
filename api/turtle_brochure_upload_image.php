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
			
			$permBaseFileName = $turtleId . '-' . $baseFileName;
			$permFileName = $utilUploadsBrochureImagesRelPath . '/' . $permBaseFileName;
			
			//utilLog('[upload_brochure_image.php] $permFileName = ' . $permFileName);

			if (move_uploaded_file($tmpFileName, $permFileName)) {
				//echo $dataUrl;
				echo $utilUploadsBrochureImagesUriPath . '/' . $permBaseFileName;
				exit;
			}
		} else {
			header('HTTP/1.1 500 Internal Server Error', true, 500); 
			echo utilGetPhpFileUploadErrorMessage($_FILES['uploadfile']['error']);
			exit;
		}
	}

?>
