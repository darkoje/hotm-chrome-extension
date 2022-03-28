<?php

include('./includes/securityfunctions.php');

$secret = htmlspecialchars($_GET['secret']);

$timenow = strtotime('now');

if($secret=='montypythonrocks'){
	$db = new SQLite3('serials.db');
	$query = $db->query("select enddate from serials where enddate > 0");
	$firstRow = false;
	while ($row = $query->fetchArray(SQLITE3_ASSOC)) {
		if ($firstRow) {
			foreach ($row as $key => $value) {
			}
			$firstRow = false;
		}
		foreach ($row as $value) {
			$expiration = strtotime($value);
			$timeremaining = $expiration - $timenow;
			if ($timeremaining < 0){$db->exec("update serials set status='expired' where enddate='$value'") or die('error');}
		}
	}
} else {echo "error";}

echo "success";

//CLOSE DB
$db->close();
