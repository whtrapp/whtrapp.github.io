<?php
// Load the API key from a configuration file outside the web root directory
$file_path = "../apikey.txt";
if (!file_exists($file_path)) {
  die("API key not found");
}
$api_key = file_get_contents($file_path);

// Return the API key as a JSON object
header('Content-Type: application/json');
echo json_encode(array('api_key' => $api_key));
?>
