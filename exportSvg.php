<?php
if(empty($_POST['data'])) {
  echo "Empty data";
}
else{
  header("Content-type: image/svg+xml");
  header('Content-Disposition: attachment; filename="MapTableMaker.'.date("m.d.y").'-'.rand(10000,99999).'.svg"');
  echo $_POST['data'];
}
?>
