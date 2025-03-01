<?php

class DBConnector {

  private $servername = "[db_server]";
  private $username = "[db_user]";
  private $password = "[db_password]";
  private $dbname = "[db_name]";
  private $port = "[db_port]";
  private $conn;
  private static $instance = null;


  private function __construct(){
    $this->connect();
  }
  private function connect(){
    $this->conn = pg_connect("host=".$this->servername." port=".$this->port." dbname=".$this->dbname." user=".$this->username." password=".$this->password."") or die("Connection failed: ".pg_last_error());
    if (pg_last_error()) {
        printf("Connect failed: %s\n", pg_last_error());
        $this->connected = false;
    } else {
        $this->connected = true;
    }
  }

  public static function getInstance()
  {
    if(!self::$instance)
    {
      self::$instance = new DBConnector();
    }

    return self::$instance;
  }

  public function connection(){
    $status = pg_connection_status($this->conn);
    if ($status === PGSQL_CONNECTION_OK) {
        //echo 'db is connected';
    }else {
        //echo 'error - db is not connected';
        $this->connect();
    }
    return $this->conn;
  }
}

?>
