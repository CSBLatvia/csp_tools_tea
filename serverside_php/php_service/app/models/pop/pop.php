<?php
include("conf/db_connector_pdo.php");

class Pop {
	protected $conn;

	function __construct() {
		$db = DBConnectorPDO::getInstance();
        $this->conn = $db->connection();
	}

	function getList() {
		if (!isset($_GET['lang']) || !isset($_GET['year']) || !isset($_GET['m1']) || !isset($_GET['m2']) || !isset($_GET['m3']) || !isset($_GET['m4']) || !isset($_GET['t1']) || !isset($_GET['t2']) || !isset($_GET['region_over']) || !isset($_GET['type'])  ) {
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
		$region_over = validateString($_GET['region_over']);
		$type = validateString($_GET['type']);  //over,panel

            /*
            SELECT tea_dev.generate_text_pop(
            'EN', --<lang text>
            '2017', --<reference_period int>,
            'workplace', --<home_work text>,
            'added-value', --<indicator_type text>,
            'territories-3', --<territ_level text>,
            'all',--<selected_territ text>,
            'none', --<indicator_selected text>,
            'none', --<breakdown_selected text>,
            'over', --<request_type text> [over, selected, panel]
            'LV0130000' --<over_territory text>
            )
            */
        $time = microtime(true);
        $ps = $this->conn->prepare('SELECT * FROM tea_dev.generate_text_pop(:lang, :year, :m1, :m2, :t1, :t2, :m3, :m4, :type, :region_over)');
        $results = $ps->execute([
               ':lang' => $lang,
               ':year' => $year,
               ':m1' => $m1,
               ':m2' => $m2,
               ':t1' => $t1,
               ':t2' => $t2,
               ':m3' => $m3,
               ':m4' => $m4,
               ':type' => $type,
               ':region_over' => $region_over
        ]);
		/////////////////////////////////////
            try{
                        if($results==true){
                              $data = $ps->fetch(PDO::FETCH_ASSOC);
                              //print_r($data);
                              $arr=[];
                              $arr['data'] =  array('html'=>$data['r_t'],'deb_par'=>$data['deb_par'],'deb_sql'=>$data['deb_sql'],'deb_r_id'=>$data['deb_r_id']);
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
