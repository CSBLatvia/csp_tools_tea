<?php
include("conf/db_connector_pdo.php");

class Translations {
	protected $conn;

	function __construct() {
		$db = DBConnectorPDO::getInstance();
        $this->conn = $db->connection();
	}

	function getList() {
/*
SELECT json_object_agg(variable_name, json_build_array(lv, en))
	FROM tea_dev.translations
*/
            $time = microtime(true);
            $ps = $this->conn->prepare('SELECT * FROM tea_dev.translations;');
            $results = $ps->execute([]);

            try{
                        if($results==true){
                              $data = $ps->fetchAll(PDO::FETCH_ASSOC);
                              $arr=[];
                              $arr['data'] = $data;
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
