<?php

    function makeRequest($conn, $sql, $time){

        $LOG_SQL = true;
        $LOG_TIME = true;

        pg_send_query($conn, $sql);
        $result = pg_get_result($conn);
        $error = pg_result_error($result);
        jsonGenerate($result, $time, $sql, $error, $LOG_SQL, $LOG_TIME);
    }

?>

