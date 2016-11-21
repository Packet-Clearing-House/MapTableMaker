<?php

class MapTableMaker{

    public static function outtputSVG(){
        if(!empty($_POST['data'])) {
            header("Content-type: image/svg+xml");
            header('Content-Disposition: attachment; filename="MapTableMaker.'.date("m.d.y").'-'.rand(10000,99999).'.svg"');
            echo $_POST['data'];
            exit();
        }
    }

    public static function outputCSV(){
        /**
         * Simple script to echo back CSV from urlEncoded() data
         */

        if (!empty($_GET['csv'])) {
            header("Cache-Control: must-revalidate, post-check=0, pre-check=0");
            header('Content-Description: File Transfer');
            header("Content-type: text/csv");
            header("Content-Disposition: attachment; filename=MapTableMaker.csv");
            header("Expires: 0");
            header("Pragma: public");
            print "country,value\n";
            print htmlspecialchars(urldecode($_GET['csv']), ENT_QUOTES, 'UTF-8');
            exit();
        }
    }

    public static function getIncludes(){
        return "
            <script src='./js/jquery.js'></script>
            <script src='./js/d3.js'></script>
            <script src='./js/topojson.js'></script>
            <script src='./js/maptable.min.js'></script>
            <script src='./js/maptable.percentile.helper.js'></script>
            ";
    }

    public static function getIntroText(){
        return "<h1>MapTableMaker</h1>
            <p>
                MapTableMaker allows you to easily create high resolution SVG maps from CSV.
                See <a href='https://github.com/Packet-Clearing-House/MapTableMaker'>MapTableMaker website</a>
                for more information. MapTableMaker is open source (MIT) and
                uses <a href='https://github.com/Packet-Clearing-House/maptable'>MapTable</a>,
                also open source (MIT) to generate it's maps.
            </p>
            <p>
                Follow the two steps below to generate your map!
            </p>";
    }

    public static function getInstructionsAndForm(){
        return "<h2>Step 1 - Enter CSV</h2>
            <p>
                Enter CSV with one country per line.  Countries must be in the valid
                 format and invalid countries
                will be ignored. Countries can be in any order and can 
                have positive or negative
                integer values. Contries with values are left empty.
            </p>
            <p>
                Here's an example of 5 countries with positive and negative values:
                <pre>
MX,50
IR,22
CA,-22
BR,-51
US,45
                </pre>
            </p>
            
            <p>
                Optionally, you can enter a URL for a logo to use to 
                watermark the map in the lower left.
            </p>
            
            <form action='./' method='post'  id='mapform'>
            
                <p>
                Country CSV Format:<br/>
                2 letter - e.g. 'US' (<a href='https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2'>iso_a2</a>)
                <input type='radio' name='countryFormat' value='iso_a2'  checked='checked'/>
                3 letter - e.g. 'USA'  (<a href='https://en.wikipedia.org/wiki/ISO_3166-1_alpha-3'>iso_a3</a>)
                <input type='radio' name='countryFormat' value='iso_a3' />
                Name - e.g. 'United States'
                <input type='radio' name='countryFormat' value='name' />
                </p>   
                
                Country CSV:<br/>
                <textarea name='csv' rows='5' id='csv'></textarea>
            
                <p>
                SVG Logo URL (optional - shows as a watermark in the lower left):<br/>
                <input type='text' name='logo' id='logo'/>
                </p>
            
                <p>
                Title (optional - shown in lower left below logo):<br/>
                <input type='text' name='title' id='title'/>
                </p>
            
                <p>
                Show Legend:<br/>
                True <input type='radio' name='legend' value='True' />
                False <input type='radio' name='legend' value='False' id='legendNo' checked='checked'/>
                </p>
            
                <p>Use Percentile Color Spread (causes legend missmatch):<br/>
                True <input type='radio' name='usePercentile' value='True'  value='False' checked='checked' />
                False <input type='radio' name='usePercentile' />
                </p>
            
                <p>
                Map Resolution/Download Size:<br/>
                50 meter/3.4MB<input type='radio' name='resolution' value='50'  checked='checked'/>
                110 meter/370k<input type='radio' name='resolution' value='110' />
                </p>
                 
            
                <p>
                <input type='submit' value='Generate Preview'>
                </p>
            </form>
            
            <h2>Step 2 - Preview Map & Download</h2>
            <p>Preview your map here.  If it looks good, click the 'Download' button below.</p>
            ";
        }

    public static function getHtmlPlaceholder(){
        return "<div id='vizContainer'></div>";
    }
     

}