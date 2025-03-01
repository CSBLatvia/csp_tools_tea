<?php

function jsonGenerate($result, $time, $sql, $error, $logSql=false, $logTime=false){
		$arr = [];
        $data = [];
        if($result && !$error){
			while ($row = pg_fetch_assoc($result)) {
	  			$data[] = $row;
			}
			$arr['data'] = $data;
			$arr['info'] = 'ok';

			if($logSql==true){
			    $arr['sql'] =  preg_replace('/\s+/', ' ',$sql);
			}
			if($logTime==true){
			    $arr['time'] = round((microtime(true)-$time)*1000).' ms';
			}

			echo json_encode($arr,JSON_UNESCAPED_UNICODE);

		}else{
		    errorResponse(StatusCodes::ERROR_SQL_QUERY,validateError($error), $sql, $logSql);
		}
}
function errorResponse($error, $error_info='', $sql='', $logSql=false){
    $arr = [];
    $arr['info'] = 'error';
	$arr['error_code'] = $error[0];
	$arr['error_info'] = $error[1];
	if($error_info!==''){
	    $arr['error_info'] = $error_info;
	}
	if($logSql==true){
        $arr['sql'] =  preg_replace('/\s+/', ' ',$sql);
    }
	echo json_encode($arr,JSON_UNESCAPED_UNICODE);
}
function validateLang($value){
   return $value=='lv'?'lv':'en';
}
function validateNumber($value){
   return intval($value);
}
function validateString($value){
   //$value = filter_var($str, FILTER_SANITIZE_STRING);
   return preg_replace('/[^A-Za-z0-9\-_]/', '', $value);
}
function validateStringNotNone($value){
   //$value = filter_var($str, FILTER_SANITIZE_STRING);
   $value=='none'?'':$value;
   return preg_replace('/[^A-Za-z0-9\-_]/', '', $value);
}
function validateSearchString($value){
   //$value = filter_var($str, FILTER_SANITIZE_STRING);
   return preg_replace('/[^A-Za-z0-9\-_,ĀČĒĢĪĶĻŅŠŪŽāčēģīķļņšūž]/', ' ', $value);
}
function validateError($value){
    return preg_replace('/\s+/', ' ', validateSearchString($value));
}
?>
