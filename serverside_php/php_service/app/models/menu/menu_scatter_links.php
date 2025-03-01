<?php
include("conf/db_connector_pdo.php");

class MenuScatterLinks {

    protected $conn;

    function __construct() {
        $db = DBConnectorPDO::getInstance();
        $this->conn = $db->connection();
    }
    function getList() {
        //////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////
		if (!isset($_GET['m1'])) {
		    errorResponse(StatusCodes::ERROR_WRONG_GET_PARAMS);
		    return;
		}

		$m1 = validateString($_GET['m1']);

        $time = microtime(true);
        $time_data;
        $time_data_encode;
        //SELECT * FROM tea_dev.texts_scatter_axis_menu WHERE scatter_axis_display='w' ORDER BY scatter_axis ASC, scatter_axis_code;
        $ps = $this->conn->prepare('
                SELECT
                    b.scatter_axis_display,
                    a.code,
                    a.chart_title_lv,
                    a.chart_title_en,
                    a.x_axis_code,
                    a.y_axis_code,
                    b.scatter_axis_code
                    FROM tea_dev.texts_scatter_titles a
                    join tea_dev.texts_scatter_axis_menu b
                    on a.x_axis_code=b.scatter_axis_code and b.scatter_axis=:x
                    join tea_dev.texts_scatter_axis_menu c
                    on a.y_axis_code=c.scatter_axis_code and c.scatter_axis=:y
                WHERE b.scatter_axis_display=:m1
        ');
        $results = $ps->execute([
            ':m1' => $m1,
            ':x' => 'x',
            ':y' => 'y'
        ]);
            try{
                        if($results==true){
                              $data = $ps->fetchAll(PDO::FETCH_ASSOC);


                              $time_data = round((microtime(true)-$time)*1000).' ms';
                              $time_encode_start = microtime(true);

                              $arr=[];
                              $arr['data'] = $data;
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
