<?php

/**
 * Class MapTableMaker
 * Simple static class to ease integration with other web apps
 */
class MapTableMaker{

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
            print "country,value,latitude,longitude\n";
            print htmlspecialchars(urldecode($_GET['csv']), ENT_QUOTES, 'UTF-8');
            exit();
        }
    }

    public static function getIncludes(){
        return "
            <script src='./js/jquery.js'></script>
            <script src='./js/d3.js'></script>
            <script src='./js/topojson.js'></script>
            <script src='./js/FileSaver.min.js'></script>
            <script src='./js/maptable.min.js'></script>
            <script src='./js/maptable.percentile.helper.js'></script>
            <script src='./js/selectToAutocomplete/jquery-ui.min.js'></script>
            <script src='./js/selectToAutocomplete/jquery.select-to-autocomplete.js'></script>
            <LINK REL='STYLESHEET' HREF='./js/selectToAutocomplete/jquery-ui.css' TYPE='text/css' TITLE='global css'>
            ";
    }

    public static function getIntroText(){
        return "<h1>MapTableMaker</h1>
            <p>
                MapTableMaker allows you to easily create high resolution SVG maps from CSV.
                See <a href='https://github.com/Packet-Clearing-House/MapTableMaker'>MapTableMaker website</a>
                for more information. MapTableMaker is open source (MIT) and
                uses <a href='https://github.com/Packet-Clearing-House/maptable'>MapTable</a>,
                also open source (MIT) to generate its maps.
            </p>
            <p>
                Enter CSV with one country per line.  Countries must be in the valid
                 format; invalid countries
                will be ignored. Countries can be in any order.  
                 Values can be positive or negative. 
                Click <a href='' class='exampleLink'>here</a> to see an example 
                (or <a href='' class='resetLink'>here</a> to reset the form).
                
            </p>";
    }

    public static function getInstructionsAndForm($pathToDropDownHTML = NULL){
        $htmlName = "county.names.dropdown.html";
        if($pathToDropDownHTML === NULL){
            $pathToDropDownHTML = dirname(__FILE__) ."/data/" . $htmlName;
        } else {
            $pathToDropDownHTML = $pathToDropDownHTML . $htmlName;
        }

        if (!is_file($pathToDropDownHTML)){
            $countryDropDown = "<div style='background-color: red'><h2>WARNINIG</h2>" .
                "<p>Path to $htmlName not found!</p> <p><pre>{$pathToDropDownHTML}</pre></p>" .
                "<style>#manualvalue, #addvalue {display:none}</style></div>";
        } else {
            $countryDropDown = file_get_contents($pathToDropDownHTML);
        }

        return "<h2>Step 1 - Enter CSV</h2>

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
                
                
                <p>
                CSV (country,value):<br/>
                <textarea name='csv' rows='5' cols='40' id='csv'></textarea><br />
                </p>
                
                <p>
                Add single country and value (forces \"name\" country format):<br/>
                " . $countryDropDown . "
                Value: 
                <input type='text' id='manualvalue' size='5' />
                <input type='submit' id='addvalue' value='Add' /> 
                </p>
                
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