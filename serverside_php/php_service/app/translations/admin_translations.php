<?php
include("app/translations/conf/db_connector_admin.php");



class AdminTranslations{

    protected $conn;
    protected $DATA;
    protected $ACTION;
    protected $TABLE;



	function __construct(){

            $db = DBConnectorAdmin::getInstance();
            $this->conn = $db->connection(); 

            header("Access-Control-Allow-Origin: *");
		    header("Content-Type:application/json");
	}
    function load_list(){

                $ps = $this->conn->prepare('SELECT variable_name as id, lv, en, used, html FROM tea_dev.translations ORDER BY id DESC');
                $results = $ps->execute();


                    try{
                                if($results==true){

                                     $data = $ps->fetchAll(PDO::FETCH_ASSOC);
                                     $arr=[];
                                     $arr['data'] = $data;
                                     $arr['info'] = 'ok';
                                     echo json_encode($arr,JSON_UNESCAPED_UNICODE);

                                }else{

                                     $arr=[];
                                     $arr['data'] = [];
                                     $arr['info'] = 'error';
                                     echo json_encode($arr,JSON_UNESCAPED_UNICODE);
                                }
                    }
                    catch (PDOException $e) {
                                     $arr=[];
                                     $arr['data'] = [];
                                     $arr['info'] = 'error';
                                     $arr['error_info'] = $e->getMessage();
                                     echo json_encode($arr,JSON_UNESCAPED_UNICODE);
                    }
    }
    function create_item($data){
        $this->DATA = $data;

        $id = $this->DATA->data->id;
		$lv = $this->DATA->data->name_lv;
		$en = $this->DATA->data->name_en;
        $used = $this->DATA->data->used=='true'?1:0;
        $html = $this->DATA->data->html=='true'?1:0;


        $ps = $this->conn->prepare("INSERT INTO tea_dev.translations (variable_name, lv, en, used, html) VALUES (:id, :lv, :en, :used, :html);");

        $results = $ps->execute([
            ':id' => $id,
            ':lv' => $lv,
            ':en' => $en,
            ':used' => $used,
            ':html' => $html
        ]);

         try{
                    if($results==true){

                                     $arr=[];
                                     $arr['data'] = [];
                                     $arr['info'] = 'ok';
                                     echo json_encode($arr,JSON_UNESCAPED_UNICODE);


                                }else{

                                     $arr=[];
                                     $arr['data'] = [];
                                     $arr['info'] = 'error';
                                     echo json_encode($arr,JSON_UNESCAPED_UNICODE);
                                }
                    }
                    catch (PDOException $e) {
                                     $arr=[];
                                     $arr['data'] = [];
                                     $arr['info'] = 'error';
                                     $arr['error_info'] = $e->getMessage();
                                     echo json_encode($arr,JSON_UNESCAPED_UNICODE);
                    }
    }
    function modify_item($data){

        $this->DATA = $data;
        $id = $this->DATA->data->id;
        $lv = $this->DATA->data->name_lv;
		$en = $this->DATA->data->name_en;
        $used = $this->DATA->data->used=='true'?1:0;
        $html = $this->DATA->data->html=='true'?1:0;

        $ps = $this->conn->prepare("UPDATE tea_dev.translations SET lv=:lv, en=:en, used=:used, html=:html  WHERE variable_name=:id;");

        $results = $ps->execute([
            ':lv' => $lv,
            ':en' => $en,
            ':id' => $id,
            ':used' => $used,
            ':html' => $html
        ]);


         try{
                    if($results==true){

                                     $arr=[];
                                     $arr['data'] = [];
                                     $arr['info'] = 'ok';
                                     echo json_encode($arr,JSON_UNESCAPED_UNICODE);

                                }else{

                                     $arr=[];
                                     $arr['data'] = [];
                                     $arr['info'] = 'error';
                                     echo json_encode($arr,JSON_UNESCAPED_UNICODE);
                                }
                    }
                    catch (PDOException $e) {
                                     $arr=[];
                                     $arr['data'] = [];
                                     $arr['info'] = 'error';
                                     $arr['error_info'] = $e->getMessage();
                                     echo json_encode($arr,JSON_UNESCAPED_UNICODE);
                    }
    }
    function delete_item($data){
               $this->DATA = $data;
       		   $id= $this->DATA->data->id;
               $ps = $this->conn->prepare("DELETE FROM tea_dev.translations WHERE variable_name=:id;");
               $results = $ps->execute([
                   ':id' => $id
               ]);


                try{
                           if($results==true){

                                            $arr=[];
                                            $arr['data'] = [];
                                            $arr['info'] = 'ok';
                                            echo json_encode($arr,JSON_UNESCAPED_UNICODE);

                                       }else{

                                            $arr=[];
                                            $arr['data'] = [];
                                            $arr['info'] = 'error';
                                            echo json_encode($arr,JSON_UNESCAPED_UNICODE);
                                       }
                           }
                           catch (PDOException $e) {
                                            $arr=[];
                                            $arr['data'] = [];
                                            $arr['info'] = 'error';
                                            $arr['error_info'] = $e->getMessage();
                                            echo json_encode($arr,JSON_UNESCAPED_UNICODE);
                           }
    }


}
?>
