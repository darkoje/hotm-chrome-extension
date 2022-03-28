<?php 
include('./includes/securityfunctions.php');

//URL PARAMETER
$monty = htmlspecialchars($_GET['raw']);

//ENCIPHER
echo Encipher($monty);