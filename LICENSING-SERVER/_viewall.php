<?php
$secret = htmlspecialchars($_GET['secret']);

if($secret=='montypythonrocks'){
	$db = new SQLite3('serials.db');
	$query = $db->query("select * from serials");
	$firstRow = true;
	echo '<div class="table-responsive"><table class="table">';
	while ($row = $query->fetchArray(SQLITE3_ASSOC)) {
		if ($firstRow) {
			echo '<thead><tr>';
			foreach ($row as $key => $value) {
				echo '<th>'.$key.'</th>';
			}
			echo '</tr></thead>';
			echo '<tbody>';
			$firstRow = false;
		}

		echo '<tr>';
		foreach ($row as $value) {
			echo '<td>'.$value.'</td>';
		}
		echo '</tr>';
	}
	echo '</tbody>';
	echo '</table></div>';
} else {echo "error";}
