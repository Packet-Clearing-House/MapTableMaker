<?php
require_once ('./MapTableMaker.php');
MapTableMaker::outputCSV();
MapTableMaker::outtputSVG();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">

    <title>MapTableMaker</title>

    <?php echo MapTableMaker::getIncludes() ?>
</head>
<body>

<?php echo MapTableMaker::getIntroText(); ?>
<?php echo MapTableMaker::getInstructionsAndForm(); ?>
<?php echo MapTableMaker::getHtmlPlaceholder() ?>

<script src='./js/MapTableMaker.js'></script>

</body>
</html>