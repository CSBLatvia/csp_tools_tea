<?php
include("php/conf/db_connector_pdo.php");

class MetaServer {

  private $translations;
  private $conn;


    public function __construct() {
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

    public function getItem($id,$lang){
      if($this->translations==null){
          return 'error - translations not loaded..';
      }
      return $this->translations[$id][$lang];
    }

    public function getMeta($view, $lang, $year=-1, $M1='', $M2='', $T1='', $T2='', $M3='', $M4=''){

        //print_r($this->translations);

        $lang_id = $lang=='lv'?0:1;
        $metaOB  = array('title' => 'empty','description' => 'empty');

        $fb_w = 600; //1200;
        $fb_h = 314; //630;

        $tw_w = 860; //1600;
        $tw_h = 430;  //900;

        $wp_w = 300;
        $wp_h = 300;

        $app_fb = 'https://tools.csb.gov.lv/app_screenshot/?w='.$fb_w.'&h='.$fb_h.'&url=';
        $app_tw = 'https://tools.csb.gov.lv/app_screenshot/?w='.$tw_w.'&h='.$tw_h.'&url=';
        $app_wp = 'https://tools.csb.gov.lv/app_screenshot/?w='.$wp_w.'&h='.$wp_h.'&url=';


        $metaOB['meta_FB'] = '[host_url]/assets/img/meta/facebook_600x314_'.$lang.'.png';
        $metaOB['meta_TW'] = '[host_url]/assets/img/meta/twitter_860x430_'.$lang.'.png';
        $metaOB['meta_WP'] = '[host_url]/assets/img/meta/whatsup_300x300_'.$lang.'.png';

        $metaOB['meta_FB_w'] = $fb_w;
        $metaOB['meta_FB_h'] = $fb_h;
        $metaOB['meta_TW_w'] = $tw_w;
        $metaOB['meta_TW_h'] = $tw_h;
        $metaOB['meta_WP_w'] = $wp_w;
        $metaOB['meta_WP_h'] = $wp_h;



        switch ($view) {

            case 'landing':

              $metaOB['title']         =  $this->translations["META-title-landing"][$lang];
              $metaOB['description']   =  $this->translations["META-description-landing"][$lang];

              break;

            case 'api':

              $metaOB['title']         =  $this->translations["META-title-api"][$lang];
              $metaOB['description']   =  $this->translations["META-description-api"][$lang];

              break;

            case 'about':

              $metaOB['title']         =  $this->translations["META-title-about"][$lang];
              $metaOB['description']   =  $this->translations["META-description-about"][$lang];  

              break;

            case 'map':

              $m1_map = array(
                'workplace' => 'w',
                'place-of-residence' => 'h'
                );
              $m2_map = array(
                'value-produced' => 'vp',
                'added-value' => 'av',
                'number-of-employees' => 'e',
                'number-of-workplaces' => 'e'
                );
              $m3_map = array(
                'industry' => 'i',
                'profession' => 'p',
                'sector' => 's',
                'none' => 'none'
                );
              $t1_map = array(
                'territories-3' => '3',
                'territories-4' => '4',
                'territories-7' => '7'
                );

              $m1 = $m1_map[$M1];         //w,h
              $m2 = $m2_map[$M2];         //value-produced,added-value, number-of-employees
              $m3 = $m3_map[$M3];
              $m4 = $M4;
              $t1 = $t1_map[$T1];
              $t2 = $T2;

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


                if($results==true){
                    $data = $ps->fetch(PDO::FETCH_ASSOC);
                    $json_data = json_decode($data['r_t']);

                    //$metaOB['title'] = $json_data->{'meta_title_main'};
                    $metaOB['title'] =  $this->translations["META-title-map"][$lang];
                    $metaOB['description'] = $json_data->{'map_title'};
                }
              break;
        }
        return $metaOB;
    }


  }


?>
