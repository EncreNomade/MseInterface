<?php
/*
 * DB management class
 */

class MseDataBase{
    private static $_instance = null;
    
    private function __construct() {
        $dsn = 'mysql:host='.$dbConfig['server'].';dbname='.$dbConfig['db'];
        $user = $dbConfig['login'];
        $password = $dbConfig['mdp'];
        try {
            return new PDO($dsn, $username, $password, $options);;
        } 
        catch (PDOException $e) {
            die('Erreur : ' . $e->getMessage());
        }
    }
    
    public static function getInstance() {
        if(is_null(self::$_instance)) {
            self::$_instance = new MseDataBase();  
        }
        
        return self::$_instance;
    }
}

?>