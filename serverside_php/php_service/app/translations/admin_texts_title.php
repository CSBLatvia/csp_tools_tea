<?php
include("app/translations/conf/db_connector_editor.php");



class AdminTextsTitle{

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

                $ps = $this->conn->prepare('SELECT * FROM tea_dev.texts_title ORDER BY r_id ASC');
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

    	/*
			r_id
			home_work
			indicator_type
			selected_territ
			indicator_selected
			breakdown_selected
			meta_title_main_lv
			meta_title_main_en
			map_title_lv
			map_title_en
			table_title_lv
			table_title_en
			legend_clusters_title_lv
			legend_clusters_title_en
			legend_sizes_title_lv
			legend_sizes_title_en
			legend_circles_title_lv
			legend_circles_title_en
			table_col_1_title_lv
			table_col_1_title_en
			table_col_2_title_lv
			table_col_2_title_en
			table_col_3_title_lv
			table_col_3_title_en
			legend_list_title_lv
			legend_list_title_en
			meta_description_main_lv
			meta_description_main_en
    	*/
        $this->DATA = $data;
        	
        	$r_id = $this->DATA->data->r_id;
			$home_work = $this->DATA->data->home_work;
			$indicator_type = $this->DATA->data->indicator_type;
			$selected_territ = $this->DATA->data->selected_territ;
			$indicator_selected = $this->DATA->data->indicator_selected;
			$breakdown_selected = $this->DATA->data->breakdown_selected;
			$meta_title_main_lv = $this->DATA->data->meta_title_main_lv;
			$meta_title_main_en = $this->DATA->data->meta_title_main_en;
			$map_title_lv = $this->DATA->data->map_title_lv;
			$map_title_en = $this->DATA->data->map_title_en;
			$table_title_lv = $this->DATA->data->table_title_lv;
			$table_title_en = $this->DATA->data->table_title_en;
			$legend_clusters_title_lv = $this->DATA->data->legend_clusters_title_lv;
			$legend_clusters_title_en = $this->DATA->data->legend_clusters_title_en;
			$legend_sizes_title_lv = $this->DATA->data->legend_sizes_title_lv;
			$legend_sizes_title_en = $this->DATA->data->legend_sizes_title_en;
			$legend_circles_title_lv = $this->DATA->data->legend_circles_title_lv;
			$legend_circles_title_en = $this->DATA->data->legend_circles_title_en;
			$table_col_1_title_lv = $this->DATA->data->table_col_1_title_lv;
			$table_col_1_title_en = $this->DATA->data->table_col_1_title_en;
			$table_col_2_title_lv = $this->DATA->data->table_col_2_title_lv;
			$table_col_2_title_en = $this->DATA->data->table_col_2_title_en;
			$table_col_3_title_lv = $this->DATA->data->table_col_3_title_lv;
			$table_col_3_title_en = $this->DATA->data->table_col_3_title_en;
			$legend_list_title_lv = $this->DATA->data->legend_list_title_lv;
			$legend_list_title_en = $this->DATA->data->legend_list_title_en;
			$meta_description_main_lv = $this->DATA->data->meta_description_main_lv;
			$meta_description_main_en = $this->DATA->data->meta_description_main_en;




        $ps = $this->conn->prepare("UPDATE tea_dev.texts_title SET
			home_work = :home_work,
			indicator_type = :indicator_type,
			selected_territ = :selected_territ,
			indicator_selected = :indicator_selected,
			breakdown_selected = :breakdown_selected,
			meta_title_main_lv = :meta_title_main_lv,
			meta_title_main_en = :meta_title_main_en,
			map_title_lv = :map_title_lv,
			map_title_en = :map_title_en,
			table_title_lv = :table_title_lv,
			table_title_en = :table_title_en,
			legend_clusters_title_lv = :legend_clusters_title_lv,
			legend_clusters_title_en = :legend_clusters_title_en,
			legend_sizes_title_lv = :legend_sizes_title_lv,
			legend_sizes_title_en = :legend_sizes_title_en,
			legend_circles_title_lv = :legend_circles_title_lv,
			legend_circles_title_en = :legend_circles_title_en,
			table_col_1_title_lv = :table_col_1_title_lv,
			table_col_1_title_en = :table_col_1_title_en,
			table_col_2_title_lv = :table_col_2_title_lv,
			table_col_2_title_en = :table_col_2_title_en,
			table_col_3_title_lv = :table_col_3_title_lv,
			table_col_3_title_en = :table_col_3_title_en,
			legend_list_title_lv = :legend_list_title_lv,
			legend_list_title_en = :legend_list_title_en,
			meta_description_main_lv = :meta_description_main_lv,
			meta_description_main_en = :meta_description_main_en
        WHERE r_id=:r_id;");

        $results = $ps->execute([
			':r_id' => $r_id,
			':home_work' => $home_work,
			':indicator_type' => $indicator_type,
			':selected_territ' => $selected_territ,
			':indicator_selected' => $indicator_selected,
			':breakdown_selected' => $breakdown_selected,
			':meta_title_main_lv' => $meta_title_main_lv,
			':meta_title_main_en' => $meta_title_main_en,
			':map_title_lv' => $map_title_lv,
			':map_title_en' => $map_title_en,
			':table_title_lv' => $table_title_lv,
			':table_title_en' => $table_title_en,
			':legend_clusters_title_lv' => $legend_clusters_title_lv,
			':legend_clusters_title_en' => $legend_clusters_title_en,
			':legend_sizes_title_lv' => $legend_sizes_title_lv,
			':legend_sizes_title_en' => $legend_sizes_title_en,
			':legend_circles_title_lv' => $legend_circles_title_lv,
			':legend_circles_title_en' => $legend_circles_title_en,
			':table_col_1_title_lv' => $table_col_1_title_lv,
			':table_col_1_title_en' => $table_col_1_title_en,
			':table_col_2_title_lv' => $table_col_2_title_lv,
			':table_col_2_title_en' => $table_col_2_title_en,
			':table_col_3_title_lv' => $table_col_3_title_lv,
			':table_col_3_title_en' => $table_col_3_title_en,
			':legend_list_title_lv' => $legend_list_title_lv,
			':legend_list_title_en' => $legend_list_title_en,
			':meta_description_main_lv' => $meta_description_main_lv,
			':meta_description_main_en' => $meta_description_main_en
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
