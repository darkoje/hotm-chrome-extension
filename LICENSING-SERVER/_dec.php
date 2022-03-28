<?php 
include('./includes/securityfunctions.php');

//URL PARAMETER
$monty = htmlspecialchars($_GET['enciphered']);

//DECIPHER
echo Decipher($monty);