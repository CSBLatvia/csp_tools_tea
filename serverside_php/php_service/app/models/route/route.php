<?php
include("conf/db_connector_pdo.php");

class Route {
  protected $conn;

  function __construct() {
    $db = DBConnectorPDO::getInstance();
        $this->conn = $db->connection();
  }

  function getList() {
        
        $postData = file_get_contents("php://input");

        if(!isset($postData) || empty($postData)){
          return;
        }

      $data = json_decode($postData);

      $route = $data->route;
      $route = str_replace('^', '/', $route);

      //////////////////////////////////////////////////////////

            $ps = $this->conn->prepare('INSERT INTO tea_dev.routes_used (url, date_time) VALUES(:route, now()) ON CONFLICT (url) DO NOTHING;');
            $results = $ps->execute([':route' => $route]);

            try{
                        if($results==true){

                              $arr=[];
                              $arr['info'] = 'ok';
                              echo json_encode($arr,JSON_UNESCAPED_UNICODE);
                        }else{
                              $arr=[];
                              $arr['info'] = 'error';
                              echo json_encode($arr,JSON_UNESCAPED_UNICODE);
                        }
            }
            catch (PDOException $e) {
                              $arr=[];
                              $arr['info'] = 'error';
                              $arr['error_info'] = $e->getMessage();
                              echo json_encode($arr,JSON_UNESCAPED_UNICODE);
            }
    }
}
?>
