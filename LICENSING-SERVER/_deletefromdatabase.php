<?php
include('./includes/securityfunctions.php');
$monty = htmlspecialchars($_GET['monty']);
$serial = Decipher($monty);
$db = new SQLite3('serials.db');
$db->exec("DELETE FROM serials WHERE serial='$serial'") or die('null');
echo "success";
$db->close();
