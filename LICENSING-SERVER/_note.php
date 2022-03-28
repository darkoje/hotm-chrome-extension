<?php include('./includes/securityfunctions.php');

$monty = htmlspecialchars($_GET['monty']);
$note = htmlspecialchars($_GET['note']);
$serial = Decipher($monty);
$notek = Decipher($note);


$db = new Sqlite3('serials.db');
$db->exec("UPDATE serials SET note='$notek' WHERE serial='$serial'");
$db->close();

