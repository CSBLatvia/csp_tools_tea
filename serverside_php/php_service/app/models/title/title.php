<?php
include("conf/db_connector_pdo.php");

class Title {
	protected $conn;

	function __construct() {
		$db = DBConnectorPDO::getInstance();
        $this->conn = $db->connection();
	}

	function getList() {
		if (!isset($_GET['lang']) || !isset($_GET['year']) || !isset($_GET['m1']) || !isset($_GET['m2']) || !isset($_GET['m3']) || !isset($_GET['m4']) || !isset($_GET['t1']) || !isset($_GET['t2'])  ) {
		    errorResponse(StatusCodes::ERROR_WRONG_GET_PARAMS);
		}

            $year = validateNumber($_GET['year']);
            $lang = validateLang($_GET['lang']);

		    $m1 = validateString($_GET['m1']);
		    $m2 = validateString($_GET['m2']);
		    $m3 = validateString($_GET['m3']);
		    $m4 = validateString($_GET['m4']);

		    $t1 = validateNumber($_GET['t1']);   //3,4,7
		    $t2 = validateString($_GET['t2']);

            //////////////////////////////////////////////////////////
            $fields = array(
            "map_title",
            "table_title",
            "legend_clusters_title",
            "legend_sizes_title",
            "legend_circles_title",
            "legend_list_title",
            "table_col_1_title",
            "table_col_2_title",
            "table_col_3_title"
            );
            $fields = json_encode($fields);

            $time = microtime(true);

            $ps = $this->conn->prepare('SELECT r_t from tea_dev.generate_text_title( :fields, :lang, :year, :m1, :m2, :t1, :t2, :m3, :m4)');
            $results = $ps->execute([
                        ':fields' => $fields,
                        ':lang' => $lang,
                        ':year' => $year,
                        ':m1' => $m1,
                        ':m2' => $m2,
                        ':t1' => $t1,
                        ':t2' => $t2,
                        ':m3' => $m3,
                        ':m4' => $m4
            ]);

            try{
                        if($results==true){
                              $data = $ps->fetch(PDO::FETCH_ASSOC);
                              $json_data = json_decode($data['r_t']);

                              $arr=[];
                              $arr['data'] = $json_data;
                              $arr['info'] = 'ok';
                              $arr['time'] = round((microtime(true)-$time)*1000).' ms';
                              echo json_encode($arr,JSON_UNESCAPED_UNICODE);

                        }else{
                              $arr=[];
                              $arr['data'] = [];
                              $arr['info'] = 'error';
                              $arr['time'] = round((microtime(true)-$time)*1000).' ms';
                              echo json_encode($arr,JSON_UNESCAPED_UNICODE);
                        }
            }
            catch (PDOException $e) {
                              $arr=[];
                              $arr['data'] = [];
                              $arr['info'] = 'error';
                              $arr['time'] = round((microtime(true)-$time)*1000).' ms';
                              $arr['error_info'] = $e->getMessage();
                              echo json_encode($arr,JSON_UNESCAPED_UNICODE);
            }
    }
}
?>
