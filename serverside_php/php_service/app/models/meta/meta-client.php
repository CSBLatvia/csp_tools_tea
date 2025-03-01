<?php
header("Content-Type:application/json");
include("../php/conf/db_connector_pdo.php");


class MetaClient {

  private $translations;
  private $conn;


    public function __construct() {
        $this->translations = json_decode(file_get_contents("../assets/config/translations.json"), true);
        $db = DBConnectorPDO::getInstance();
        $this->conn = $db->connection();
        $this->loadTranslations();
    }
    private function loadTranslations(){
            try{
                  $ps = $this->conn->prepare("SELECT variable_name AS id, lv, en  FROM  tea_dev.translations;");
                  $results = $ps->execute([]);

                  if($results==true){

                      $data = $ps->fetchAll(PDO::FETCH_ASSOC);
                      $arr = [];
                      foreach ($data as $item) {
                        $arr[$item['id']] = array('lv' => $item['lv'], 'en' => $item['en']);
                      }
                      $this->translations = $arr;


                  }else{
                      $this->translations = null;
                  }
            }
            catch (PDOException $e) {
              $this->translations = null;
            }
            ////////////////////////////////
    }
    public function getList(){

                  if (!isset($_GET['view']) || !isset($_GET['lang']) ) {
                    errorResponse(StatusCodes::ERROR_WRONG_GET_PARAMS);
                  }

                   $view = '';
                   $view = validateString($_GET['view']);
                   $lang = validateString($_GET['lang'])=='lv'?'lv':'en';

                    //////////////////////////////////////////////////////
                    $vo = array('title' => '','description' => '');

                    $title = '';
                    $description = '';
                    $arr = [];

                    switch ($view) {

                        case 'landing':
                            $title          =  $this->translations["META-title-landing"][$lang];
                            $description    =  $this->translations["META-description-landing"][$lang];
                            $arr["data"]    = array('title' => $title,'description' => $description);
                            $arr["info"]    = 'ok';
                        break;

                        case 'about':
                            $title          =  $this->translations["META-title-about"][$lang];
                            $description    =  $this->translations["META-description-about"][$lang];
                            $arr["data"]    = array('title' => $title,'description' => $description);
                            $arr["info"]    = 'ok';
                        break;

                        case 'api':
                            $title          =  $this->translations["META-title-api"][$lang];
                            $description    =  $this->translations["META-description-api"][$lang];
                            $arr["data"]    = array('title' => $title,'description' => $description);
                            $arr["info"]    = 'ok';
                        break;

                        case 'map':
                            if (!isset($_GET['lang']) || !isset($_GET['year']) || !isset($_GET['m1']) || !isset($_GET['m2'])  || !isset($_GET['m3']) || !isset($_GET['m4']) || !isset($_GET['t1']) || !isset($_GET['t2'])  ) {
                              errorResponse(StatusCodes::ERROR_WRONG_GET_PARAMS);
                            }

                                    $title          =  $this->translations["META-title-map"][$lang];
                                    $description    =  '';
                                    ///////////////////////////////////
                                    $year = validateNumber($_GET['year']);
                                    $lang = validateLang($_GET['lang']);

                            		    $m1 = validateString($_GET['m1']);
                            		    $m2 = validateString($_GET['m2']);
                            		    $m3 = validateString($_GET['m3']);
                            		    $m4 = validateString($_GET['m4']);

                            		    $t1 = validateNumber($_GET['t1']);   //3,4,7
                            		    $t2 = validateString($_GET['t2']);

                                    $fields = array("meta_title_main","map_title");
                                    $fields = json_encode($fields);
                                   

                                    $ps = $this->conn->prepare('SELECT r_t from tea_dev.generate_text_title( :fields, :lang, :year, :m1, :m2, :t1, :t2, :m3, :m4)');
                                    $results = $ps->execute([
                                                    ':fields' => $fields,
                                                    ':lang' => $lang,
                                                    ':year' => $year,
                                                    ':m1' => $m1,
                                                    ':m2' => $m2,
                                                    ':t1' => $t1,
                                                    ':t2' => $t2,
                                                    ':m3' => $m3,
                                                    ':m4' => $m4
                                    ]);

                                        try{
                                                    if($results==true){
                                                          $data = $ps->fetch(PDO::FETCH_ASSOC);
                                                          $json_data = json_decode($data['r_t']);

                                                          $arr=[];
                                                          $arr['data']['title'] = $title;
                                                          $arr['data']['description'] = $json_data->{'map_title'};
                                                          $arr['info'] = 'ok';

                                                    }else{
                                                          $arr=[];
                                                          $arr['data'] = [];
                                                          $arr['info'] = 'error';
                                                    }
                                        }
                                        catch (PDOException $e) {
                                                          $arr=[];
                                                          $arr['data'] = [];
                                                          $arr['info'] = 'error';
                                                          $arr['error_info'] = $e->getMessage();
                                        }
                                        ///////////////////////////////////
                        break;
                    }
                    echo json_encode($arr,JSON_UNESCAPED_UNICODE);
    }
  }
?>
