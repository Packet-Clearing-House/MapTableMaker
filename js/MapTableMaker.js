
// initial load of page, draw empty map @ 110m for a placeholder
drawMap('./index.php', '', true, '110', '', 'iso_a2', false);

// grab the form inputs when it's submitted and render via JS
// return false so the form doesn't actually post
$("#mapform").on("submit", function() {
    if ($('input:radio[name=legend]:checked').val() === "True"){
        var showLegend = true;
    } else {
        var showLegend = false;
    }
    if ($('input:radio[name=usePercentile]:checked').val() === "True"){
        var usePercentile = true;
    } else {
        var usePercentile = false;
    }
    if ($('#csv').val() == undefined || $('#csv').val() == ''){
        alert('You forgot to enter CSV values!');
    }
    // draw map w/ form values
    drawMap(
        './index.php?csv=' + encodeURI($('#csv').val()),
        $('#logo').val(),
        showLegend,
        $('input:radio[name=resolution]:checked').val(),
        $('#title').val(),
        $('input:radio[name=countryFormat]:checked').val(),
        usePercentile
    );
    // stop form from actually submitting
    return false;
});
function drawMap(csvUrl, logoUrl, showLegend, resolution, title, countryFormat, usePercentile) {
    $('#vizContainer').html('');

    var ranks = null;
    var negativeRanks = null;
    var countKey = 'value';
    if (resolution == '50'){
        resolutionUrl = './data/countries.topo.50m.json';
    } else {
        resolutionUrl = './data/countries.topo.110m.json';
    }

    var viz = d3.maptable('#vizContainer')
        .csv(csvUrl)
        .map({
            countryIdentifierKey: 'country',
            countryIdentifierType: countryFormat,
            path: resolutionUrl,
            exportSvg: './index.php',
            zoom: false,
            watermark: {
                src: logoUrl,
                width: 130,
                height: 60,
                position: "bottom left",
                style: "opacity:0.1"
            },
            countries: {
                attr: {
                    fill: {
                        legend: showLegend,
                        min: "#B4C3D1",
                        max: "#043864",
                        minNegative: "#FFB3B3",
                        maxNegative: "#c32e34",
                        empty: "#f9f9f9",
                        transform: function(val, rawValues) {
                            if (usePercentile) {
                                val = parseInt(val);
                                if (ranks == null && rawValues != undefined) {
                                    var negativeOnly = false;
                                    ranks = generateRanksFromSingleValue(rawValues, countKey, negativeOnly);
                                }
                                if (negativeRanks == null && rawValues != undefined) {
                                    var negativeOnly = true;
                                    negativeRanks = generateRanksFromSingleValue(rawValues, countKey, negativeOnly);
                                }
                                if (val < 0) {
                                    useNegatives = true;
                                    var toReturn = getPercentile(val, negativeRanks, useNegatives);
                                } else {
                                    useNegatives = false;
                                    var toReturn = getPercentile(val, ranks, useNegatives);
                                }

                                return toReturn;
                            } else {
                                return val;
                            }
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
                    return title;
                },
                source: function () {
                    return 'Made by ' +
                        '<a xlink:href=' +
                        '"https://github.com/Packet-Clearing-House/MapTableMaker"' +
                        ' target="_blank">' +
                        '<tspan font-weight="bold">MapTableMaker</tspan></a> ' +
                        'Copyright <a xlink:href=' +
                        '"https://pch.net"' +
                        ' target="_blank">' +
                        'PCH</a>';
                }
            },
        })
        .render();
}

