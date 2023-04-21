# MapTableMaker

## About

MapTableMaker is a single page PHP web application which allows you to  host your
own MapTableMaker server. This server can
 easily make and let's you download high resolution SVG maps from your CSV dataset.
MapTableMaker is open source (MIT) and
uses <a href="https://github.com/Packet-Clearing-House/maptable">MapTable</a>, also open source (MIT)
to generate it's maps.

* Here is a screen shot of the web application.  Click it to go to a
live demo:
  
  [![](./data/screenshot.png)](https://plip.com/MapTableMaker/)

## Requirements

* A web server running PHP
* A modern browser capable of running [d3.js](https://d3js.org/)
* A CSV data set with integers and countries in
2 char ([iso_a2](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2)),
3 char ([iso_a3:](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-3))
or full name per GeoJSON.
* A need for high resolution, print ready maps ;)

## 2 Minute Install

1. [Download MapTableMaker](https://github.com/Packet-Clearing-House/MapTableMaker/archive/1.0.zip) to a web accessible directory
1. Uncompress the downloaded file
1. Browse to URL & Enter CSV values
1. Download map!

## Using CLI

1. This has been tested on NodeJS 18 and npm 9
1. Install dependencies. Just run `npm install`
1. Generate your map, example:

```sh
npx maptablemaker generate ./example.csv --name example --showLegend true --title "My example" --countryFormat iso_a2 --usePercentile true --enableTimezones true --enableNight true --isoTime "2021-04-23T16:03:04Z"
```

```text
npx maptablemaker generate [csvUrl]

Generate a map from a CSV

Positionals:
  csvUrl           Absolute path or remote URL of the CSV file          [string]
  csvData          CSV data                                             [string]
  outputDir        Absolute path of the folder                [string] [default:
               "/path/to/output"]
  name             Filename of the image        [string] [default: "random-str"]
  showLegend       Show Legend                        [boolean] [default: false]
  title            Title (optional - shown in lower left below logo)
                                                        [string] [default: null]
  logoUrl          SVG Logo URL/absolute path (optional - shows as a watermark
                   in the lower left)                   [string] [default: null]
  usePercentile    Use Percentile Color Spread        [boolean] [default: false]
  resolution       Map Resolution/Download Size
                                       [number] [choices: 50, 110] [default: 50]
  titleSize        Title font size                    [string] [default: "11px"]
  isoTime          ISO datetime that will be used for the timezone stripes and
                   night layers                         [string] [default: null]
  enableTimezones  Enable timezones stripes           [boolean] [default: false]
  enableNight      Enable night layer                 [boolean] [default: false]
  width            Map width                            [number] [default: 1600]
  height           Map height                            [number] [default: 900]
  countryFormat    Country CSV Format (ISO)
                      [string] [choices: "iso_a2", "iso_a3"] [default: "iso_a2"]

Options:
  --version  Show version number                                       [boolean]
  --help     Show help                                                 [boolean]
```

## Custom Install

MapTableMaker.php is class that has all static methods. The thinking is that
you can use the 2 Minute Install to get up and running with no customizations.
However, if you want to integrate it with an existing app which may have it's
own templating, then you'll want to be able to output the MapTableMaker
in different bits and peices.

The MapTableMaker class has 4 classes used to render the 1 page app
and 2 functions used to handle echoing CSV and saving the SVG.  

If you want to customize
how the app is deployed, you can use the following 4 methods to show the prerequisite
JavaScript includes, form instructions and form:

```php
MapTableMaker::getIncludes();
MapTableMaker::getIntroText();
MapTableMaker::getInstructionsAndForm();
MapTableMaker::getHtmlPlaceholder();
```

To include the javascritp after the includes and form, call:

```html
<script src='./js/MapTableMaker.js'></script>
```

Finally there's a function to echo back CSV as a URL
for MapTable library to include. This exits if it sees
it's expected variable passed and is not empty:

```php
MapTableMaker::outputCSV;
```

## License

MIT

## Releases

* 1.3.0 - 4/10/2023
  * Generate maps using a CLI
* 1.2.4 - 8/20/2018
  * Don't hardcode index.php in js [#12](https://github.com/Packet-Clearing-House/MapTableMaker/issues/12)
* 1.2.3 - 8/20/2018
  * Allow path to be passed for country html per [#10](https://github.com/Packet-Clearing-House/MapTableMaker/issues/10)
* 1.2.2 - 8/20/2018
  * Update to latest maptable 1.6.0, update JSON, update eaxmples [#8](https://github.com/Packet-Clearing-House/MapTableMaker/issues/8)
* 1.2.1 - 7/11/2018
  * Update to latest maptable per [#6](https://github.com/Packet-Clearing-House/MapTableMaker/issues/6)
* 1.2.0 - 12/24/2016
  * Merry Christmas!
  * Fix bug in JS on resetting form
  * Default demo map to lo-res/110m
  * Stub out support for lat/long markers
  * Add option to manually add a country to CSV
* 1.1.1 - 12/22/2016
  * Update to MapTable 1.4.0
  * Add more complex example
  * Simplify readme
  * Remove SVG export via POST, use client side instead
* 1.1.0 - 11/20/2016
  * Port from HTML using POST to PHP using AJAX
  * Create static class with all logic
  * Merge 3 PHP files into 1
  * Add option for 3 letter and full country names as well as 2 letter
  * Add option for title
  * Add option to show legend
  * Add option for 110 meter vs 50 meter resolution
* 1.0.1 - 11/16/2016
  * Fix [#1](https://github.com/Packet-Clearing-House/MapTableMaker/pull/2)
* 1.0.0 - 11/16/2016
  * Initial Release
