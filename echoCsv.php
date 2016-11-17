<?php
/**
 * Simple script to echo back CSV from urlEncoded() data
 */
header("Cache-Control: must-revalidate, post-check=0, pre-check=0");
header('Content-Description: File Transfer');
header("Content-type: text/csv");
header("Content-Disposition: attachment; filename=echoCsv.csv");
header("Expires: 0");
header("Pragma: public");
print "country,value\n";
if (!empty($_GET['csv'])) {
    print htmlspecialchars(urldecode($_GET['csv']), ENT_QUOTES, 'UTF-8');
}