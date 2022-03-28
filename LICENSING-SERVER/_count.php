<?php
$secret = htmlspecialchars($_GET['secret']);

if($secret=='montypythonrocks'){
	$db = new SQLite3('serials.db');
	$result = $db->query("select * from serials");
	$nrows = 0;
	$result->reset();
	while ($result->fetchArray())
		$nrows++;
	$result->reset();
	echo $nrows;
} else {echo "error";}