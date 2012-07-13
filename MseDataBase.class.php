<?php
/*
 * DB management class
 */

class MseDataBase{
    private static $_instance = null;
    private $db;
    
    private function __construct() {
        $dsn = 'mysql:host='.$dbConfig['server'].';dbname='.$dbConfig['db'];
        $user = $dbConfig['login'];
        $password = $dbConfig['mdp'];
        try {
            $this->db = new PDO($dsn, $username, $password, $options);;
        }
        catch (PDOException $e) {
            die('Erreur : ' . $e->getMessage());
        }
    }
    
    public function getDb(){return $this->db;}
    
    public static function getInstance() {
        if(is_null(self::$_instance)) {
            self::$_instance = new MseDataBase();  
        }
        
        return self::$_instance;
    }
}

?>