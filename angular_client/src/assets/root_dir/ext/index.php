<?php
///////////////////////////////////
//tools/TEA/
///////////////////////////////////
error_reporting(E_ALL);
require_once "php/meta-server.php";
$meta = new MetaServer();


$str = $_SERVER['QUERY_STRING'];
$uri = $_SERVER['REQUEST_URI'];
$uri = explode('?', $uri)[0]; 	//filter off query params fbclid, etc

$path =  substr($uri,1);
$params = explode('/', $path);
array_shift($params);



//:lang/map/:year/:M1/:M2/:T1/:T2/:M3/:M4
$lang = $params[0]=='en'?'en':'lv';
$view  = isset($params[1])==true?$params[1]:'landing';
$year;
$M1;
$M2;
$M2_ext;
$T1;
$T2;
$M3;
$M4;

$uri = '/'.implode('/', $params);
/*
print_r("uri:".$uri.'</br>');
print_r("view:".$view.'</br>');
print_r("lang:".$lang.'</br>');
print_r("params:".sizeof($params).'</br>');
print_r("******************</br>");
*/




if(sizeof($params)==9){
	$view	  = $params[1];
	$year 	= $params[2];
	$M1 	  = $params[3];
	$M2  	  = $params[4];
	$T1  	  = $params[5];
	$T2  	  = $params[6];
	$M3   	= $params[7];
	$M4  	  = $params[8];
}
if(sizeof($params)==10){
	$view	  = $params[1];
	$year 	= $params[2];
	$M1 	  = $params[3];
	$M2  	  = $params[4];
	$M2_ext = $params[5];
	$T1  	  = $params[6];
	$T2  	  = $params[7];
	$M3   	= $params[8];
	$M4  	  = $params[9];
}

//////////////////////////////////////////////////

$owner_name = '';
$owner_site = '';
$host_url='';
$full_path = '';


$html = file_get_contents("template_ext.html");
$config = json_decode(file_get_contents("assets/config/config.json"), true);


switch ($view) {

	case 'landing':
		$metaOB		=  $meta->getMeta('landing',$lang);
		break;

	case 'about':
		$metaOB		=  $meta->getMeta('about',$lang);
		break;

	case 'api':
    $metaOB		=  $meta->getMeta('api',$lang);
    break;

	case 'compare':
		$metaOB 	=  $meta->getMeta('compare', $lang, $year, $M1, $M2, $T1, $T2, $M3, $M4, $M2_ext);
		break;

	default:
	  $metaOB 	=  $meta->getMeta($view, $lang, $year, $M1, $M2, $T1, $T2, $M3, $M4);
	  break;

}

$owner_name 	= $meta->getItem("owner-name",$lang);
$owner_site 	= $meta->getItem("owner-site",$lang);

$host_url 		= $config["hostURL"];
$full_path 		= $host_url.''.$uri;
$stats_id 		= $config['stats_id'];




$html = str_replace("[lang]", $lang, $html);
$html = str_replace("[title]", $metaOB['title'], $html);
$html = str_replace("[description]", $metaOB['description'], $html);
$html = str_replace("[owner_name]", $owner_name, $html);
$html = str_replace("[owner_site]", $owner_site, $html);


$html = str_replace("[meta_TW]", $metaOB['meta_TW'], $html);
$html = str_replace("[meta_TW_w]", $metaOB['meta_TW_w'], $html);
$html = str_replace("[meta_TW_h]", $metaOB['meta_TW_h'], $html);

$html = str_replace("[meta_FB]", $metaOB['meta_FB'], $html);
$html = str_replace("[meta_FB_w]", $metaOB['meta_FB_w'], $html);
$html = str_replace("[meta_FB_h]", $metaOB['meta_FB_h'], $html);


$html = str_replace("[meta_WP]", $metaOB['meta_WP'], $html);
$html = str_replace("[meta_WP_w]", $metaOB['meta_WP_w'], $html);
$html = str_replace("[meta_WP_h]", $metaOB['meta_WP_h'], $html);

//host_url
$html = str_replace("[host_url]", $host_url, $html);
$html = str_replace("[full_path]", $full_path, $html);
$html = str_replace("[stats_id]", $stats_id, $html);

echo $html;

?>
