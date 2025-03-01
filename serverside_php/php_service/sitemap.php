<?php
header('Content-type: application/xml');
include("conf/db_connector_pdo.php");

    $db = DBConnectorPDO::getInstance();
    $conn = $db->connection();


    $xml = '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';

    $ps = $conn->prepare('SELECT url, date_time FROM tea_dev.routes_used;');
    $results = $ps->execute([]);


                        if($results==true){
                              $data = $ps->fetchAll(PDO::FETCH_ASSOC);

                              foreach ($data as $ob) {
                                    $date_time = new DateTime($ob['date_time']);
                                    $date_time_str = $date_time->format('c');

                                                   $xml.='<url>';
                                                   $xml.='<loc>'.$ob['url'].'</loc>';
                                                   $xml.='<lastmod>'.$date_time_str.'</lastmod>';
                                                   $xml.='<changefreq>monthly</changefreq>';
                                                   $xml.='<priority>1</priority>';
                                                   $xml.='</url>';
                              }

                        }
        
    $xml .= '</urlset>';
    echo $xml;
?>
