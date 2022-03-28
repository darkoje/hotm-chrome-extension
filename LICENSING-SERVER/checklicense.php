<?php 

include('./includes/securityfunctions.php');

//ALLOW ACCESS FROM EXTENSION'S JS
header('Access-Control-Allow-Origin: *');

//URL PARAMETERS
$monty = htmlspecialchars($_GET['monty']);
$python = htmlspecialchars($_GET['python']);

//DECIPHER AND CHECK STATUS
$serial = Decipher($monty);
$activation = Decipher($python);

//OPEN DB
$db = new SQLite3('serials.db');

//READ LICENSE STATUS
$status = $db->querySingle("SELECT status FROM serials WHERE serial='$serial' and activation='$activation'");

echo $status;

//CLOSE DB
$db->close();