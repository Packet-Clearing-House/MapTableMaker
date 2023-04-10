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
            exportSvgClient: 'true',
            markers: {
                groupBy: function(a) {
                    return a.latitude + ", " + a.longitude;
                },
                rollup: function(a) {
                    return a.length;
                },
                attr: {
                    r: {
                        min: "minValue",
                        max: "maxValue",
                        transform: function(v) {
                            return 3 * Math.sqrt(v);
                        },
                        rollup: function(values) {
                            return values.length;
                        },
                    },
                    fill: "red",
                    stroke: "#d9d9d9",
                    "stroke-width": 0.5
                },
                tooltip: function(a) {
                    out = '<div class="arrow"></div>';
                    out += '<h3 class="popover-title"> ' +
                        a.values[0].latitude + ', ' + a.values[0].longitude + '</h3>';

                    return out;
                },
            },
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

function maptablemakerLoaded() {
    // initial load of page, draw empty map @ 110m for a placeholder
    drawMap('./', '', true, '110', '', 'iso_a2', false);
    $('#country-selector').selectToAutocomplete();

    // capture manually adding a country
    $( "#addvalue" ).click(function() {
        var csv = $('#country-selector').val() + "," + $('#manualvalue').val();
        $('#csv').val(csv + "\n" + $('#csv').val());
        $('input:radio[name=countryFormat]')[2].checked = true;
        $('#country-selector>option:eq(0)').attr('selected', true);
        $('#manualvalue').val('');
        $( "#mapform" ).submit();
        return false;
    });


    // fire example map
    $( ".exampleLink" ).click(function() {
        $('#csv').val("MWI,255\nBDI,286\nCAF,358\nNER,427\nCOD,442\nMDG,449\nLBR,457\nGIN,539\nSOM,1542\nGNB,567\nETH,573\nMOZ,585\nAFG,633\nTGO,635\nLIC,640\nRWA,695\nNPL,701\nMLI,704\nBFA,713\nUGA,714\nSLE,765\nCOM,810\nHTI,824\nHPC,899\nBEN,903\nZWE,931\nLDC,952\nTZA,955\nTCD,1024\nLSO,1034\nSEN,1067\nBGD,1086\nKHM,1094\nTJK,1114\nSSD,1115\nTLS,1169\nMMR,1203\nKGZ,1269\nMRT,1274\nPAK,1316\nKEN,1358\nCMR,1407\nGHA,1441\nSAS,1504\nKIR,1509\nFCS,1530\nCIV,1545\nIND,1581\nZMB,1721\nSSA,1776\nSSF,1792\nLAO,1793\nSTP,1810\nDJI,1813\nSDN,1875\nNIC,1963\nLMC,2002\nSLB,2024\nUZB,2036\nVNM,2052\nMDA,2238\nPNG,2268\nHND,2434\nBTN,2560\nPHL,2872\nPSE,2965\nFSM,3057\nUKR,3082\nBOL,3124\nCOG,3147\nVUT,3147\nMAR,3190\nEGY,3198\nNGA,3203\nSWZ,3477\nIDN,3491\nMHL,3529\nCPV,3641\nGEO,3669\nGTM,3673\nPSS,3760\nLKA,3819\nTUV,3826\nARM,3873\nKSV,4051\nGUY,4053\nTON,4113\nSLV,4119\nMNG,4129\nWSM,4172\nLMY,4275\nMNA,4313\nTUN,4420\nALB,4564\nMIC,4706\nPRY,4712\nBIH,4790\nOSS,4802\nBLZ,4831\nJAM,5104\nFJI,5112\nNAM,5408\nJOR,5422\nIRN,5442\nMKD,5455\nDZA,5484\nSST,5965\nTHA,5977\nSRB,6152\nDOM,6163\nEAP,6240\nECU,6345\nIRQ,6420\nZAF,6482\nPER,6541\nLBY,6573\nVCT,6668\nECA,6874\nBWA,7123\nDMA,7244\nMNE,7378\nARB,7386\nCHN,7590\nMDV,7635\nLCA,7647\nBGR,7851\nAZE,7884\nCOL,7903\nUMC,8000\nBLR,8040\nMEA,8377\nGRD,8573\nTKM,9031\nLAC,9091\nEAS,9475\nSUR,9680\nLCN,9869\nROU,9996\nMUS,10016\nLBN,10057\nCSS,10164\nMEX,10325\nCRI,10415\nTUR,10515\nWLD,10721\nGAB,10772\nMYS,11307\nBRA,11384\nPLW,11879\nPAN,11948\nARG,12509\nKAZ,12601\nRUS,12735\nATG,13432\nHRV,13475\nHUN,14028\nCEB,14086\nPOL,14342\nCHL,14528\nBRB,15366\nKNA,15510\nSYC,15543\nLVA,15719\nLTU,16506\nURY,16806\nSVK,18501\nNOC,18590\nGNQ,18918\nOMN,19309\nCZE,19529\nEST,20161\nTTO,21323\nGRC,21498\nPRT,22132\nBHS,22217\nSVN,23999\nSAU,24160\nBHR,24855\nECS,25669\nCYP,27194\nKOR,27970\nESP,29767\nITA,34908\nJPN,36194\nEUU,36422\nISR,37207\nHIC,37755\nOED,38388\nEMU,39589\nHKG,40169\nBRN,40979\nFRA,42732\nKWT,43593\nOEC,43654\nARE,43962\nNZL,44342\nGBR,46331\nBEL,47352\nDEU,47821\nFIN,49823\nCAN,50235\nAUT,51190\nISL,52004\nNLD,52172\nNAC,54195\nIRL,54374\nUSA,54629\nSGP,56284\nSWE,58938\nDNK,60707\nAUS,61925\nCHE,85594\nMAC,96038\nQAT,96732\nNOR,97307\nLUX,116664\nAGO,106664\nGRL,10664\nCUB,10664\nVEN,10664\nYEM,10664\nERI,10664");
        $( "#title" ).val('Random Chart by MapTableMaker!');
        $('input:radio[name=countryFormat]')[1].checked = true;
        $('input:radio[name=resolution]')[1].checked = true;
        $( "#mapform" ).submit();
        return false;
    });

    // reset form
    $( ".resetLink" ).click(function() {
        $('#csv').val("");
        $( "#title" ).val('');
        $('input:radio[name=countryFormat]')[0].checked = true;
        $('input:radio[name=resolution]')[0].checked = true;
        drawMap('./', '', true, '110', '', 'iso_a2', false);
        return false;
    });


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
            './?csv=' + encodeURI($('#csv').val()),
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
}
