#!/usr/bin/env node
/* eslint-disable no-console */
/* eslint-disable no-unused-expressions */

const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');
const cheerio = require('cheerio');

function buildInputHtml(argv) {
  if (!argv.csvUrl && !argv.csvData) throw new Error('Missing csvUrl or csvData');

  const resolutionPaths = {
    50: `${path.resolve('./data/countries.topo.50m.json')}`,
    110: `${path.resolve('./data/countries.topo.110m.json')}`,
  };
  const mapData = fs.readFileSync(resolutionPaths[argv.resolution]).toString();

  let csvLine = '';
  if (argv.csvData) {
    csvLine = `.csvData('${argv.csvData.replace(/'/g, '\\\'')}')`;
  } else if (argv.csvUrl) {
    if (argv.csvUrl.startsWith('http')) {
      csvLine = `.csv('${argv.csvUrl}')`;
    } else {
      const csvData = fs.readFileSync(path.resolve(argv.csvUrl)).toString();
      csvLine = `.csvData('${csvData.replace(/'/g, '\\\'').replace(/\n/g, '\\n')}')`;
    }
  }

  return `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>MapTableMaker</title>
    <script src='file://${path.resolve('./js/jquery.js')}'></script>
    <script src='file://${path.resolve('./js/d3.js')}'></script>
    <script src='file://${path.resolve('./js/topojson.js')}'></script>
    <script src='file://${path.resolve('./js/FileSaver.min.js')}'></script>
    <script src='file://${path.resolve('./js/maptable.min.js')}'></script>
    <script src='file://${path.resolve('./js/maptable.percentile.helper.js')}'></script>
  </head>
  <body>
    <div id="vizContainer"></div>
    <script>
      const mapData = '${mapData.replace(/'/g, '\\\'').replace(/\n/g, '\\n')}';
      var ranks = null;
      var negativeRanks = null;
      var countKey = 'value';
      var logoUrl = ${argv.logoUrl ? `'${argv.logoUrl}'` : 'null'};
      var showLegend = ${argv.showLegend};
      var title = ${argv.title ? `'${argv.title}'` : 'null'};
      var countryFormat = '${argv.countryFormat}';
      var usePercentile = ${argv.usePercentile};

      $('#vizContainer').html('');
      var viz = d3.maptable('#vizContainer')${csvLine}
        .map({
            countryIdentifierKey: 'country',
            countryIdentifierType: countryFormat,
            pathData: mapData,
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
                              var val = parseInt(val);
                              var ranks = null;

                              if (!ranks && rawValues) {
                                  negativeOnly = false;
                                  ranks = generateRanksFromSingleValue(rawValues, countKey, negativeOnly);
                              }
                              if (!negativeRanks && rawValues) {
                                  negativeOnly = true;
                                  negativeRanks = generateRanksFromSingleValue(rawValues, countKey, negativeOnly);
                              }
                              if (val < 0) {
                                  useNegatives = true;
                                  toReturn = getPercentile(val, negativeRanks, useNegatives);
                              } else {
                                  useNegatives = false;
                                  toReturn = getPercentile(val, ranks, useNegatives);
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
    </script>
  </body>
</html>`;
}

async function main(argv) {
  try {
    const inputHtmlBody = buildInputHtml(argv);
    const inputHtmlPath = path.resolve(`./tmp/${argv.name}.html`);
    fs.writeFileSync(inputHtmlPath, inputHtmlBody);
    const outputSvgPath = path.resolve(`${path.resolve(argv.outputDir)}/${argv.name}.svg`);
    const outputPngPath = path.resolve(`${path.resolve(argv.outputDir)}/${argv.name}.png`);

    console.log('Starting headless browser...');
    const browser = await puppeteer.launch({
      headless: true,
    });
    const page = await browser.newPage();
    await page.setViewport({ width: argv.width, height: argv.height });

    console.log(`Generating map for ${argv.name}...`);
    await page.goto(`file://${inputHtmlPath}`, { waitUntil: 'networkidle0' });

    const content = await page.content();
    const $ = cheerio.load(content);
    $('#mt-map').find('div').remove();
    fs.writeFileSync(outputSvgPath, $('#mt-map').html());
    console.log(` Saved SVG file to: file://${outputSvgPath}`);

    // Screenshot
    await page.screenshot({ path: outputPngPath });
    console.log(` Saved PNG file to: file://${outputPngPath}`);

    // Clean
    await browser.close();
    // fs.rmSync(inputHtmlPath);
  } catch (e) {
    throw new Error(e.message);
  }
}

const defaultFileName = `${Date.now()}-${Math.floor(Math.random() * 10000)}`;

require('yargs')
  .scriptName('npx maptablemaker')
  .usage('$0 <cmd> [args]')
  .command('generate [csvUrl]', 'Generate a map from a CSV', (yargs) => {
    yargs.positional('csvUrl', {
      type: 'string',
      description: 'Absolute path or remote URL of the CSV file',
    });

    yargs.positional('csvData', {
      type: 'string',
      description: 'CSV data',
    });

    yargs.positional('outputDir', {
      type: 'string',
      default: path.resolve('./output'),
      description: 'Absolute path of the folder',
    });

    yargs.positional('name', {
      type: 'string',
      default: defaultFileName,
      description: 'Filename of the image',
    });

    yargs.positional('showLegend', {
      type: 'boolean',
      default: false,
      description: 'Show Legend',
    });

    yargs.positional('title', {
      type: 'string',
      default: null,
      description: 'Title (optional - shown in lower left below logo)',
    });

    yargs.positional('logoUrl', {
      type: 'string',
      default: null,
      description: 'SVG Logo URL/absolute path (optional - shows as a watermark in the lower left)',
    });

    yargs.positional('usePercentile', {
      type: 'boolean',
      default: false,
      description: 'Use Percentile Color Spread',
    });

    yargs.positional('resolution', {
      type: 'number',
      default: 50,
      description: 'Map Resolution/Download Size',
      choices: [50, 110],
    });

    yargs.positional('width', {
      type: 'number',
      default: 1600,
      description: 'Map width',
    });

    yargs.positional('height', {
      type: 'number',
      default: 900,
      description: 'Map height',
    });

    yargs.positional('countryFormat', {
      type: 'string',
      default: 'iso_a2',
      description: 'Country CSV Format (ISO)',
      choices: ['iso_a2', 'iso_a3'],
    });
  }, (argv) => {
    main(argv)
      .then(() => console.log('Map generated'))
      .catch((error) => console.error(error.message));
  })
  .help()
  .argv;
