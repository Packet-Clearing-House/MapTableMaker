<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">

    <title>MapTableMaker</title>

    <script>

    </script>
    <script src="./js/jquery.js"></script>
    <script src="./js/d3.js"></script>
    <script src="./js/topojson.js"></script>
    <script src="./js/maptable.min.js"></script>
    <script src="./js/maptable.percentile.helper.js"></script>
</head>
<body>



<h1>MapTableMaker</h1>

<p>MapTableMaker allows you to easily create high resolution SVG maps from CSV.
    See <a href="https://github.com/Packet-Clearing-House/MapTableMaker">MapTableMaker website</a>
    for more information. MapTableMaker is open source (MIT) and
    uses <a href="https://github.com/Packet-Clearing-House/maptable">MapTable</a>, also open source (MIT)
    to generate it's maps. </p>

<p>Follow the two steps below to generate your map!</p>

<h2>Step 1 - Enter CSV</h2>

<p>Enter CSV with one country per line.  Countries must be two letters.
    Invalid countries will be ignored.
    Countries can be in any order and can have positive or negative integer values.
    Contries with values are left empty.</p>

<p>Here's an example of 5 countries with positive and negative values:
<pre>
MX,50
IR,22
CA,-22
BR,-51
US,45
</pre>
</p>

<p>Optionally, you can enter a URL for a logo to use to watermark the map in the lower left.</p>

<form action="./" method="post">
    CSV:<br/>
    <textarea name="csv" rows="5"><?php
    if (!empty($_POST['csv'])){
        echo htmlspecialchars(urldecode($_POST['csv']), ENT_QUOTES, 'UTF-8');
    }
    ?></textarea>

    <p>
    Logo URL (optional):<br/>
    <input type="text" name="logo" value="<?php
    if (!empty($_POST['logo'])){
        echo htmlspecialchars(urldecode($_POST['logo']), ENT_QUOTES, 'UTF-8');
    }
    ?>"/>
    </p>

    <p>
    <input type="submit" value="Generate Preview">
    </p>
</form>


<?php
if (!empty($_POST['csv'])){

?>
    <h2>Step 2 - Preview Map & Download</h2>
    <P>Preview your map here.  If it looks good, click the "Download" button below.</P>
    <div id='vizContainer'></div>

    <script>
        var ranks = null;
        var negativeRanks = null;
        var countKey = 'value';
        var countryKey = 'country';

        function drawMap() {

            var ranks = null;
            var negativeRanks = null;
            var countKey = 'value';
            var countryKey = 'country';

            var viz = d3.maptable('#vizContainer')
                .csv('./echoCsv.php?csv=<?php echo urlencode($_POST['csv']) ?>')
                .map({
                    countryIdentifierKey: countryKey,
                    countryIdentifierType: 'iso_a2',
                    path: './data/countries.topo.json',
                    exportSvg: './exportSvg.php',
                    zoom: false,
                    <?php if (!empty($_POST['logo'])) { ?>
                    watermark: {
                        src: '<?php echo htmlspecialchars($_POST['logo'], ENT_QUOTES, 'UTF-8');?>',
                        width: 130,
                        height: 60,
                        position: "bottom left",
                        style: "opacity:0.1"
                    },
                    <?php } ?>
                    countries: {
                        attr: {
                            fill: {
                                min: "#B4C3D1",
                                max: "#043864",
                                minNegative: "#FFB3B3",
                                maxNegative: "#c32e34",
                                empty: "#f9f9f9",
                                transform: function(val, rawValues) {
                                    val = parseInt(val);
                                    if (ranks == null && rawValues != undefined){
                                        var negativeOnly = false;
                                        ranks = generateRanksFromSingleValue(rawValues, countKey, negativeOnly);
                                    }
                                    if (negativeRanks == null && rawValues != undefined ){
                                        var negativeOnly = true;
                                        negativeRanks = generateRanksFromSingleValue(rawValues, countKey, negativeOnly);
                                    }
                                    if (val < 0){
                                        useNegatives = true;
                                        var toReturn = getPercentile(val, negativeRanks, useNegatives);
                                    } else {
                                        useNegatives = false;
                                        var toReturn = getPercentile(val, ranks, useNegatives);
                                    }

                                    return toReturn;
                                },
                                rollup: function(groupedData) {
                                    if (groupedData[0] != undefined && groupedData[0].chge != 999999) {
                                        return groupedData[0][countKey];
                                    }
                                },
                            },
                            stroke: "#d9d9d9",
                            "stroke-width": 0.5
                        },
                    },
                    title: {
                        bgColor: "white",
                        fontSize: "11",
                        content: function (countShown, countTotal, filtersDescription) {
                            var utc = new Date().toJSON().slice(0, 10);
                            return 'Generated on ' + utc;
                        },
                        source: function () {
                            return 'Made by ' +
                                '<a xlink:href=' +
                                '"https://github.com/Packet-Clearing-House/MapTableMaker"' +
                                ' target="_blank">' +
                                '<tspan font-weight="bold">MapTableMaker</tspan></a> ' +
                                '<a xlink:href=' +
                                '"https://pch.net"' +
                                ' target="_blank">' +
                                '&copy;PCH</a>';
                        }
                    },
                })
                .render();
        }

        drawMap();

    </script>




<?php } ?>
</body>
</html>