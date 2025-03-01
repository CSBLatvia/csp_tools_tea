<?php
include("conf/db_connector_pdo.php");

class MapCentroids {
	protected $conn;

	function __construct() {
		$db = DBConnectorPDO::getInstance();
        $this->conn = $db->connection();
	}

	function getList() {
		if (!isset($_GET['t1']) || !isset($_GET['year'])) {
            errorResponse(StatusCodes::ERROR_WRONG_GET_PARAMS);
		}

		$year = validateNumber($_GET['year']);
		$level = validateNumber($_GET['t1']);

        //////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////
        $time = microtime(true);
        $time_data;
        $time_data_encode;

        $ps = $this->conn->prepare('SELECT * FROM tea_dev.get_map_centroids(:level, :year)');
        $results = $ps->execute([
                        ':level' => $level,
                        ':year' => $year
        ]);
            try{
                        if($results==true){
                              $data = $ps->fetch(PDO::FETCH_ASSOC);


                              $time_data = round((microtime(true)-$time)*1000).' ms';
                              $time_encode_start = microtime(true);

                              $json_data = json_decode($data['get_map_centroids']);

                              $arr=[];
                              $arr['data'] = $json_data->data;
                              $arr['info'] = 'ok';
                              $arr['time_to_get_data'] = $time_data;
                              $arr['time_to_encode'] =  round((microtime(true)-$time_encode_start)*1000).' ms';
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
