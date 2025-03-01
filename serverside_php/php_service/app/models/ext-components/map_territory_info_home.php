<?php
include("conf/db_connector_pdo.php");

class MapTerritoryInfoHome {
	protected $conn;

	function __construct() {
		$db = DBConnectorPDO::getInstance();
        $this->conn = $db->connection();
	}

	function getList() {
        $requiredParams = ['lang', 'year', 'm1', 'm2', 'm3', 'm4', 't1', 't2'];
        foreach ($requiredParams as $param) {
            if (!isset($_GET[$param])) {
                errorResponse(StatusCodes::ERROR_WRONG_GET_PARAMS);
                return;
            }
        }
        ////////////////////////////////////////

        $lang = $_GET['lang'];
        $year = validateNumber($_GET['year']);

		$m1 = validateString($_GET['m1']);
		$m2 = validateString($_GET['m2']);
		$m3 = validateString($_GET['m3']);
        $m4 = validateString($_GET['m4']);

		$t1 = validateNumber($_GET['t1']);  //3,4,7
		$t2 = validateString($_GET['t2']);  //code

        //////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////
        $time = microtime(true);
        $time_data;
        $time_data_encode;

        $ps = $this->conn->prepare('SELECT r_t from tea_dev.a_generate_map_territory_info_home(:lang, :year, :m1, :m2, :m3, :m4, :t1, :t2)');
        $results = $ps->execute([
                        ':lang' => $lang,
                        ':year' => $year,
                        ':m1' => $m1,
                        ':m2' => $m2,
                        ':m3' => $m3,
                        ':m4' => $m4,
                        ':t1' => $t1,
                        ':t2' => $t2
        ]);

            try{
                        if($results==true){
                              $data = $ps->fetch(PDO::FETCH_ASSOC);

                              $time_data = round((microtime(true)-$time)*1000).' ms';
                              $time_encode_start = microtime(true);

                              $json_data = json_decode($data['r_t']);

                              $arr=[];
                              $arr['data'] = $json_data;
                              $arr['info'] = 'ok';
                              $arr['time_to_get_data'] = $time_data;
                              $arr['time_to_encode'] =  round((microtime(true)-$time_encode_start)*1000).' ms';
                              $arr['time'] = round((microtime(true)-$time)*1000).' ms';
                              $arr['now'] = date("Y.m.d, H:i:s");

                              echo json_encode($arr,JSON_UNESCAPED_UNICODE);


                        }else{
                              $arr=[];
                              $arr['data'] = [];
                              $arr['info'] = 'error';
                              $arr['time'] = round((microtime(true)-$time)*1000).' ms';
                              $arr['now'] = date("Y.m.d, H:i:s");
                              echo json_encode($arr,JSON_UNESCAPED_UNICODE);
                        }
            }
            catch (PDOException $e) {
                              $arr=[];
                              $arr['data'] = [];
                              $arr['info'] = 'error';
                              $arr['time'] = round((microtime(true)-$time)*1000).' ms';
                              $arr['now'] = date("Y.m.d, H:i:s");
                              $arr['error_info'] = $e->getMessage();

                              echo json_encode($arr,JSON_UNESCAPED_UNICODE);
            }

    }

}
?>
