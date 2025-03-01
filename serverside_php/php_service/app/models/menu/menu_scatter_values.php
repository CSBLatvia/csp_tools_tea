<?php
include("conf/db_connector_pdo.php");

class MenuScatterValues {

    protected $conn;

    function __construct() {
        $db = DBConnectorPDO::getInstance();
        $this->conn = $db->connection();
    }
    function getList() {
        //////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////
        $time = microtime(true);
        $time_data;
        $time_data_encode;
        //SELECT * FROM tea_dev.texts_scatter_axis_menu WHERE scatter_axis_display='w' ORDER BY scatter_axis ASC, scatter_axis_code;
        $ps = $this->conn->prepare('SELECT * FROM tea_dev.texts_scatter_axis_menu ORDER BY scatter_axis ASC, scatter_axis_code');
        $results = $ps->execute([]);
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
