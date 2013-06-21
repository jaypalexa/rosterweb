<?php
	require_once('util.php');
	session_start(); 
	if (!utilIsSessionValid()) { header('Location: /rosterweb/'); exit(0); }

	if(isset($_FILES['uploadfiles'])) {
	
		if ($_FILES['uploadfiles']['error'] == UPLOAD_ERR_OK) {

			$parameters = utilParseHttpParameters();
			$turtleId = $parameters['turtle_id'];
			
			$baseFileName = $_FILES['uploadfiles']['name'];
			$extension = pathinfo($baseFileName, PATHINFO_EXTENSION);
		  
			$tmpFileName = $_FILES['uploadfiles']['tmp_name'];
			
			$permBaseFileName = $turtleId . '-' . $baseFileName;
			$permFileName = $utilUploadsAttachmentsRelPath . '/' . $permBaseFileName;
			
			//utilLog('[upload_brochure_image.php] $permFileName = ' . $permFileName);

			if (move_uploaded_file($tmpFileName, $permFileName)) {
				echo $utilUploadsAttachmentsUriPath . '/' . $permBaseFileName;
				exit;
			}
		} else {
			header('HTTP/1.1 500 Internal Server Error', true, 500); 
			echo utilGetPhpFileUploadErrorMessage($_FILES['uploadfiles']['error']);
			exit;
		}
	}
	else
	{
		utilLog('[turtle_attachment_upload_files.php] isset($_FILES[\'uploadfiles\']) = FALSE');
	}

?>
