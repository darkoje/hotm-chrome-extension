<?php include('./includes/securityfunctions.php');

header('Access-Control-Allow-Origin: *');

//URL PARAMETERS
$monty = htmlspecialchars($_GET['monty']);
$python = htmlspecialchars($_GET['python']);

//DECIPHER AND CHECK STATUS
$serial = Decipher($monty);
$activation = Decipher($python);


$expiration = strtotime('+5 years');
$startdate = date('d-m-Y');
$enddate = date('d-m-Y', $expiration);

//OPEN DB
$db = new SQLite3('serials.db');

//CHECK FOR READYNESS
$status = $db->querySingle("select status from serials where serial='$serial'");

//ACTIVATE LICENSE IF READY
if($status=='ready'){
	$db->exec("update serials set activation='$activation', startdate='$startdate', enddate='$enddate', status='activated' where serial='$serial' and activation is null or LENGTH(activation)=0") or die('Activation error');
	echo "success";
} else {echo "not";}

//CLOSE DB
$db->close();
