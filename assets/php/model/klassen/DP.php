<?php

// Mit dieser Klasse wird der Verbindungsaufbau mit der Datenbak hergesstellt.
// Die Klasse und deren Methoden sind statisch definiert, da es keine eigene Instanz braucht, weil hier keine DAten gespeichter werden


class DB
{
    private static $db = null;

    public static function get() {

        if (DB::$db == null) {
            $servername = "localhost";
            $db_name = "techfabr_bruno"; // mydb
            $username = "techfabr_bruno"; // root
            $password = "se#5tu*7AuA*9L"; // root

            // PHP Error HAndling  - bei einem FEhler wird das script nicht einfach beendet, sondern es wird zuerst in den Catch gesprungen. Dort hat man die Möglichkeit den Fehler zu
            // beheben und die Applikation aufrech zu erhalten
            // Als Problemlösung ist in Catch im Moment nur die Ausgabe des Fehlers vorgesehen - das Problem muss im Moment manuell behoben werden und die Seite neu geladen werden
            try {
                $conn = new PDO ("mysql:host=$servername;dbname=$db_name;charset=utf8", $username, $password);

                // set PDO error mode to exception
                $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

                DB::$db = $conn;
            }
            catch (PDOException $e) {
                die("Connection failed: " . htmlspecialchars( $e->getMessage() ));
            }
        }
        return DB::$db;
    }
}

