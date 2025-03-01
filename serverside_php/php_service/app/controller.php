<?php
include("app/helpers.php");
include("app/request.php");


// remove header
header_remove('ETag');
header_remove('Pragma');
header_remove('Cache-Control');
header_remove('Last-Modified');
header_remove('Expires');

// set header
header('Expires: Thu, 1 Jan 1970 00:00:00 GMT');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('Cache-Control: post-check=0, pre-check=0',false);
header('Pragma: no-cache');



class Controller{
	function __construct(){

		if(!isset($_GET['db'])){
			errorResponse(StatusCodes::ERROR_WRONG_GET_PARAMS);
		}

		$db = validateString($_GET['db']);


			switch($db){
				case "data-table-list":
					$this->dataTableList();
					break;
				case "menu-profs":
					$this->menuProfs();
					break;
				case "menu-naces":
					$this->menuNaces();
					break;
				case "menu-sectors":
					$this->menuSectors();
					break;
				case "menu-territory-name":
					$this->menuTerritoryName();
					break;
				case "menu-territories":
					$this->menuTerritories();
					break;
                case "menu-years":
                    $this->menuYears();
                    break;
                case "menu-scatter-values":
                    $this->menuScatterValues();
                    break;
                case "menu-scatter-links":
                    $this->menuScatterLinks();
                    break;
            ////////////////// ext-components ///////////////////////
				case "map-centroids":
                	$this->dataMapCentroids();
                	break;
				case "map-viz":
                	$this->dataMapViz();
                	break;
                case "flow-chart":
                    $this->dataFlowChart();
                	break;
                case "lines-chart":
                    $this->dataLinesChart();
                	break;
                case "map-territory-info":
                    $this->dataMapTerritoryInfo();
                	break;
                case "map-territory-info-home":
                    $this->dataMapTerritoryInfoHome();
                	break;
                case "percentage-bar":
                    $this->dataPercentageBar();
                	break;
                case "percentage-list":
                    $this->dataPercentageList();
                	break;
                case "pie-chart":
                    $this->dataPieChart();
                	break;
                case "scatter-plot":
                    $this->dataScatterPlot();
                	break;
            /////////////////////////////////////////////////////////
                case "pop":
                    $this->popTexts();
                    break;
                case "title":
                    $this->titleTexts();
                    break;
                case "meta-client":
                    $this->metaClient();
                    break;
				case "translations":
                	$this->translations();
                	break;
                case "route":
                	$this->route();
                	break;
                /////////////////////////////
				default:
					errorResponse(StatusCodes::ERROR_WRONG_GET_PARAMS);
			}
	}


    ///////////// ext-components ////////////
	function dataFlowChart(){
		include("app/models/ext-components/flow_chart.php");
		$obj = new FlowChart();
		$get = $obj->getList();
	}
	function dataLinesChart(){
		include("app/models/ext-components/lines_chart.php");
		$obj = new LinesChart();
		$get = $obj->getList();
	}
	function dataMapTerritoryInfo(){
		include("app/models/ext-components/map_territory_info.php");
		$obj = new MapTerritoryInfo();
		$get = $obj->getList();
	}
	function dataMapTerritoryInfoHome(){
		include("app/models/ext-components/map_territory_info_home.php");
		$obj = new MapTerritoryInfoHome();
		$get = $obj->getList();
	}
	function dataPercentageBar(){
		include("app/models/ext-components/percentage_bar.php");
		$obj = new PercentageBar();
		$get = $obj->getList();
	}
	function dataPercentageList(){
		include("app/models/ext-components/percentage_list.php");
		$obj = new PercentageList();
		$get = $obj->getList();
	}
	function dataPieChart(){
		include("app/models/ext-components/pie_chart.php");
		$obj = new PieChart();
		$get = $obj->getList();
	}
	function dataScatterPlot(){
		include("app/models/ext-components/scatter_plot.php");
		$obj = new ScatterPlot();
		$get = $obj->getList();
	}
	function dataMapViz(){
    	include("app/models/ext-components/map_viz.php");
        $obj = new MapViz();
        $get = $obj->getList();
    }
	function dataMapCentroids(){
    	include("app/models/ext-components/map_centroids.php");
        $obj = new MapCentroids();
        $get = $obj->getList();
    }
	////////////////////////////////////////
	//data list & data download
	function dataTableList(){
		include("app/models/data/data_table_list.php");
		$obj = new DataTableList();
		$get = $obj->getList();
	}

	// menu lists
	function menuProfs(){
		include("app/models/menu/menu_profs.php");
		$obj = new MenuProfs();
		$get = $obj->getList();
	}
	function menuNaces(){
		include("app/models/menu/menu_naces.php");
		$obj = new MenuNaces();
		$get = $obj->getList();
	}
	function menuSectors(){
		include("app/models/menu/menu_sectors.php");
		$obj = new MenuSectors();
		$get = $obj->getList();
	}
	function menuTerritoryName(){
		include("app/models/menu/menu_territory_name.php");
		$obj = new MenuTerritoryName();
		$get = $obj->getList();
	}
	function menuTerritories(){
		include("app/models/menu/menu_territories.php");
		$obj = new MenuTerritories();
		$get = $obj->getList();
	}
    function menuYears(){
      	include("app/models/menu/menu_years.php");
       	$obj = new MenuYears();
       	$get = $obj->getList();
    }
    function menuScatterValues(){
        include("app/models/menu/menu_scatter_values.php");
        $obj = new MenuScatterValues();
        $get = $obj->getList();
    }
    function menuScatterLinks(){
        include("app/models/menu/menu_scatter_links.php");
        $obj = new MenuScatterLinks();
        $get = $obj->getList();
    }
    function popTexts(){
        include("app/models/pop/pop.php");
        $obj = new Pop();
        $get = $obj->getList();
    }
    function titleTexts(){
        include("app/models/title/title.php");
        $obj = new Title();
        $get = $obj->getList();
    }
    function metaClient(){
        include("app/models/meta/meta-client.php");
        $obj = new MetaClient();
        $get = $obj->getList();
    }
    function translations(){
       include("app/models/translations/translations.php");
       $obj = new Translations();
       $get = $obj->getList();
    }
    function route(){
       include("app/models/route/route.php");
       $obj = new Route();
       $get = $obj->getList();
    }
    function sitemap(){
       include("app/models/sitemap/sitemap.php");
       $obj = new SiteMap();
       $get = $obj->getList();
    }

}//class end
?>
