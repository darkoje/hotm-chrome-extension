<?php include('./includes/securityfunctions.php');

//URL PARAMETER
$monty = htmlspecialchars($_GET['monty']);

//DECIPHER
$serial = Decipher($monty);

//ADD TO DB
$db = new SQLite3('serials.db');
$db->exec("insert into serials (serial, status) values ('$serial', 'ready')") ;
$status = $db->querySingle("select status from serials where serial='$serial'");
if($status=='ready'){
	echo "success";
} else {echo "error";}
$db->close();
