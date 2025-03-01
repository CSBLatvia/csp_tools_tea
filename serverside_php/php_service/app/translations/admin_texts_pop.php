<?php
include("app/translations/conf/db_connector_editor.php");



class AdminTextsPop{

    protected $conn;
    protected $DATA;
    protected $ACTION;
    protected $TABLE;



	function __construct(){

            $db = DBConnectorEditor::getInstance();
            $this->conn = $db->connection(); 

            header("Access-Control-Allow-Origin: *");
		    header("Content-Type:application/json");
	}
   
    function load_list(){

                $ps = $this->conn->prepare('SELECT * FROM tea_dev.texts_pop ORDER BY p_id ASC');
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

    function modify_item($data){
        //
        /*
        p_id,
        home_work,
        indicator_type,
        selected_territ,
        indicator_selected,

        breakdown_selected,
        request_type, 
        text_display_lv,
        text_display_en, 
        sql_string_from_join, 
        sql_string_where
        */
        $this->DATA = $data;
        $p_id = $this->DATA->data->p_id;
        $home_work = $this->DATA->data->home_work;
        $indicator_type = $this->DATA->data->indicator_type;
        $selected_territ = $this->DATA->data->selected_territ;
		$indicator_selected = $this->DATA->data->indicator_selected;

        $breakdown_selected = $this->DATA->data->breakdown_selected;
        $request_type = $this->DATA->data->request_type;
        $text_display_lv = $this->DATA->data->text_display_lv;
        $text_display_en = $this->DATA->data->text_display_en;

        $sql_string_from_join = $this->DATA->data->sql_string_from_join;
        $sql_string_where = $this->DATA->data->sql_string_where;

        $ps = $this->conn->prepare("UPDATE tea_dev.texts_pop SET
            home_work=:home_work,
            indicator_type=:indicator_type,
            selected_territ=:selected_territ,
            indicator_selected=:indicator_selected,

            breakdown_selected=:breakdown_selected,
            request_type=:request_type,
            text_display_lv=:text_display_lv,
            text_display_en=:text_display_en,

            sql_string_from_join=:sql_string_from_join,
            sql_string_where=:sql_string_where

          WHERE p_id=:p_id;");

        $results = $ps->execute([
            ':p_id' => $p_id,
            ':home_work' => $home_work,
            ':indicator_type' => $indicator_type,
            ':selected_territ' => $selected_territ,
            ':indicator_selected' => $indicator_selected,

            ':breakdown_selected' => $breakdown_selected,
            ':request_type' => $request_type,
            ':text_display_lv' => $text_display_lv,
            ':text_display_en' => $text_display_en,

            ':sql_string_from_join' => $sql_string_from_join,
            ':sql_string_where' => $sql_string_where
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
