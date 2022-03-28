<?php include('./includes/securityfunctions.php');

$monty = htmlspecialchars($_GET['monty']);
$serial = Decipher($monty);

if( date('d') == 31 || (date('m') == 1 && date('d') > 28)){
    $expiration = strtotime('last day of next month');
} else {
    $expiration = strtotime('+1 months');
}
$enddate = date('d-m-Y', $expiration);

$db = new Sqlite3('serials.db');
$db->exec("UPDATE serials SET enddate='$enddate', status='activated' WHERE serial='$serial' and enddate IS NOT NULL");
$status = $db->querySingle("select enddate from serials where serial='$serial'");
if($status==$enddate){
	echo "success";
} else {echo "error";}
$db->close();

