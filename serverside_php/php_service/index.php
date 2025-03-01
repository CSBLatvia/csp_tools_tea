<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
header("Content-Type:application/json");
header("Access-Control-Allow-Origin: *");


include("app/controller.php");
include("app/status_codes.php");

$start = new Controller();

?>


