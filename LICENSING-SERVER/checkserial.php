<?php 

header('Access-Control-Allow-Origin: *');


include('./includes/securityfunctions.php');

//PARAMETER VARIABLE
$monty = htmlspecialchars($_GET['monty']);

//DECYPHER AND CHECK SERIAL STATUS
$serial = Decipher($monty);
$db = new SQLite3('serials.db');
echo $db->querySingle("SELECT status FROM serials WHERE serial='$serial'");
$db->close();
