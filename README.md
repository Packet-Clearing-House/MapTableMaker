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
  
  [![](./data/screenshot.png)](https://plip.com/MapTableMaker)

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

Finally these two are used to handle requests to echo back CSV as a URL
for MapTable library to include and to save as an SVG.  The ``outtputSVG()``
looking for the ``$_POST['data']`` to be passed and ``outputCSV()`` looks
for ``$_GET['csv']`` to be passed.  Both exit if they see their expected
variables passed and are not empty:

```php
MapTableMaker::outtputSVG();
MapTableMaker::outputCSV;
```

## License

MIT

## Releases

* 1.1 - 11/20/2016 
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
